import { firebase } from '@/integrations/firebase/client';

export interface TeacherCredit {
  id: string;
  school_id: string;
  credits_purchased: number;
  credits_used: number;
  credits_remaining: number;
  purchase_date: string;
  expiry_date?: string; // null for credits that never expire
  transaction_id?: string;
  amount_paid: number;
  status: 'active' | 'expired' | 'used';
}

export interface TeacherContact {
  id: string;
  school_id: string;
  teacher_id: string;
  contact_date: string;
  credit_used: boolean;
  subscription_type: 'credit' | 'monthly' | 'enterprise';
}

class TeacherCreditService {
  // Get school's current credit balance
  async getCreditBalance(schoolId: string): Promise<{ success: boolean; credits: number; error?: string }> {
    try {
      const result = await firebase
        .from('teacher_credits')
        .select('*')
        .eq('school_id', schoolId)
        .eq('status', 'active');

      if (result.error) {
        throw result.error;
      }

      const totalCredits = result.data?.reduce((sum, credit) => sum + credit.credits_remaining, 0) || 0;

      return {
        success: true,
        credits: totalCredits
      };
    } catch (error) {
      console.error('Error getting credit balance:', error);
      return {
        success: false,
        credits: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Purchase teacher credits
  async purchaseCredits(
    schoolId: string, 
    creditsToAdd: number, 
    amountPaid: number, 
    transactionId?: string
  ): Promise<{ success: boolean; creditId?: string; error?: string }> {
    try {
      const creditData: Omit<TeacherCredit, 'id'> = {
        school_id: schoolId,
        credits_purchased: creditsToAdd,
        credits_used: 0,
        credits_remaining: creditsToAdd,
        purchase_date: new Date().toISOString(),
        amount_paid: amountPaid,
        status: 'active',
        transaction_id: transactionId
      };

      const result = await firebase
        .from('teacher_credits')
        .insert(creditData);

      if (result.error) {
        throw result.error;
      }

      console.log(`✅ Successfully purchased ${creditsToAdd} credits for school ${schoolId}`);

      return {
        success: true,
        creditId: result.data?.[0]?.id
      };
    } catch (error) {
      console.error('Error purchasing credits:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Use a credit to contact a teacher
  async useCredit(
    schoolId: string, 
    teacherId: string
  ): Promise<{ success: boolean; remainingCredits?: number; error?: string }> {
    try {
      // Check if school already contacted this teacher
      const existingContact = await firebase
        .from('teacher_contacts')
        .select('*')
        .eq('school_id', schoolId)
        .eq('teacher_id', teacherId);

      if (existingContact.data && existingContact.data.length > 0) {
        return {
          success: true,
          remainingCredits: await this.getRemainingCredits(schoolId)
        };
      }

      // Get available credits (oldest first)
      const creditsResult = await firebase
        .from('teacher_credits')
        .select('*')
        .eq('school_id', schoolId)
        .eq('status', 'active')
        .gt('credits_remaining', 0)
        .order('purchase_date', { ascending: true });

      if (creditsResult.error) {
        throw creditsResult.error;
      }

      const availableCredits = creditsResult.data || [];
      
      if (availableCredits.length === 0) {
        return {
          success: false,
          error: 'No credits available. Please purchase more credits.'
        };
      }

      // Use the oldest credit first
      const creditToUse = availableCredits[0];
      const newRemainingCredits = creditToUse.credits_remaining - 1;
      const newStatus = newRemainingCredits === 0 ? 'used' : 'active';

      // Update the credit record
      const updateResult = await firebase
        .from('teacher_credits')
        .update({
          credits_used: creditToUse.credits_used + 1,
          credits_remaining: newRemainingCredits,
          status: newStatus
        })
        .eq('id', creditToUse.id);

      if (updateResult.error) {
        throw updateResult.error;
      }

      // Record the teacher contact
      const contactData: Omit<TeacherContact, 'id'> = {
        school_id: schoolId,
        teacher_id: teacherId,
        contact_date: new Date().toISOString(),
        credit_used: true,
        subscription_type: 'credit'
      };

      const contactResult = await firebase
        .from('teacher_contacts')
        .insert(contactData);

      if (contactResult.error) {
        throw contactResult.error;
      }

      const remainingCredits = await this.getRemainingCredits(schoolId);

      console.log(`✅ Credit used successfully. Remaining credits: ${remainingCredits}`);

      return {
        success: true,
        remainingCredits
      };
    } catch (error) {
      console.error('Error using credit:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Check if school can contact teacher (has credits or subscription)
  async canContactTeacher(
    schoolId: string, 
    teacherId: string
  ): Promise<{ canContact: boolean; reason?: string; hasContacted?: boolean }> {
    try {
      // Check if already contacted
      const existingContact = await firebase
        .from('teacher_contacts')
        .select('*')
        .eq('school_id', schoolId)
        .eq('teacher_id', teacherId);

      if (existingContact.data && existingContact.data.length > 0) {
        return {
          canContact: true,
          hasContacted: true,
          reason: 'Already contacted this teacher'
        };
      }

      // Check subscription status
      const profileResult = await firebase
        .from('profiles')
        .select('subscription_status, subscription_expires_at')
        .eq('id', schoolId)
        .single();

      if (profileResult.data) {
        const { subscription_status, subscription_expires_at } = profileResult.data;
        
        // Check for monthly/enterprise subscription
        if (subscription_status === 'premium' || subscription_status === 'enterprise') {
          if (!subscription_expires_at || new Date(subscription_expires_at) > new Date()) {
            return {
              canContact: true,
              hasContacted: false,
              reason: 'Active subscription'
            };
          }
        }
      }

      // Check credit balance
      const creditBalance = await this.getCreditBalance(schoolId);
      
      if (creditBalance.success && creditBalance.credits > 0) {
        return {
          canContact: true,
          hasContacted: false,
          reason: `${creditBalance.credits} credits available`
        };
      }

      return {
        canContact: false,
        hasContacted: false,
        reason: 'No active subscription or credits available'
      };
    } catch (error) {
      console.error('Error checking contact permission:', error);
      return {
        canContact: false,
        reason: 'Error checking permissions'
      };
    }
  }

  // Get remaining credits for a school
  private async getRemainingCredits(schoolId: string): Promise<number> {
    const balance = await this.getCreditBalance(schoolId);
    return balance.credits;
  }

  // Get credit purchase history
  async getCreditHistory(schoolId: string): Promise<{ success: boolean; history: TeacherCredit[]; error?: string }> {
    try {
      const result = await firebase
        .from('teacher_credits')
        .select('*')
        .eq('school_id', schoolId)
        .order('purchase_date', { ascending: false });

      if (result.error) {
        throw result.error;
      }

      return {
        success: true,
        history: result.data || []
      };
    } catch (error) {
      console.error('Error getting credit history:', error);
      return {
        success: false,
        history: [],
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Get teacher contact history
  async getContactHistory(schoolId: string): Promise<{ success: boolean; contacts: TeacherContact[]; error?: string }> {
    try {
      const result = await firebase
        .from('teacher_contacts')
        .select('*')
        .eq('school_id', schoolId)
        .order('contact_date', { ascending: false });

      if (result.error) {
        throw result.error;
      }

      return {
        success: true,
        contacts: result.data || []
      };
    } catch (error) {
      console.error('Error getting contact history:', error);
      return {
        success: false,
        contacts: [],
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

export const teacherCreditService = new TeacherCreditService();
export default teacherCreditService;
