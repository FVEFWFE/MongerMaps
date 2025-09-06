'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '~/components/ui/button';
import { usePostHog } from 'posthog-js/react';
import { WHOP_CONFIG } from '~/lib/whop';

interface WhopPaymentButtonProps {
  productId: string;
  planId?: string;
  productName: string;
  price: string;
  className?: string;
  children: React.ReactNode;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

export function WhopPaymentButton({
  productId,
  planId,
  productName,
  price,
  className,
  children,
  onSuccess,
  onError,
}: WhopPaymentButtonProps) {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const posthog = usePostHog();

  const handleWhopPayment = async () => {
    if (!session?.user) {
      // Redirect to login
      window.location.href = '/auth/signin?redirect=/upgrade';
      return;
    }

    setIsLoading(true);
    
    // Track payment attempt
    posthog?.capture('whop_payment_initiated', {
      user_id: session.user.id,
      product_id: productId,
      plan_id: planId,
      product_name: productName,
      price: price,
      user_email: session.user.email,
    });

    try {
      // Create Whop payment
      const response = await fetch('/api/whop/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          planId,
          userId: session.user.id,
          userEmail: session.user.email,
          metadata: {
            source: 'mongermaps',
            user_id: session.user.id,
            product_name: productName,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Payment creation failed');
      }

      // Track successful payment creation
      posthog?.capture('whop_payment_created', {
        user_id: session.user.id,
        product_id: productId,
        payment_id: data.paymentId,
        checkout_url: data.checkoutUrl,
      });

      // Redirect to Whop checkout
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error('No checkout URL received');
      }

      onSuccess?.(data);
    } catch (error) {
      console.error('Whop payment error:', error);
      
      posthog?.capture('whop_payment_failed', {
        user_id: session.user.id,
        product_id: productId,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      onError?.(error);
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleWhopPayment}
      disabled={isLoading}
      className={className}
    >
      {isLoading ? 'Creating Payment...' : children}
    </Button>
  );
}

// Alternative component for iframe-based payments (if you want embedded checkout)
export function WhopPaymentModal({
  productId,
  planId,
  productName,
  price,
  children,
  onSuccess,
  onError,
}: WhopPaymentButtonProps) {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const posthog = usePostHog();

  const handleOpenModal = () => {
    if (!session?.user) {
      window.location.href = '/auth/signin?redirect=/upgrade';
      return;
    }

    posthog?.capture('whop_payment_modal_opened', {
      user_id: session.user.id,
      product_id: productId,
      product_name: productName,
    });

    setIsOpen(true);
  };

  return (
    <>
      <Button onClick={handleOpenModal} disabled={isLoading}>
        {children}
      </Button>
      
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Complete Payment</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="font-medium">{productName}</p>
                <p className="text-gray-600">{price}</p>
              </div>
              
              <WhopPaymentButton
                productId={productId}
                planId={planId}
                productName={productName}
                price={price}
                onSuccess={(data) => {
                  setIsOpen(false);
                  onSuccess?.(data);
                }}
                onError={(error) => {
                  setIsOpen(false);
                  onError?.(error);
                }}
                className="w-full"
              >
                Pay with Whop
              </WhopPaymentButton>
            </div>
          </div>
        </div>
      )}
    </>
  );
}