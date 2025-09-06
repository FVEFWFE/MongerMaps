'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '~/components/ui/button';
import { usePostHog } from 'posthog-js/react';
import { Bitcoin } from 'lucide-react';

interface BitcoinPaymentButtonProps {
  membershipType: 'LITE_MEMBERSHIP' | 'ANNUAL_MEMBERSHIP';
  productName: string;
  price: string;
  className?: string;
  children: React.ReactNode;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

export function BitcoinPaymentButton({
  membershipType,
  productName,
  price,
  className,
  children,
  onSuccess,
  onError,
}: BitcoinPaymentButtonProps) {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const posthog = usePostHog();

  const handleBitcoinPayment = async () => {
    if (!session?.user) {
      // Redirect to login
      window.location.href = '/auth/signin?redirect=/upgrade';
      return;
    }

    setIsLoading(true);
    
    // Track payment attempt
    posthog?.capture('bitcoin_payment_initiated', {
      user_id: session.user.id,
      membership_type: membershipType,
      product_name: productName,
      price: price,
      user_email: session.user.email,
      payment_method: 'bitcoin',
    });

    try {
      // Generate unique order ID
      const orderId = `monger-${membershipType.toLowerCase()}-${session.user.id}-${Date.now()}`;

      // Create BTCPay invoice
      const response = await fetch('/api/btcpay/create-invoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          membershipType,
          orderId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Invoice creation failed');
      }

      // Track successful invoice creation
      posthog?.capture('bitcoin_invoice_created', {
        user_id: session.user.id,
        membership_type: membershipType,
        invoice_id: data.invoiceId,
        checkout_link: data.checkoutLink,
        amount: data.amount,
        currency: data.currency,
      });

      // Redirect to BTCPay checkout
      if (data.checkoutLink) {
        window.location.href = data.checkoutLink;
      } else {
        throw new Error('No checkout link received');
      }

      onSuccess?.(data);
    } catch (error) {
      console.error('Bitcoin payment error:', error);
      
      posthog?.capture('bitcoin_payment_failed', {
        user_id: session.user.id,
        membership_type: membershipType,
        error: error instanceof Error ? error.message : 'Unknown error',
        payment_method: 'bitcoin',
      });

      onError?.(error);
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleBitcoinPayment}
      disabled={isLoading}
      className={className}
    >
      <Bitcoin className="w-4 h-4 mr-2" />
      {isLoading ? 'Creating Invoice...' : children}
    </Button>
  );
}

// Alternative component with Bitcoin branding
export function BitcoinOnlyButton({
  membershipType,
  productName,
  price,
  onSuccess,
  onError,
}: BitcoinPaymentButtonProps) {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const posthog = usePostHog();

  const handleBitcoinPayment = async () => {
    if (!session?.user) {
      window.location.href = '/auth/signin?redirect=/upgrade';
      return;
    }

    setIsLoading(true);
    
    posthog?.capture('bitcoin_only_payment_clicked', {
      user_id: session.user.id,
      membership_type: membershipType,
      product_name: productName,
      price: price,
    });

    try {
      const orderId = `monger-btc-${membershipType.toLowerCase()}-${session.user.id}-${Date.now()}`;

      const response = await fetch('/api/btcpay/create-invoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          membershipType,
          orderId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Invoice creation failed');
      }

      posthog?.capture('bitcoin_invoice_success', {
        user_id: session.user.id,
        invoice_id: data.invoiceId,
        amount: data.amount,
      });

      // Redirect to BTCPay checkout
      window.location.href = data.checkoutLink;

      onSuccess?.(data);
    } catch (error) {
      console.error('Bitcoin payment error:', error);
      
      posthog?.capture('bitcoin_payment_error', {
        user_id: session.user.id,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      onError?.(error);
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 text-center">
      <div className="flex items-center justify-center gap-2 mb-4">
        <Bitcoin className="h-6 w-6 text-orange-500" />
        <span className="text-xl font-bold text-white">Bitcoin Only</span>
      </div>
      <p className="text-gray-400 mb-4">
        Maximum privacy. No credit card trail. No questions asked.
      </p>
      <Button
        onClick={handleBitcoinPayment}
        disabled={isLoading}
        className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3"
      >
        {isLoading ? "Creating Invoice..." : "Pay with Bitcoin"}
      </Button>
      <p className="text-xs text-gray-500 mt-2">
        Powered by BTCPay Server • Zero logs • Zero tracking
      </p>
    </div>
  );
}