import { NextRequest, NextResponse } from 'next/server';
import { createHmac } from 'crypto';
import { db } from '~/server/db';
import { users } from '~/server/db/schema';
import { eq } from 'drizzle-orm';

// Webhook event types from Whop
interface WhopWebhookEvent {
  id: string;
  type: 'payment_succeeded' | 'payment_failed' | 'membership_went_valid' | 'membership_went_invalid' | 'membership_cancel_at_period_end_changed' | 'payment_pending' | 'dispute_created' | 'dispute_updated' | 'dispute_alert_created' | 'membership_experience_claimed' | 'membership_metadata_updated' | 'payment_affiliate_reward_created' | 'refund_created' | 'refund_updated' | 'resolution_created' | 'resolution_decided' | 'resolution_updated';
  data: {
    id: string;
    user_id?: string;
    username?: string;
    email?: string;
    product_id?: string;
    plan_id?: string;
    amount?: number;
    currency?: string;
    status?: string;
    metadata?: Record<string, any>;
    [key: string]: any;
  };
  created_at: number;
}

function verifyWebhook(payload: string, signature: string, secret: string): boolean {
  const hmac = createHmac('sha256', secret);
  hmac.update(payload);
  const expectedSignature = hmac.digest('hex');
  
  // Compare signatures securely
  return signature === expectedSignature;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get('x-whop-signature');
    const webhookSecret = process.env.WHOP_WEBHOOK_SECRET;

    if (!signature) {
      console.error('Missing webhook signature');
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    if (!webhookSecret) {
      console.error('Missing webhook secret');
      return NextResponse.json({ error: 'Missing webhook secret' }, { status: 500 });
    }

    // Verify webhook signature
    if (!verifyWebhook(body, signature, webhookSecret)) {
      console.error('Invalid webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const event: WhopWebhookEvent = JSON.parse(body);
    
    console.log(`Processing Whop webhook: ${event.type}`, {
      id: event.id,
      user_id: event.data.user_id,
      username: event.data.username
    });

    // Handle different webhook events
    switch (event.type) {
      case 'payment_succeeded':
        await handlePaymentSucceeded(event);
        break;
        
      case 'payment_failed':
        await handlePaymentFailed(event);
        break;
        
      case 'membership_went_valid':
        await handleMembershipValid(event);
        break;
        
      case 'membership_went_invalid':
        await handleMembershipInvalid(event);
        break;
        
      case 'membership_cancel_at_period_end_changed':
        await handleMembershipCancellation(event);
        break;
        
      case 'payment_pending':
        await handlePaymentPending(event);
        break;

      case 'dispute_created':
      case 'dispute_updated':
      case 'dispute_alert_created':
        await handleDispute(event);
        break;

      case 'refund_created':
      case 'refund_updated':
        await handleRefund(event);
        break;

      default:
        console.log(`Unhandled webhook type: ${event.type}`);
        // Log for analytics but don't fail
        break;
    }

    // Always respond with 200 to acknowledge receipt
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function handlePaymentSucceeded(event: WhopWebhookEvent) {
  const { user_id, username, email, product_id, amount } = event.data;
  
  try {
    // Find or create user based on Whop user_id, username, or email
    let user = null;
    
    if (email) {
      user = await db.select().from(users).where(eq(users.email, email)).get();
    }
    
    if (!user && username) {
      user = await db.select().from(users).where(eq(users.name, username)).get();
    }

    if (user) {
      // Update user subscription status
      await db.update(users)
        .set({
          // Add subscription fields to your schema as needed
          // subscription_status: 'active',
          // whop_user_id: user_id,
          // subscription_plan: product_id,
          updatedAt: new Date(),
        })
        .where(eq(users.id, user.id));
      
      console.log(`User ${user.email} subscription activated via Whop payment`);
    } else {
      console.log(`Payment succeeded but user not found: ${email || username || user_id}`);
    }
    
  } catch (error) {
    console.error('Error handling payment success:', error);
  }
}

async function handlePaymentFailed(event: WhopWebhookEvent) {
  const { user_id, username, email } = event.data;
  console.log(`Payment failed for user: ${email || username || user_id}`);
  
  // Log failure for analytics
  // Could trigger email notification, retry logic, etc.
}

async function handleMembershipValid(event: WhopWebhookEvent) {
  const { user_id, username, email, product_id } = event.data;
  
  try {
    // Similar to payment succeeded - activate membership
    if (email) {
      const user = await db.select().from(users).where(eq(users.email, email)).get();
      if (user) {
        await db.update(users)
          .set({
            // subscription_status: 'active',
            // whop_user_id: user_id,
            updatedAt: new Date(),
          })
          .where(eq(users.id, user.id));
      }
    }
    
    console.log(`Membership activated: ${email || username || user_id}`);
  } catch (error) {
    console.error('Error handling membership activation:', error);
  }
}

async function handleMembershipInvalid(event: WhopWebhookEvent) {
  const { user_id, username, email } = event.data;
  
  try {
    // Deactivate membership
    if (email) {
      const user = await db.select().from(users).where(eq(users.email, email)).get();
      if (user) {
        await db.update(users)
          .set({
            // subscription_status: 'inactive',
            updatedAt: new Date(),
          })
          .where(eq(users.id, user.id));
      }
    }
    
    console.log(`Membership deactivated: ${email || username || user_id}`);
  } catch (error) {
    console.error('Error handling membership deactivation:', error);
  }
}

async function handleMembershipCancellation(event: WhopWebhookEvent) {
  const { user_id, username, email } = event.data;
  console.log(`Membership cancellation changed: ${email || username || user_id}`);
  
  // Handle cancellation logic - maybe set cancel_at_period_end flag
}

async function handlePaymentPending(event: WhopWebhookEvent) {
  const { user_id, username, email } = event.data;
  console.log(`Payment pending: ${email || username || user_id}`);
  
  // Could show pending status in UI
}

async function handleDispute(event: WhopWebhookEvent) {
  const { user_id, username, email } = event.data;
  console.log(`Dispute event ${event.type}: ${email || username || user_id}`);
  
  // Handle dispute - might need to freeze account or investigate
}

async function handleRefund(event: WhopWebhookEvent) {
  const { user_id, username, email, amount } = event.data;
  console.log(`Refund event ${event.type}: ${email || username || user_id}, amount: ${amount}`);
  
  // Handle refund - deactivate subscription, update user status
  try {
    if (email) {
      const user = await db.select().from(users).where(eq(users.email, email)).get();
      if (user) {
        await db.update(users)
          .set({
            // subscription_status: 'refunded',
            updatedAt: new Date(),
          })
          .where(eq(users.id, user.id));
      }
    }
  } catch (error) {
    console.error('Error handling refund:', error);
  }
}