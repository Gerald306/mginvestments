// MTN MoMo Client for MG Investments
// Based on your momo-payment-lib from GitHub

import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

// Browser-compatible base64 encoding
const btoa = (str: string): string => {
  if (typeof window !== 'undefined' && window.btoa) {
    return window.btoa(str);
  }
  // Fallback for Node.js environments
  return Buffer.from(str).toString('base64');
};

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

interface PaymentStatus {
  amount: string;
  currency: string;
  status: 'PENDING' | 'SUCCESSFUL' | 'FAILED';
  payer?: {
    partyIdType: string;
    partyId: string;
  };
  reason?: string;
}

export class MTNMoMoClient {
  private collection: MoMoKeyConfig;
  private remittance: MoMoKeyConfig;
  private environment: 'sandbox' | 'production';

  constructor(config: MoMoClientConfig) {
    this.collection = config.collection;
    this.remittance = config.remittance;
    this.environment = config.environment || 'sandbox';
  }

  private getBaseUrl(): string {
    return `https://${this.environment === 'sandbox' ? 'sandbox' : 'api'}.momodeveloper.mtn.com`;
  }

  private async getAuthToken(keyConfig: MoMoKeyConfig): Promise<string> {
    try {
      const response = await axios.post(`${this.getBaseUrl()}/token/`, null, {
        headers: {
          Authorization: `Basic ${btoa(`${keyConfig.apiUserId}:${keyConfig.apiKey}`)}`,
          'Ocp-Apim-Subscription-Key': keyConfig.primaryKey,
        },
      });
      return response.data.access_token;
    } catch (error: any) {
      console.error('Error getting auth token:', error.response ? error.response.data : error.message);
      throw error;
    }
  }

  // Request Payment (Collection Service) - Matches your momo-payment-lib interface
  public async requestPayment(payment: PaymentRequest): Promise<PaymentResponse> {
    const referenceId = uuidv4();

    try {
      console.log('🔄 Requesting MTN MoMo payment...');
      console.log('📱 Payment request:', {
        amount: payment.amount,
        currency: payment.currency,
        phoneNumber: payment.phoneNumber,
        reference: payment.reference
      });

      const authToken = await this.getAuthToken(this.collection);

      const requestBody = {
        amount: payment.amount.toString(),
        currency: payment.currency,
        externalId: payment.reference,
        payer: {
          partyIdType: 'MSISDN',
          partyId: payment.phoneNumber,
        },
        payerMessage: payment.payerMessage || 'Payment Request',
        payeeNote: payment.payeeNote || 'Please complete payment',
      };

      console.log('📤 Sending to MTN API:', requestBody);

      await axios.post(
        `${this.getBaseUrl()}/collection/v1_0/requesttopay`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'X-Reference-Id': referenceId,
            'X-Target-Environment': this.environment,
            'Ocp-Apim-Subscription-Key': this.collection.primaryKey,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('✅ MTN MoMo payment request sent successfully');
      console.log('📋 Reference ID:', referenceId);

      return {
        success: true,
        referenceId,
        transactionId: referenceId,
        status: 'pending',
        message: 'Payment request sent to your phone. Please approve the transaction.',
      };
    } catch (error: any) {
      console.error('❌ MTN MoMo payment error:', error.response ? error.response.data : error.message);

      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Payment request failed',
        status: 'failed',
      };
    }
  }

  // Check Payment Status (Collection Service)
  public async getPaymentStatus(referenceId: string): Promise<PaymentResponse> {
    try {
      console.log('🔍 Checking MTN MoMo payment status...');
      
      const authToken = await this.getAuthToken(this.collection);
      
      const response = await axios.get(`${this.getBaseUrl()}/collection/v1_0/requesttopay/${referenceId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'X-Target-Environment': this.environment,
          'Ocp-Apim-Subscription-Key': this.collection.primaryKey,
        },
      });

      const statusData: PaymentStatus = response.data;
      
      let status: 'pending' | 'completed' | 'failed' | 'cancelled';
      switch (statusData.status) {
        case 'SUCCESSFUL':
          status = 'completed';
          break;
        case 'FAILED':
          status = 'failed';
          break;
        case 'PENDING':
        default:
          status = 'pending';
          break;
      }

      console.log('📊 Payment status:', statusData.status);
      
      return {
        success: true,
        referenceId,
        transactionId: referenceId,
        status,
        message: `Payment status: ${statusData.status}`,
      };
    } catch (error: any) {
      console.error('❌ Error getting payment status:', error.response ? error.response.data : error.message);
      
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to get payment status',
        status: 'failed',
      };
    }
  }

  // Validate MTN phone number
  public validateMTNPhoneNumber(phoneNumber: string): boolean {
    // Remove any spaces or special characters
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    
    // Convert to international format if needed
    let formattedNumber = cleanNumber;
    if (cleanNumber.startsWith('0')) {
      formattedNumber = '256' + cleanNumber.substring(1);
    }
    
    // MTN Uganda prefixes: 77, 78, 76, 39
    return /^256(77|78|76|39)\d{7}$/.test(formattedNumber);
  }

  // Format phone number to international format
  public formatPhoneNumber(phoneNumber: string): string {
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    
    if (cleanNumber.startsWith('0')) {
      return '256' + cleanNumber.substring(1);
    }
    
    if (cleanNumber.startsWith('256')) {
      return cleanNumber;
    }
    
    return '256' + cleanNumber;
  }
}

// Create and export MTN MoMo client instance
export const createMTNMoMoClient = (config: MoMoClientConfig): MTNMoMoClient => {
  return new MTNMoMoClient(config);
};

// Default configuration for MG Investments
export const getMTNMoMoConfig = (): MoMoClientConfig => {
  // Simple environment variable access for browser
  const getEnvVar = (key: string): string => {
    try {
      // Try to access Vite environment variables
      if (typeof window !== 'undefined' && (window as any).ENV) {
        return (window as any).ENV[key] || '';
      }
      // For development, return empty string - credentials should be set via .env
      return '';
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
