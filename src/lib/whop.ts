import { Whop } from '@whop-sdk/core';
import { env } from '~/env';

// Initialize Whop SDK
export const whop = new Whop({
  apiKey: env.WHOP_API_KEY || '',
});

// Whop configuration
export const WHOP_CONFIG = {
  APP_ID: env.NEXT_PUBLIC_WHOP_APP_ID || '',
  AGENT_USER_ID: env.NEXT_PUBLIC_WHOP_AGENT_USER_ID || '',
  COMPANY_ID: env.NEXT_PUBLIC_WHOP_COMPANY_ID || '',
} as const;

// Product/Plan IDs - replace these with your actual Whop product IDs
export const WHOP_PRODUCTS = {
  LITE_MEMBERSHIP: 'prod_lite_membership', // Replace with your actual product ID
  ANNUAL_MEMBERSHIP: 'prod_annual_membership', // Replace with your actual product ID
} as const;

// Pricing for display
export const WHOP_PRICING = {
  LITE_MEMBERSHIP: {
    price: '$19.99',
    name: 'Lite Membership',
    description: 'Access to basic MongerMaps features',
  },
  ANNUAL_MEMBERSHIP: {
    price: '$99.00',
    name: 'Annual Membership', 
    description: 'Full access to MongerMaps intelligence platform',
  },
} as const;

// Helper functions
export async function createPaymentLink(options: {
  userId: string;
  productId: string;
  successUrl?: string;
  cancelUrl?: string;
  metadata?: Record<string, any>;
}) {
  try {
    const result = await whop.payments.chargeUser({
      userId: options.userId,
      amount: 0, // Amount will be determined by the product
      currency: 'usd',
      productId: options.productId,
      metadata: {
        source: 'mongermaps',
        ...options.metadata,
      },
    });
    
    return result;
  } catch (error) {
    console.error('Error creating Whop payment:', error);
    throw error;
  }
}

export async function validateUserMembership(userId: string, productId?: string) {
  try {
    // Check if user has active membership
    const user = await whop.users.getUser(userId);
    
    // Check memberships
    if (user.memberships && user.memberships.length > 0) {
      const activeMemberships = user.memberships.filter(
        (membership: any) => membership.valid && (!productId || membership.product_id === productId)
      );
      
      return {
        hasAccess: activeMemberships.length > 0,
        memberships: activeMemberships,
      };
    }
    
    return { hasAccess: false, memberships: [] };
  } catch (error) {
    console.error('Error validating user membership:', error);
    return { hasAccess: false, memberships: [] };
  }
}

export async function getUserByEmail(email: string) {
  try {
    // Note: This might require a different API call depending on Whop's SDK
    // You may need to use a different method to find users by email
    const users = await whop.users.getUsers();
    return users.find((user: any) => user.email === email);
  } catch (error) {
    console.error('Error getting user by email:', error);
    return null;
  }
}

// Payment status types
export type PaymentStatus = 'pending' | 'succeeded' | 'failed' | 'disputed' | 'refunded';
export type MembershipStatus = 'valid' | 'invalid' | 'cancelled' | 'expired';

// Webhook event types for type safety
export interface WhopPaymentEvent {
  id: string;
  type: string;
  data: {
    id: string;
    user_id: string;
    username: string;
    email: string;
    product_id: string;
    amount: number;
    currency: string;
    status: PaymentStatus;
    metadata: Record<string, any>;
  };
  created_at: number;
}

export interface WhopMembershipEvent {
  id: string;
  type: string;
  data: {
    id: string;
    user_id: string;
    username: string;
    email: string;
    product_id: string;
    plan_id: string;
    status: MembershipStatus;
    valid: boolean;
    metadata: Record<string, any>;
  };
  created_at: number;
}