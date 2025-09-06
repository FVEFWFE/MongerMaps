import axios from 'axios';
import { env } from '~/env';

// BTCPay Server configuration
export const BTCPAY_CONFIG = {
  SERVER_URL: env.BTCPAY_SERVER_URL || '',
  STORE_ID: env.BTCPAY_STORE_ID || '',
  API_KEY: env.BTCPAY_API_KEY || '',
} as const;

// Bitcoin pricing for MongerMaps
export const BITCOIN_PRICING = {
  LITE_MEMBERSHIP: {
    amount: 19.99,
    currency: 'USD',
    name: 'MongerMaps Lite Membership',
    description: 'Access to basic MongerMaps features - Lifetime access',
  },
  ANNUAL_MEMBERSHIP: {
    amount: 99.00,
    currency: 'USD', 
    name: 'MongerMaps Annual Membership',
    description: 'Full access to MongerMaps intelligence platform - Lifetime access',
  },
} as const;

// BTCPay API client
const btcpayApi = axios.create({
  baseURL: `${BTCPAY_CONFIG.SERVER_URL}/api/v1`,
  headers: {
    'Authorization': `token ${BTCPAY_CONFIG.API_KEY}`,
    'Content-Type': 'application/json',
  },
});

export interface BTCPayInvoice {
  id: string;
  storeId: string;
  amount: string;
  currency: string;
  status: 'New' | 'Processing' | 'Settled' | 'Invalid' | 'Expired';
  checkoutLink: string;
  createdTime: number;
  expirationTime: number;
  monitoringExpiration: number;
  speedPolicy: string;
  rate: number;
  invoiceTime: number;
  displayAmountInSatoshis: boolean;
  metadata: Record<string, any>;
}

export interface CreateInvoiceParams {
  amount: number;
  currency: string;
  orderId: string;
  itemDesc: string;
  notificationUrl?: string;
  redirectUrl?: string;
  metadata?: Record<string, any>;
}

export async function createBTCPayInvoice(params: CreateInvoiceParams): Promise<BTCPayInvoice> {
  try {
    const response = await btcpayApi.post(`/stores/${BTCPAY_CONFIG.STORE_ID}/invoices`, {
      amount: params.amount,
      currency: params.currency,
      orderId: params.orderId,
      itemDesc: params.itemDesc,
      notificationUrl: params.notificationUrl,
      redirectUrl: params.redirectUrl,
      metadata: {
        source: 'mongermaps',
        ...params.metadata,
      },
      checkout: {
        speedPolicy: 'MediumSpeed',
        paymentMethods: ['BTC'],
        expirationMinutes: 60,
        monitoringMinutes: 60,
        paymentTolerance: 0,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error('BTCPay invoice creation failed:', error.response?.data || error.message);
    throw new Error(`Failed to create Bitcoin invoice: ${error.response?.data?.message || error.message}`);
  }
}

export async function getBTCPayInvoice(invoiceId: string): Promise<BTCPayInvoice> {
  try {
    const response = await btcpayApi.get(`/stores/${BTCPAY_CONFIG.STORE_ID}/invoices/${invoiceId}`);
    return response.data;
  } catch (error: any) {
    console.error('BTCPay invoice fetch failed:', error.response?.data || error.message);
    throw new Error(`Failed to fetch invoice: ${error.response?.data?.message || error.message}`);
  }
}

export async function verifyBTCPayWebhook(
  body: string,
  signature: string,
  secret: string
): Promise<boolean> {
  try {
    const crypto = require('crypto');
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(body);
    const expectedSignature = hmac.digest('hex');
    
    // BTCPay uses 'sha256=' prefix
    const receivedSignature = signature.replace('sha256=', '');
    
    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature, 'hex'),
      Buffer.from(receivedSignature, 'hex')
    );
  } catch (error) {
    console.error('Webhook verification failed:', error);
    return false;
  }
}

// Helper function to generate payment metadata
export function createPaymentMetadata(options: {
  userId: string;
  userEmail: string;
  membershipType: 'LITE_MEMBERSHIP' | 'ANNUAL_MEMBERSHIP';
  source?: string;
}) {
  return {
    mongermaps_user_id: options.userId,
    mongermaps_email: options.userEmail,
    membership_type: options.membershipType,
    source: options.source || 'mongermaps_bitcoin',
    created_at: new Date().toISOString(),
  };
}

// Invoice status helpers
export function isInvoicePaid(invoice: BTCPayInvoice): boolean {
  return invoice.status === 'Settled' || invoice.status === 'Processing';
}

export function isInvoiceExpired(invoice: BTCPayInvoice): boolean {
  return invoice.status === 'Expired' || invoice.status === 'Invalid';
}

export function isInvoicePending(invoice: BTCPayInvoice): boolean {
  return invoice.status === 'New';
}

// Webhook event types
export interface BTCPayWebhookEvent {
  deliveryId: string;
  webhookId: string;
  originalDeliveryId: string;
  isRedelivery: boolean;
  type: 'InvoiceReceivedPayment' | 'InvoicePaymentSettled' | 'InvoiceProcessing' | 'InvoiceExpired' | 'InvoiceInvalid';
  timestamp: number;
  storeId: string;
  invoiceId: string;
  overPaid: boolean;
  afterExpiration: boolean;
  metadata: Record<string, any>;
}