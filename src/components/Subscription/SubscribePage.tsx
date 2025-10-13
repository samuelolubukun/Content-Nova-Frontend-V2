import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import api from '@/api';
import { Loader2, CreditCard } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';

const SubscribePage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { active, subscription_expires_at } = useSubscription();

  const initializePaystack = async () => {
    setLoading(true);
    try {
      const res = await api.post('/payments/initialize', { plan: 'monthly' });
      window.location.href = res.data.authorization_url; // Redirect to Paystack hosted page
    } catch (e: any) {
      toast({ title: 'Error', description: e.response?.data?.detail || 'Failed to initialize payment', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const initializeDodo = async () => {
    setLoading(true);
    try {
      const res = await api.post('/payments/dodo/initialize', { plan: 'monthly' });
      window.location.href = res.data.authorization_url; // Redirect to Dodo payment link
    } catch (e: any) {
      toast({ title: 'Error', description: e.response?.data?.detail || 'Failed to initialize Dodo payment', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-purple-50">
        <CardHeader>
          <CardTitle className="text-2xl">Subscription</CardTitle>
          <CardDescription>
            Unlock unlimited extractions & generations (Monthly Plan)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {active && (
            <div className="p-4 rounded-lg bg-green-50 border border-green-200 text-sm">
              Active subscription. Expires at: {subscription_expires_at ? new Date(subscription_expires_at).toLocaleString() : 'N/A'}
            </div>
          )}
          <div className="p-4 rounded-lg bg-purple-100/50 border border-purple-200 text-sm">
            <ul className="list-disc list-inside space-y-1">
              <li>Unlimited content extraction & transformation</li>
              <li>Save and manage generated content</li>
              <li>Priority processing & future premium features</li>
            </ul>
          </div>
          <div>
            <div className="flex items-baseline space-x-2">
              <span className="text-4xl font-bold">$5</span>
              <span className="text-gray-500">/ month</span>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            
           {/*
            <Button onClick={initializePaystack} disabled={loading || active} className="w-full h-12 text-lg" variant="hero">
              {loading ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Processing...</> : <><CreditCard className="w-5 h-5 mr-2" /> {active ? 'Paystack Active' : 'Paystack'}</>}
            </Button>
            */}

            <Button onClick={initializeDodo} disabled={loading || active} className="w-full h-12 text-lg" variant="outline">
              {loading ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Processing...</> : <><CreditCard className="w-5 h-5 mr-2" /> {active ? 'Dodo Active' : 'DodoPayments'}</>}
            </Button>
          </div>
          <p className="text-xs text-gray-500 text-center">You will be redirected to secure checkout.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscribePage;
