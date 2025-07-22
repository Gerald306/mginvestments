// Payment Service for MG Investments
// Handles MTN MoMo, Airtel Money, and Stanbic Bank payments

import { MTNMoMoClient, createMTNMoMoClient, getMTNMoMoConfig } from './mtnMomoClient';

export interface PaymentRequest {
  amount: number;
  currency: string;
  phoneNumber: string;
  reference: string;
  description?: string;
  payerMessage?: string;
  payeeNote?: string;
}

export interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  reference?: string;
  status?: 'pending' | 'completed' | 'failed' | 'cancelled';
  message?: string;
  error?: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  logo: string;
  description: string;
  instructions: string;
  enabled: boolean;
  currency: string;
  phonePrefix?: string;
}

class PaymentService {
  private apiBaseUrl = 'http://localhost:3001/api'; // Simplified for now
  private mtnMomoClient: MTNMoMoClient;

  constructor() {
    // Initialize MTN MoMo client with your API credentials
    this.mtnMomoClient = createMTNMoMoClient(getMTNMoMoConfig());
  }

  // Available payment methods
  getPaymentMethods(): PaymentMethod[] {
    return [
      {
        id: 'mtn_momo',
        name: 'MTN Mobile Money',
        logo: '📱',
        description: 'Pay securely with MTN MoMo',
        instructions: 'Enter your MTN number and approve the payment request',
        enabled: true,
        currency: 'UGX',
        phonePrefix: '256'
      },
      {
        id: 'airtel_money',
        name: 'Airtel Money',
        logo: '📲',
        description: 'Quick payment with Airtel Money',
        instructions: 'Enter your Airtel number and approve the payment request',
        enabled: true,
        currency: 'UGX',
        phonePrefix: '256'
      },
      {
        id: 'stanbic_bank',
        name: 'Stanbic Bank',
        logo: '🏦',
        description: 'Bank transfer or mobile banking',
        instructions: 'Use Stanbic mobile app or visit any branch',
        enabled: true,
        currency: 'UGX'
      }
    ];
  }

  // Format phone number for Uganda
  private formatPhoneNumber(phoneNumber: string): string {
    // Use MTN MoMo client's formatting for consistency
    return this.mtnMomoClient.formatPhoneNumber(phoneNumber);
  }

  // Validate phone number
  private validatePhoneNumber(phoneNumber: string, provider: string): boolean {
    if (provider === 'mtn_momo') {
      return this.mtnMomoClient.validateMTNPhoneNumber(phoneNumber);
    } else if (provider === 'airtel_money') {
      const formatted = this.formatPhoneNumber(phoneNumber);
      // Airtel prefixes: 70, 75, 74, 20
      return /^256(70|75|74|20)\d{7}$/.test(formatted);
    }

    const formatted = this.formatPhoneNumber(phoneNumber);
    return /^256\d{9}$/.test(formatted);
  }

  // MTN MoMo Request to Pay
  async requestMTNPayment(paymentData: PaymentRequest): Promise<PaymentResponse> {
    try {
      console.log('🔄 Initiating MTN MoMo payment request...');
      
      // Validate phone number
      if (!this.validatePhoneNumber(paymentData.phoneNumber, 'mtn_momo')) {
        throw new Error('Invalid MTN phone number. Please use format: 0771234567 or 256771234567');
      }

      const formattedPhone = this.formatPhoneNumber(paymentData.phoneNumber);
      
      // Prepare MTN MoMo request - matching your library's interface exactly
      const momoRequest = {
        amount: paymentData.amount,
        currency: paymentData.currency || 'UGX', // Uganda Shillings
        phoneNumber: formattedPhone,
        reference: paymentData.reference,
        payerMessage: paymentData.payerMessage || 'Payment for teacher credits',
        payeeNote: paymentData.payeeNote || `Credit purchase - ${paymentData.reference}`
      };

      console.log('📱 MTN MoMo Request (matching your library format):', momoRequest);

      // Call the real MTN MoMo API using your library - exact interface match
      const response = await this.mtnMomoClient.requestPayment({
        amount: momoRequest.amount,
        currency: momoRequest.currency,
        phoneNumber: momoRequest.phoneNumber,
        reference: momoRequest.reference,
        payerMessage: momoRequest.payerMessage,
        payeeNote: momoRequest.payeeNote
      });
      
      if (response.success) {
        console.log('✅ MTN MoMo payment request sent successfully');
        return {
          success: true,
          transactionId: response.referenceId || response.transactionId,
          reference: paymentData.reference,
          status: 'pending',
          message: response.message || 'Payment request sent to your phone. Please approve the transaction.'
        };
      } else {
        throw new Error(response.error || 'Payment request failed');
      }
    } catch (error) {
      console.error('❌ MTN MoMo payment error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment request failed',
        status: 'failed'
      };
    }
  }

