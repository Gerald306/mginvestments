import { dataService, School } from '@/services/dataService';
import { firebase } from '@/integrations/firebase/client';

interface DuplicateSchoolGroup {
  originalSchool: School;
  duplicates: School[];
  similarity: number;
}

interface SchoolVerificationResult {
  success: boolean;
  message: string;
  verifiedCount: number;
  duplicatesRemoved: number;
  hiddenSchoolsFound: number;
}

class SchoolManagementService {
  
  // Calculate similarity between two school names
  private calculateSimilarity(name1: string, name2: string): number {
    const normalize = (str: string) => str.toLowerCase().trim().replace(/\s+/g, ' ');
    const n1 = normalize(name1);
    const n2 = normalize(name2);
    
    if (n1 === n2) return 1.0;
    
    // Check if one is contained in the other
    if (n1.includes(n2) || n2.includes(n1)) return 0.8;
    
    // Simple word overlap check
    const words1 = n1.split(' ');
    const words2 = n2.split(' ');
    const commonWords = words1.filter(word => words2.includes(word));
    
    if (commonWords.length > 0) {
      return commonWords.length / Math.max(words1.length, words2.length);
    }
    
    return 0;
  }

  // Find duplicate schools
  async findDuplicateSchools(): Promise<DuplicateSchoolGroup[]> {
    try {
      console.log('🔍 Scanning for duplicate schools...');
      
      const { data: schools, error } = await dataService.getSchools();
      
      if (error || !schools) {
        console.error('❌ Error fetching schools for duplicate detection:', error);
        return [];
      }

      const duplicateGroups: DuplicateSchoolGroup[] = [];
      const processedIds = new Set<string>();

      for (let i = 0; i < schools.length; i++) {
        const school1 = schools[i];
        
        if (processedIds.has(school1.id)) continue;
        
        const duplicates: School[] = [];
        
        for (let j = i + 1; j < schools.length; j++) {
          const school2 = schools[j];
          
          if (processedIds.has(school2.id)) continue;
          
          const similarity = this.calculateSimilarity(school1.school_name, school2.school_name);
          
          // Consider schools with >70% similarity as duplicates
          if (similarity > 0.7) {
            duplicates.push(school2);
            processedIds.add(school2.id);
          }
        }
        
        if (duplicates.length > 0) {
          duplicateGroups.push({
            originalSchool: school1,
            duplicates,
            similarity: 0.8 // Average similarity
          });
          processedIds.add(school1.id);
        }
      }

      console.log(`✅ Found ${duplicateGroups.length} duplicate groups`);
      return duplicateGroups;
      
    } catch (error) {
      console.error('❌ Error finding duplicate schools:', error);
      return [];
    }
  }

  // Remove duplicate schools (keep the most recent or active one)
  async removeDuplicateSchools(): Promise<{ success: boolean; removedCount: number; message: string }> {
    try {
      console.log('🧹 Starting duplicate school removal...');
      
      const duplicateGroups = await this.findDuplicateSchools();
      let removedCount = 0;

      for (const group of duplicateGroups) {
        console.log(`📋 Processing duplicate group for: ${group.originalSchool.school_name}`);
        
        // Sort duplicates by creation date (keep newest) and activity status
        const allSchools = [group.originalSchool, ...group.duplicates];
        const sortedSchools = allSchools.sort((a, b) => {
          // Prioritize active schools
          if (a.is_active !== b.is_active) {
            return b.is_active ? 1 : -1;
          }
          // Then by creation date (newest first)
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });

        const keepSchool = sortedSchools[0];
        const removeSchools = sortedSchools.slice(1);

        console.log(`✅ Keeping: ${keepSchool.school_name} (${keepSchool.id})`);
        
        // Remove duplicate schools
        for (const school of removeSchools) {
          try {
            console.log(`🗑️ Removing duplicate: ${school.school_name} (${school.id})`);
            
            const result = await firebase
              .from('schools')
              .delete()
              .eq('id', school.id);

            if (result.error) {
              console.error(`❌ Error removing school ${school.id}:`, result.error);
            } else {
              removedCount++;
              console.log(`✅ Successfully removed duplicate school: ${school.school_name}`);
            }
          } catch (error) {
            console.error(`❌ Error removing school ${school.id}:`, error);
          }
        }
      }

      return {
        success: true,
        removedCount,
        message: `Successfully removed ${removedCount} duplicate schools`
      };

    } catch (error) {
      console.error('❌ Error removing duplicate schools:', error);
      return {
        success: false,
        removedCount: 0,
        message: 'Failed to remove duplicate schools'
      };
    }
  }

