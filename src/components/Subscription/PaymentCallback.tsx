import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '@/api';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PaymentCallback: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'verifying' | 'success' | 'failed'>('verifying');
  const [message, setMessage] = useState('Verifying payment...');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const reference = params.get('reference');
    const dodoPaymentId = params.get('payment_id');
    if (!reference && !dodoPaymentId) {
      setStatus('failed');
      setMessage('Missing payment reference or payment_id.');
      return;
    }
    const verify = async () => {
      try {
        let res;
        if (reference) {
          res = await api.get(`/payments/verify/${reference}`);
        } else {
          res = await api.get(`/payments/dodo/verify/${dodoPaymentId}`);
        }
        const rawStatus = (res.data.status || '').toLowerCase();
        const successStatuses = new Set(['success','succeeded','paid','completed','successful']);
        if (successStatuses.has(rawStatus)) {
          setStatus('success');
          // Normalize display status label
          setMessage('Payment successful! Subscription activated. Redirecting...');
          setTimeout(() => navigate('/dashboard'), 2000);
        } else {
          setStatus('failed');
            setMessage(`Payment not successful (status: ${rawStatus || 'unknown'}). If you were charged, please refresh or contact support.`);
        }
      } catch (e: any) {
        setStatus('failed');
        setMessage(e.response?.data?.detail || 'Verification failed');
      }
    };
    verify();
  }, [location.search]);

  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4">
      <div className="text-center space-y-4">
        {status === 'verifying' && <Loader2 className="w-12 h-12 animate-spin mx-auto text-blue-600" />}
        {status === 'success' && <CheckCircle className="w-12 h-12 mx-auto text-green-600" />}
        {status === 'failed' && <XCircle className="w-12 h-12 mx-auto text-red-600" />}
        <h1 className="text-xl font-semibold">{message}</h1>
        <div className="space-x-2">
          <Button onClick={() => navigate('/dashboard')} variant="hero">Go to Dashboard</Button>
          <Button onClick={() => navigate('/subscribe')} variant="outline">Subscription Page</Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentCallback;
