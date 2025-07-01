// MTN MoMo Client for MG Investments
// Uses backend server for secure API calls

import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

interface PaymentRequest {
  amount: number;
  currency: string;
  phoneNumber: string;
  reference: string;
  description?: string;
  payerMessage?: string;
  payeeNote?: string;
}

interface PaymentResponse {
  success: boolean;
  referenceId?: string;
  transactionId?: string;
  status?: 'pending' | 'completed' | 'failed' | 'cancelled';
  message?: string;
  error?: string;
}

interface MoMoKeyConfig {
  apiUserId: string;
  apiKey: string;
  primaryKey: string;
}

interface MoMoClientConfig {
  collection: MoMoKeyConfig;
  remittance: MoMoKeyConfig;
  environment?: 'sandbox' | 'production';
}

export class MTNMoMoClient {
  private backendUrl: string;

  constructor(config: MoMoClientConfig) {
    // Use backend server for all API calls
    this.backendUrl = import.meta.env.DEV ? 'http://localhost:3001' : '/api';
  }

  // Request Payment through backend server
  public async requestPayment(payment: PaymentRequest): Promise<PaymentResponse> {
    try {
      console.log('🔄 Requesting MTN MoMo payment via backend...');
      console.log('📱 Payment request:', {
        amount: payment.amount,
        currency: payment.currency,
        phoneNumber: payment.phoneNumber,
        reference: payment.reference
      });

      const response = await axios.post(`${this.backendUrl}/api/mtn/request-payment`, {
        amount: payment.amount,
        currency: payment.currency,
        phoneNumber: payment.phoneNumber,
        reference: payment.reference,
        description: payment.description,
        payerMessage: payment.payerMessage,
        payeeNote: payment.payeeNote
      });

      console.log('✅ Backend response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Payment request error:', error.response?.data || error.message);
      
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Payment request failed',
        status: 'failed'
      };
    }
  }

  // Check Payment Status through backend server
  public async getPaymentStatus(referenceId: string): Promise<PaymentResponse> {
    try {
      console.log('🔍 Checking payment status via backend...');
      console.log('📋 Reference ID:', referenceId);

      const response = await axios.get(`${this.backendUrl}/api/mtn/payment-status/${referenceId}`);

      console.log('📊 Status response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Status check error:', error.response?.data || error.message);
      
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Status check failed',
        status: 'failed'
      };
    }
  }

  // Validate MTN phone number format
  public validateMTNPhoneNumber(phoneNumber: string): boolean {
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    // MTN Uganda prefixes: 77, 78, 76, 39
    return /^256(77|78|76|39)\d{7}$/.test(cleanPhone);
  }

  // Format phone number to international format
  public formatPhoneNumber(phoneNumber: string): string {
    let clean = phoneNumber.replace(/\D/g, '');
    
    if (clean.startsWith('0')) {
      clean = '256' + clean.substring(1);
    } else if (!clean.startsWith('256')) {
      clean = '256' + clean;
    }
    
    return clean;
  }
}

// Factory function to create MTN MoMo client
export const createMTNMoMoClient = (config: MoMoClientConfig): MTNMoMoClient => {
  return new MTNMoMoClient(config);
};

// Get MTN MoMo configuration from environment variables
export const getMTNMoMoConfig = (): MoMoClientConfig => {
  const getEnvVar = (key: string): string => {
    try {
      return import.meta.env[key] || '';
    } catch (error) {
      console.warn(`Could not access environment variable ${key}`);
      return '';
    }
  };

  return {
    collection: {
      apiUserId: getEnvVar('VITE_MTN_COLLECTION_API_USER_ID') || '',
      apiKey: getEnvVar('VITE_MTN_COLLECTION_API_KEY') || '',
      primaryKey: getEnvVar('VITE_MTN_COLLECTION_PRIMARY_KEY') || '',
    },
    remittance: {
      apiUserId: getEnvVar('VITE_MTN_REMITTANCE_API_USER_ID') || '',
      apiKey: getEnvVar('VITE_MTN_REMITTANCE_API_KEY') || '',
      primaryKey: getEnvVar('VITE_MTN_REMITTANCE_PRIMARY_KEY') || '',
    },
    environment: (getEnvVar('VITE_MTN_ENVIRONMENT') as 'sandbox' | 'production') || 'sandbox',
  };
};

// Export types
export type { PaymentRequest, PaymentResponse, MoMoClientConfig, MoMoKeyConfig };
