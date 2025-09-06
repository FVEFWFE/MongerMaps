import { NextRequest, NextResponse } from 'next/server';
import { getServerAuthSession } from '~/server/auth';
import { whop } from '~/lib/whop';

interface CreatePaymentRequest {
  productId: string;
  planId?: string;
  userId: string;
  userEmail: string;
  metadata?: Record<string, any>;
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerAuthSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: CreatePaymentRequest = await req.json();
    const { productId, planId, userId, userEmail, metadata } = body;

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    // Ensure the requesting user matches the session
    if (userId !== session.user.id) {
      return NextResponse.json({ error: 'User ID mismatch' }, { status: 403 });
    }

    try {
      // Create payment with Whop SDK
      const payment = await whop.payments.chargeUser({
        userId: userEmail, // Whop might use email as identifier
        amount: 0, // Amount determined by product
        currency: 'usd',
        productId: productId,
        planId: planId,
        metadata: {
          mongermaps_user_id: userId,
          mongermaps_email: userEmail,
          source: 'mongermaps_upgrade',
          ...metadata,
        },
      });

      console.log('Whop payment created:', {
        paymentId: payment.id,
        userId: userEmail,
        productId,
        planId,
      });

      return NextResponse.json({
        success: true,
        paymentId: payment.id,
        checkoutUrl: payment.checkout_session?.url || payment.url,
        payment,
      });

    } catch (whopError: any) {
      console.error('Whop payment creation failed:', whopError);
      
      // Handle specific Whop errors
      if (whopError.response?.status === 400) {
        return NextResponse.json(
          { error: 'Invalid payment parameters', details: whopError.message },
          { status: 400 }
        );
      }
      
      if (whopError.response?.status === 404) {
        return NextResponse.json(
          { error: 'Product not found', details: whopError.message },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { error: 'Payment creation failed', details: whopError.message },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Create payment API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET route to retrieve payment status
export async function GET(req: NextRequest) {
  try {
    const session = await getServerAuthSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const paymentId = searchParams.get('paymentId');

    if (!paymentId) {
      return NextResponse.json({ error: 'Payment ID is required' }, { status: 400 });
    }

    try {
      // Get payment status from Whop
      const payment = await whop.payments.getPayment(paymentId);

      return NextResponse.json({
        success: true,
        payment,
      });

    } catch (whopError: any) {
      console.error('Error fetching payment status:', whopError);
      return NextResponse.json(
        { error: 'Failed to fetch payment status', details: whopError.message },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Get payment API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}