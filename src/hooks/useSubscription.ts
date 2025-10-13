import { useEffect, useState } from 'react';
import api from '@/api';

export interface SubscriptionStatus {
  active: boolean;
  subscription_status: number;
  subscription_expires_at?: string | null;
  remaining_free_uses?: number | null;
  used_free_uses: number;
  free_tier_limit: number;
  loading: boolean;
  error?: string;
}

export const useSubscription = () => {
  const [status, setStatus] = useState<SubscriptionStatus>({
    active: false,
    subscription_status: 0,
    subscription_expires_at: null,
    remaining_free_uses: null,
    used_free_uses: 0,
    free_tier_limit: 10,
    loading: true
  });

  const fetchStatus = async () => {
    try {
      setStatus(s => ({ ...s, loading: true }));
      const res = await api.get('/subscription/status');
      setStatus({ ...res.data, loading: false });
    } catch (e: any) {
      setStatus(s => ({ ...s, loading: false, error: e.response?.data?.detail || 'Failed to load subscription status' }));
    }
  };

  useEffect(() => { fetchStatus(); }, []);

  return { ...status, refresh: fetchStatus };
};
