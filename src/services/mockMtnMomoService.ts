// Mock MTN MoMo Service for Development and Testing
// This simulates the MTN MoMo API responses for frontend testing

interface MockPaymentRequest {
  amount: number;
  currency: string;
  phoneNumber: string;
  reference: string;
  description?: string;
  payerMessage?: string;
  payeeNote?: string;
}

interface MockPaymentResponse {
  success: boolean;
  referenceId?: string;
  transactionId?: string;
  status?: 'pending' | 'completed' | 'failed' | 'cancelled';
  message?: string;
  error?: string;
}

class MockMtnMomoService {
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private validatePhoneNumber(phoneNumber: string): boolean {
    // MTN Uganda prefixes: 77, 78, 76, 39
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    return /^256(77|78|76|39)\d{7}$/.test(cleanPhone);
  }

  private validateAmount(amount: number): boolean {
    return amount >= 100 && amount <= 1000000; // Min 100 UGX, Max 1M UGX
  }

  public async requestPayment(payment: MockPaymentRequest): Promise<MockPaymentResponse> {
    console.log('🎭 Mock MTN MoMo - Processing payment request...');
    console.log('📱 Request details:', payment);

    // Simulate API processing time
    await this.delay(1500);

    // Validate phone number
    if (!this.validatePhoneNumber(payment.phoneNumber)) {
      return {
        success: false,
        error: 'Invalid MTN phone number. Must be MTN Uganda (77, 78, 76, 39)',
        status: 'failed'
      };
    }

    // Validate amount
    if (!this.validateAmount(payment.amount)) {
      return {
        success: false,
        error: 'Invalid amount. Must be between 100 and 1,000,000 UGX',
        status: 'failed'
      };
    }

    // Validate currency
    if (payment.currency !== 'UGX') {
      return {
        success: false,
        error: 'Invalid currency. Only UGX is supported in Uganda',
        status: 'failed'
      };
    }

    // Generate mock transaction ID
    const transactionId = `MOCK_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Simulate different outcomes based on amount
    if (payment.amount === 999) {
      // Special amount to simulate failure
      return {
        success: false,
        error: 'Insufficient funds in payer account',
        status: 'failed',
        transactionId
      };
    }

    if (payment.amount === 998) {
      // Special amount to simulate timeout
      await this.delay(5000);
      return {
        success: false,
        error: 'Request timeout - please try again',
        status: 'failed',
        transactionId
      };
    }

    // Default success response
    return {
      success: true,
      referenceId: transactionId,
      transactionId,
      status: 'pending',
      message: `Payment request sent to ${payment.phoneNumber}. Please approve on your phone.`
    };
  }

  public async getPaymentStatus(transactionId: string): Promise<MockPaymentResponse> {
    console.log('🎭 Mock MTN MoMo - Checking payment status...');
    console.log('🔍 Transaction ID:', transactionId);

    // Simulate API processing time
    await this.delay(1000);

    // Simulate different statuses based on transaction ID
    const statusRandom = Math.random();
    
    if (statusRandom < 0.7) {
      // 70% chance of success
      return {
        success: true,
        transactionId,
        status: 'completed',
        message: 'Payment completed successfully'
      };
    } else if (statusRandom < 0.9) {
      // 20% chance still pending
      return {
        success: true,
        transactionId,
        status: 'pending',
        message: 'Payment is still being processed'
      };
    } else {
      // 10% chance of failure
      return {
        success: false,
        transactionId,
        status: 'failed',
        error: 'Payment was declined by the payer'
      };
    }
  }

  public async checkBalance(): Promise<{ balance: number; currency: string }> {
    console.log('🎭 Mock MTN MoMo - Checking balance...');
    await this.delay(800);
    
    return {
      balance: Math.floor(Math.random() * 1000000) + 50000, // Random balance between 50k-1M
      currency: 'UGX'
    };
  }
}

// Export singleton instance
export const mockMtnMomoService = new MockMtnMomoService();

// Export types
export type { MockPaymentRequest, MockPaymentResponse };
