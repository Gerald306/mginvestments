// Data Import Service for Admin System
import { db } from '@/integrations/firebase/config';
import { collection, addDoc, getDocs, updateDoc, doc, query, where, orderBy, deleteDoc } from 'firebase/firestore';
import { 
  ImportedTeacher, 
  ImportedSchool, 
  ImportedJobPosting, 
  ImportSession, 
  DataApprovalRequest,
  ImportStats,
  PublishingStatus,
  ImportError,
  ImportValidationRule
} from '@/types/dataImport';

export class DataImportService {
  
  // Parse CSV/Excel file
  static async parseFile(file: File): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          
          if (file.name.endsWith('.csv')) {
            const lines = text.split('\n');
            const headers = lines[0].split(',').map(h => h.trim());
            const data = lines.slice(1).map(line => {
              const values = line.split(',').map(v => v.trim());
              const obj: any = {};
              headers.forEach((header, index) => {
                obj[header] = values[index] || '';
              });
              return obj;
            }).filter(obj => Object.values(obj).some(val => val !== ''));
            
            resolve(data);
          } else if (file.name.endsWith('.json')) {
            resolve(JSON.parse(text));
          } else {
            reject(new Error('Unsupported file format'));
          }
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }

  // Validate imported data
  static validateData(data: any[], type: 'teachers' | 'schools' | 'jobs'): { valid: any[], errors: ImportError[] } {
    const valid: any[] = [];
    const errors: ImportError[] = [];
    
    const rules = this.getValidationRules(type);
    
    data.forEach((record, index) => {
      let isValid = true;
      
      rules.forEach(rule => {
        const value = record[rule.field];
        
        // Check required fields
        if (rule.required && (!value || value.toString().trim() === '')) {
          errors.push({
            row: index + 1,
            field: rule.field,
            value: value || '',
            error: `${rule.field} is required`,
            severity: 'error'
          });
          isValid = false;
        }
        
        // Check email format
        if (rule.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors.push({
            row: index + 1,
            field: rule.field,
            value: value,
            error: 'Invalid email format',
            severity: 'error'
          });
          isValid = false;
        }
        
        // Check phone format
        if (rule.type === 'phone' && value && !/^\+?[\d\s\-\(\)]+$/.test(value)) {
          errors.push({
            row: index + 1,
            field: rule.field,
            value: value,
            error: 'Invalid phone format',
            severity: 'warning'
          });
        }
        
        // Check allowed values
        if (rule.allowed_values && value && !rule.allowed_values.includes(value)) {
          errors.push({
            row: index + 1,
            field: rule.field,
            value: value,
            error: `Value must be one of: ${rule.allowed_values.join(', ')}`,
            severity: 'error'
          });
          isValid = false;
        }
      });
      
      if (isValid) {
        valid.push({
          ...record,
          status: 'pending',
          import_date: new Date().toISOString()
        });
      }
    });
    
    return { valid, errors };
  }

  // Get validation rules for different data types
  static getValidationRules(type: 'teachers' | 'schools' | 'jobs'): ImportValidationRule[] {
    switch (type) {
      case 'teachers':
        return [
          { field: 'full_name', required: true, type: 'string', min_length: 2 },
          { field: 'email', required: true, type: 'email' },
          { field: 'phone', required: true, type: 'phone' },
          { field: 'subject', required: true, type: 'string' },
          { field: 'experience_years', required: true, type: 'number' },
          { field: 'education_level', required: true, type: 'string', allowed_values: ['Certificate', 'Diploma', 'Bachelor\'s Degree', 'Master\'s Degree', 'PhD'] },
          { field: 'location', required: true, type: 'string' },
          { field: 'hourly_rate', required: false, type: 'number' }
        ];
      
      case 'schools':
        return [
          { field: 'name', required: true, type: 'string', min_length: 2 },
          { field: 'email', required: true, type: 'email' },
          { field: 'phone', required: true, type: 'phone' },
          { field: 'location', required: true, type: 'string' },
          { field: 'type', required: true, type: 'string', allowed_values: ['Primary', 'Secondary', 'University', 'Technical', 'International'] },
          { field: 'subscription_plan', required: true, type: 'string', allowed_values: ['basic', 'standard', 'premium'] }
        ];
      
      case 'jobs':
        return [
          { field: 'title', required: true, type: 'string', min_length: 5 },
          { field: 'school_name', required: true, type: 'string' },
          { field: 'subject', required: true, type: 'string' },
          { field: 'description', required: true, type: 'string', min_length: 20 },
          { field: 'salary_range', required: true, type: 'string' },
          { field: 'location', required: true, type: 'string' },
          { field: 'employment_type', required: true, type: 'string', allowed_values: ['full-time', 'part-time', 'contract'] }
        ];
      
      default:
        return [];
    }
  }

  // Create import session
  static async createImportSession(
    fileName: string, 
    fileType: 'csv' | 'excel' | 'json',
    importType: 'teachers' | 'schools' | 'jobs',
    totalRecords: number,
    importedBy: string
  ): Promise<string> {
    const session: Omit<ImportSession, 'id'> = {
      file_name: fileName,
      file_type: fileType,
      import_type: importType,
      total_records: totalRecords,
      successful_imports: 0,
      failed_imports: 0,
      pending_approvals: totalRecords,
      approved_records: 0,
      rejected_records: 0,
      imported_by: importedBy,
      import_date: new Date().toISOString(),
      status: 'processing',
      errors: []
    };

    const docRef = await addDoc(collection(db, 'import_sessions'), session);
    return docRef.id;
  }

  // Save imported data for approval
  static async saveForApproval(
    data: any[], 
    type: 'teachers' | 'schools' | 'jobs',
    sessionId: string,
    importedBy: string
  ): Promise<string[]> {
    const approvalRequests: string[] = [];
    
    for (const record of data) {
      const approvalRequest: Omit<DataApprovalRequest, 'id'> = {
        type,
        data: record,
        import_session_id: sessionId,
        requested_by: importedBy,
        request_date: new Date().toISOString(),
        status: 'pending'
      };
      
      const docRef = await addDoc(collection(db, 'approval_requests'), approvalRequest);
      approvalRequests.push(docRef.id);
    }
    
    return approvalRequests;
  }

  // Get pending approvals
  static async getPendingApprovals(type?: 'teachers' | 'schools' | 'jobs'): Promise<DataApprovalRequest[]> {
    let q = query(
      collection(db, 'approval_requests'),
      where('status', '==', 'pending'),
      orderBy('request_date', 'desc')
    );
    
    if (type) {
      q = query(
        collection(db, 'approval_requests'),
        where('status', '==', 'pending'),
        where('type', '==', type),
        orderBy('request_date', 'desc')
      );
    }
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as DataApprovalRequest));
  }

  // Approve/Reject data
  static async processApproval(
    requestId: string,
    action: 'approve' | 'reject',
    reviewedBy: string,
    notes?: string
  ): Promise<void> {
    const requestRef = doc(db, 'approval_requests', requestId);
    
    await updateDoc(requestRef, {
      status: action === 'approve' ? 'approved' : 'rejected',
      reviewed_by: reviewedBy,
      review_date: new Date().toISOString(),
      review_notes: notes || ''
    });
    
    // If approved, move to main collection
    if (action === 'approve') {
      // Get the approval request to access the data
      const approvalDoc = await getDocs(query(collection(db, 'approval_requests'), where('__name__', '==', requestId)));
      if (!approvalDoc.empty) {
        const approvalData = approvalDoc.docs[0].data() as DataApprovalRequest;
        const collectionName = approvalData.type === 'teachers' ? 'teachers' : 
                              approvalData.type === 'schools' ? 'schools' : 'job_postings';
        
        await addDoc(collection(db, collectionName), {
          ...approvalData.data,
          status: 'active',
          approved_by: reviewedBy,
          approved_date: new Date().toISOString()
        });
      }
    }
  }

  // Get import statistics
  static async getImportStats(): Promise<ImportStats> {
    const sessionsSnapshot = await getDocs(collection(db, 'import_sessions'));
    const approvalsSnapshot = await getDocs(collection(db, 'approval_requests'));
    
    const sessions = sessionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ImportSession));
    const approvals = approvalsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as DataApprovalRequest));
    
    const totalImports = sessions.length;
    const pendingApprovals = approvals.filter(a => a.status === 'pending').length;
    
    const today = new Date().toISOString().split('T')[0];
    const approvedToday = approvals.filter(a => 
      a.status === 'approved' && a.review_date?.startsWith(today)
    ).length;
    const rejectedToday = approvals.filter(a => 
      a.status === 'rejected' && a.review_date?.startsWith(today)
    ).length;
    
    const successRate = totalImports > 0 ? 
      (approvals.filter(a => a.status === 'approved').length / totalImports) * 100 : 0;
    
    return {
      total_imports: totalImports,
      pending_approvals: pendingApprovals,
      approved_today: approvedToday,
      rejected_today: rejectedToday,
      success_rate: Math.round(successRate),
      most_imported_type: 'teachers', // Could be calculated from actual data
      recent_sessions: sessions.slice(0, 5)
    };
  }
}