  // Find hidden/inactive schools that could be verified
  async findHiddenSchools(): Promise<School[]> {
    try {
      console.log('🔍 Finding hidden schools for potential verification...');
      
      const { data: schools, error } = await dataService.getSchools();
      
      if (error || !schools) {
        console.error('❌ Error fetching schools:', error);
        return [];
      }

      // Find schools that are inactive but have valid data
      const hiddenSchools = schools.filter(school => 
        !school.is_active && 
        school.school_name && 
        school.school_name.trim().length > 0 &&
        school.location &&
        school.email
      );

      console.log(`✅ Found ${hiddenSchools.length} hidden schools ready for verification`);
      return hiddenSchools;

    } catch (error) {
      console.error('❌ Error finding hidden schools:', error);
      return [];
    }
  }

  // Verify and activate schools
  async verifySchools(schoolIds: string[]): Promise<{ success: boolean; verifiedCount: number; message: string }> {
    try {
      console.log(`🔍 Verifying ${schoolIds.length} schools...`);
      
      let verifiedCount = 0;

      for (const schoolId of schoolIds) {
        try {
          const result = await firebase
            .from('schools')
            .update({ is_active: true })
            .eq('id', schoolId);

          if (result.error) {
            console.error(`❌ Error verifying school ${schoolId}:`, result.error);
          } else {
            verifiedCount++;
            console.log(`✅ Successfully verified school: ${schoolId}`);
          }
        } catch (error) {
          console.error(`❌ Error verifying school ${schoolId}:`, error);
        }
      }

      return {
        success: true,
        verifiedCount,
        message: `Successfully verified ${verifiedCount} schools`
      };

    } catch (error) {
      console.error('❌ Error verifying schools:', error);
      return {
        success: false,
        verifiedCount: 0,
        message: 'Failed to verify schools'
      };
    }
  }

  // Complete school management process
  async manageSchools(): Promise<SchoolVerificationResult> {
    try {
      console.log('🏫 Starting comprehensive school management...');

      // Step 1: Find and remove duplicates
      const duplicateResult = await this.removeDuplicateSchools();
      
      // Step 2: Find hidden schools
      const hiddenSchools = await this.findHiddenSchools();
      
      // Step 3: Auto-verify schools with complete information
      const schoolsToVerify = hiddenSchools
        .filter(school => 
          school.school_name && 
          school.location && 
          school.email &&
          school.school_type
        )
        .map(school => school.id);

      const verificationResult = await this.verifySchools(schoolsToVerify);

      return {
        success: true,
        message: `School management completed: ${duplicateResult.removedCount} duplicates removed, ${verificationResult.verifiedCount} schools verified`,
        verifiedCount: verificationResult.verifiedCount,
        duplicatesRemoved: duplicateResult.removedCount,
        hiddenSchoolsFound: hiddenSchools.length
      };

    } catch (error) {
      console.error('❌ Error in school management process:', error);
      return {
        success: false,
        message: 'School management process failed',
        verifiedCount: 0,
        duplicatesRemoved: 0,
        hiddenSchoolsFound: 0
      };
    }
  }
}

// Create and export singleton instance
export const schoolManagementService = new SchoolManagementService();
export default schoolManagementService;
