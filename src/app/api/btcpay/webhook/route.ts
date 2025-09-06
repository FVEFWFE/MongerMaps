import { NextRequest, NextResponse } from 'next/server';
import { verifyBTCPayWebhook, getBTCPayInvoice, isInvoicePaid } from '~/lib/btcpay';
import { db } from '~/server/db';

interface BTCPayWebhookEvent {
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
  metadata?: Record<string, any>;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get('btcpay-sig');
    const webhookSecret = process.env.BTCPAY_WEBHOOK_SECRET;

    console.log('BTCPay webhook received:', {
      hasSignature: !!signature,
      hasSecret: !!webhookSecret,
      bodyLength: body.length,
    });

    // If webhook secret is configured, verify the signature
    if (webhookSecret && signature) {
      const isValid = await verifyBTCPayWebhook(body, signature, webhookSecret);
      if (!isValid) {
        console.error('Invalid BTCPay webhook signature');
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
      }
    } else {
      console.warn('BTCPay webhook verification skipped - no secret configured');
    }

    const event: BTCPayWebhookEvent = JSON.parse(body);
    
    console.log(`Processing BTCPay webhook: ${event.type}`, {
      invoiceId: event.invoiceId,
      storeId: event.storeId,
      overPaid: event.overPaid,
    });

    // Handle different webhook events
    switch (event.type) {
      case 'InvoicePaymentSettled':
      case 'InvoiceProcessing':
        await handlePaymentSuccess(event);
        break;
        
      case 'InvoiceReceivedPayment':
        await handlePaymentReceived(event);
        break;
        
      case 'InvoiceExpired':
        await handleInvoiceExpired(event);
        break;
        
      case 'InvoiceInvalid':
        await handleInvoiceInvalid(event);
        break;
        
      default:
        console.log(`Unhandled BTCPay webhook type: ${event.type}`);
        break;
    }

    // Always respond with 200 to acknowledge receipt
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('BTCPay webhook processing error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function handlePaymentSuccess(event: BTCPayWebhookEvent) {
  try {
    // Get full invoice details
    const invoice = await getBTCPayInvoice(event.invoiceId);
    
    if (!isInvoicePaid(invoice)) {
      console.log(`Invoice ${event.invoiceId} not yet fully paid`);
      return;
    }

    const metadata = invoice.metadata;
    const userId = metadata?.mongermaps_user_id;
    const userEmail = metadata?.mongermaps_email;
    const membershipType = metadata?.membership_type;

    if (!userId || !userEmail || !membershipType) {
      console.error('Missing required metadata in invoice:', { userId, userEmail, membershipType });
      return;
    }

    console.log('Processing successful Bitcoin payment:', {
      invoiceId: event.invoiceId,
      userId,
      userEmail,
      membershipType,
      amount: invoice.amount,
    });

    // Find user in database
    const user = await db.user.findUnique({
      where: { id: userId }
    });
    
    if (!user) {
      console.error(`User not found: ${userId}`);
      return;
    }

    // Check if subscription already exists for this invoice
    const existingSubscription = await db.subscription.findFirst({
      where: { btcPayInvoiceId: event.invoiceId }
    });

    if (existingSubscription) {
      console.log(`Subscription already exists for invoice ${event.invoiceId}`);
      return;
    }

    // Create subscription record
    const subscriptionData = {
      userId: userId,
      type: 'ANNUAL' as const, // Using existing enum values
      status: 'ACTIVE' as const,
      startDate: new Date(),
      endDate: null, // Lifetime access
      btcPayInvoiceId: event.invoiceId,
      amount: Math.round(parseFloat(invoice.amount) * 100), // Convert to cents
    };

    await db.subscription.create({
      data: subscriptionData
    });

    console.log(`Bitcoin subscription created for user ${userId}:`, {
      invoiceId: event.invoiceId,
      membershipType,
      amount: subscriptionData.amount,
    });

  } catch (error) {
    console.error('Error handling Bitcoin payment success:', error);
  }
}

async function handlePaymentReceived(event: BTCPayWebhookEvent) {
  console.log(`Payment received for invoice ${event.invoiceId} but not yet settled`);
  
  // Could update UI to show "payment received, confirming..."
  // For now, just log it
}

async function handleInvoiceExpired(event: BTCPayWebhookEvent) {
  console.log(`Invoice expired: ${event.invoiceId}`);
  
  // Could clean up any pending records or notify user
  // For now, just log it
}

async function handleInvoiceInvalid(event: BTCPayWebhookEvent) {
  console.log(`Invoice invalid: ${event.invoiceId}`);
  
  // Could handle invalid payments or fraudulent attempts
  // For now, just log it
}