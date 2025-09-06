'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface WhopMembership {
  id: string;
  product_id: string;
  plan_id: string;
  valid: boolean;
  status: string;
  created_at: string;
  updated_at: string;
}

interface UseWhopAuthReturn {
  memberships: WhopMembership[];
  hasValidMembership: boolean;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useWhopAuth(productId?: string): UseWhopAuthReturn {
  const { data: session } = useSession();
  const [memberships, setMemberships] = useState<WhopMembership[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMemberships = async () => {
    if (!session?.user?.email) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/whop/memberships', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch memberships');
      }

      const data = await response.json();
      setMemberships(data.memberships || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setMemberships([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemberships();
  }, [session?.user?.email]);

  const hasValidMembership = memberships.some(membership => {
    if (!membership.valid) return false;
    if (productId && membership.product_id !== productId) return false;
    return true;
  });

  return {
    memberships,
    hasValidMembership,
    loading,
    error,
    refetch: fetchMemberships,
  };
}

// Hook to check specific product access
export function useWhopProductAccess(productId: string) {
  const { memberships, loading, error, refetch } = useWhopAuth();
  
  const hasAccess = memberships.some(
    membership => membership.valid && membership.product_id === productId
  );

  return {
    hasAccess,
    membership: memberships.find(m => m.product_id === productId),
    loading,
    error,
    refetch,
  };
}