  // Airtel Money Request to Pay
  async requestAirtelPayment(paymentData: PaymentRequest): Promise<PaymentResponse> {
    try {
      console.log('🔄 Initiating Airtel Money payment request...');
      
      // Validate phone number
      if (!this.validatePhoneNumber(paymentData.phoneNumber, 'airtel_money')) {
        throw new Error('Invalid Airtel phone number. Please use format: 0701234567 or 256701234567');
      }

      const formattedPhone = this.formatPhoneNumber(paymentData.phoneNumber);
      
      // Simulate Airtel Money request
      const response = await this.simulateAirtelMoneyRequest({
        ...paymentData,
        phoneNumber: formattedPhone
      });
      
      if (response.success) {
        console.log('✅ Airtel Money payment request sent successfully');
        return {
          success: true,
          transactionId: response.transactionId,
          reference: paymentData.reference,
          status: 'pending',
          message: 'Payment request sent to your phone. Please approve the transaction.'
        };
      } else {
        throw new Error(response.error || 'Payment request failed');
      }
    } catch (error) {
      console.error('❌ Airtel Money payment error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment request failed',
        status: 'failed'
      };
    }
  }

  // Stanbic Bank Payment (Manual)
  async requestStanbicPayment(paymentData: PaymentRequest): Promise<PaymentResponse> {
    try {
      console.log('🔄 Generating Stanbic Bank payment details...');
      
      // Generate payment reference for bank transfer
      const bankReference = `MGINV-${paymentData.reference}`;
      
      return {
        success: true,
        transactionId: bankReference,
        reference: paymentData.reference,
        status: 'pending',
        message: `Bank transfer details generated. Reference: ${bankReference}. Please complete payment via Stanbic mobile app or branch.`
      };
    } catch (error) {
      console.error('❌ Stanbic Bank payment error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment setup failed',
        status: 'failed'
      };
    }
  }

  // Check payment status
  async checkPaymentStatus(transactionId: string, paymentMethod: string): Promise<PaymentResponse> {
    try {
      console.log(`🔍 Checking payment status for transaction: ${transactionId}`);

      if (paymentMethod === 'mtn_momo') {
        // Use real MTN MoMo API to check status
        const response = await this.mtnMomoClient.getPaymentStatus(transactionId);
        return {
          success: response.success,
          transactionId,
          status: response.status,
          message: response.message || `Payment status: ${response.status}`,
          error: response.error
        };
      } else {
        // For other payment methods, use simulation for now
        const response = await this.simulatePaymentStatusCheck(transactionId, paymentMethod);
        return response;
      }
    } catch (error) {
      console.error('❌ Payment status check error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Status check failed',
        status: 'failed'
      };
    }
  }

  // Note: MTN MoMo simulation removed - now using real API via mtnMomoClient

  // Simulate Airtel Money request
  private async simulateAirtelMoneyRequest(request: any): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const isValidAirtel = /^256(70|75|74|20)\d{7}$/.test(request.phoneNumber);
    
    if (isValidAirtel) {
      return {
        success: true,
        transactionId: `AIRTEL_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        status: 'pending'
      };
    } else {
      return {
        success: false,
        error: 'Invalid Airtel phone number or network error'
      };
    }
  }

  // Simulate payment status check
  private async simulatePaymentStatusCheck(transactionId: string, paymentMethod: string): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate random success/failure for demo
    const isSuccess = Math.random() > 0.2; // 80% success rate
    
    if (isSuccess) {
      return {
        success: true,
        transactionId,
        status: 'completed',
        message: 'Payment completed successfully'
      };
    } else {
      return {
        success: false,
        status: 'failed',
        error: 'Payment was declined or cancelled'
      };
    }
  }

  // Generate payment reference
  generatePaymentReference(prefix: string = 'MGINV'): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 6).toUpperCase();
    return `${prefix}_${timestamp}_${random}`;
  }
}

export const paymentService = new PaymentService();
export default paymentService;
