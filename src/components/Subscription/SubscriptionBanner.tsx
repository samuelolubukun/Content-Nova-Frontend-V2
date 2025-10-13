import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { SubscriptionStatus } from '@/hooks/useSubscription';

interface Props {
  status: SubscriptionStatus;
}

const SubscriptionBanner: React.FC<Props> = ({ status }) => {
  // If the status is loading, the user has an active subscription, or they have more than 10 uses left, don't show the banner.
  if (status.loading || status.active || (status.remaining_free_uses ?? 0) >= 10) {
    return null;
  }

  const navigate = useNavigate();
  const remaining = status.remaining_free_uses ?? 0;
  const total = status.free_tier_limit;

  return (
    <Alert className="mb-6 border-2 border-purple-300 bg-gradient-to-r from-purple-50 to-blue-50">
      <Sparkles className="h-5 w-5 text-purple-600" />
      <AlertTitle className="font-semibold">Upgrade to Unlimited Access</AlertTitle>
      <AlertDescription>
        {remaining > 0 ? (
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mt-2">
            <span>You have <strong>{remaining}</strong> free use{remaining !== 1 ? 's' : ''} left out of {total}. Subscribe to unlock unlimited extraction & generation.</span>
            <Button onClick={() => navigate('/subscribe')} variant="hero" size="sm">Subscribe Now</Button>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mt-2">
            <span>Your free tier limit is exhausted. Subscribe to continue using content tools.</span>
            <Button onClick={() => navigate('/subscribe')} variant="hero" size="sm">Subscribe to Continue</Button>
          </div>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default SubscriptionBanner;
