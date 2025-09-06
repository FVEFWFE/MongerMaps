import { NextRequest, NextResponse } from 'next/server';
import { getServerAuthSession } from '~/server/auth';
import { createBTCPayInvoice, BITCOIN_PRICING, createPaymentMetadata } from '~/lib/btcpay';

interface CreateInvoiceRequest {
  membershipType: 'LITE_MEMBERSHIP' | 'ANNUAL_MEMBERSHIP';
  orderId: string;
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerAuthSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: CreateInvoiceRequest = await req.json();
    const { membershipType, orderId } = body;

    if (!membershipType || !orderId) {
      return NextResponse.json({ 
        error: 'Missing required parameters' 
      }, { status: 400 });
    }

    if (!BITCOIN_PRICING[membershipType]) {
      return NextResponse.json({ 
        error: 'Invalid membership type' 
      }, { status: 400 });
    }

    const pricing = BITCOIN_PRICING[membershipType];
    const baseUrl = req.nextUrl.origin;

    try {
      const invoice = await createBTCPayInvoice({
        amount: pricing.amount,
        currency: pricing.currency,
        orderId: orderId,
        itemDesc: pricing.description,
        notificationUrl: `${baseUrl}/api/btcpay/webhook`,
        redirectUrl: `${baseUrl}/welcome?payment=success&type=bitcoin&membership=${membershipType.toLowerCase()}`,
        metadata: createPaymentMetadata({
          userId: session.user.id,
          userEmail: session.user.email || '',
          membershipType,
          source: 'mongermaps_upgrade',
        }),
      });

      console.log('BTCPay invoice created:', {
        invoiceId: invoice.id,
        amount: pricing.amount,
        currency: pricing.currency,
        userId: session.user.id,
        membershipType,
      });

      return NextResponse.json({
        success: true,
        invoiceId: invoice.id,
        checkoutLink: invoice.checkoutLink,
        amount: pricing.amount,
        currency: pricing.currency,
        expirationTime: invoice.expirationTime,
      });

    } catch (btcpayError: any) {
      console.error('BTCPay invoice creation failed:', btcpayError);
      
      return NextResponse.json({
        error: 'Failed to create Bitcoin invoice',
        details: btcpayError.message,
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Create invoice API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET route to check invoice status
export async function GET(req: NextRequest) {
  try {
    const session = await getServerAuthSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const invoiceId = searchParams.get('invoiceId');

    if (!invoiceId) {
      return NextResponse.json({ 
        error: 'Invoice ID is required' 
      }, { status: 400 });
    }

    try {
      const { getBTCPayInvoice, isInvoicePaid, isInvoiceExpired, isInvoicePending } = await import('~/lib/btcpay');
      const invoice = await getBTCPayInvoice(invoiceId);

      return NextResponse.json({
        success: true,
        invoice: {
          id: invoice.id,
          status: invoice.status,
          amount: invoice.amount,
          currency: invoice.currency,
          checkoutLink: invoice.checkoutLink,
          expirationTime: invoice.expirationTime,
          isPaid: isInvoicePaid(invoice),
          isExpired: isInvoiceExpired(invoice),
          isPending: isInvoicePending(invoice),
        },
      });

    } catch (btcpayError: any) {
      console.error('BTCPay invoice fetch failed:', btcpayError);
      
      return NextResponse.json({
        error: 'Failed to fetch invoice status',
        details: btcpayError.message,
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Invoice status API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}