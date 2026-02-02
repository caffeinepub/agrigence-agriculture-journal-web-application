import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useGetStripeSessionStatus, useCreateSubscription } from '../hooks/useQueries';
import { CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function PaymentSuccessPage() {
  const navigate = useNavigate();
  const getSessionStatus = useGetStripeSessionStatus();
  const createSubscription = useCreateSubscription();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const processPayment = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const sessionId = urlParams.get('session_id');
      const planId = urlParams.get('plan_id');

      if (!sessionId) {
        setError('No payment session found');
        setIsProcessing(false);
        return;
      }

      if (!planId) {
        setError('No subscription plan specified');
        setIsProcessing(false);
        return;
      }

      try {
        const status = await getSessionStatus.mutateAsync(sessionId);

        if (status.__kind__ === 'completed') {
          const startDate = BigInt(Date.now() * 1000000);
          await createSubscription.mutateAsync({ planId, startDate });
          setSuccess(true);
          toast.success('Subscription activated successfully!');
        } else if (status.__kind__ === 'failed') {
          setError(status.failed.error || 'Payment verification failed');
          toast.error('Payment verification failed');
        }
      } catch (err: any) {
        console.error('Payment processing error:', err);
        setError(err.message || 'Failed to process payment');
        toast.error('Failed to activate subscription');
      } finally {
        setIsProcessing(false);
      }
    };

    processPayment();
  }, []);

  if (isProcessing) {
    return (
      <div className="container py-12 flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
            <CardTitle className="text-2xl">Processing Payment</CardTitle>
            <CardDescription>Please wait while we verify your payment...</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center text-sm text-muted-foreground">
              This may take a few moments. Do not close this page.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-12 flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <CardTitle className="text-2xl">Payment Error</CardTitle>
            <CardDescription>There was an issue processing your payment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <p className="text-center text-sm text-muted-foreground">
              If you were charged, please contact support with your payment details.
            </p>
            <div className="flex flex-col gap-2">
              <Button onClick={() => navigate({ to: '/subscription' })} className="w-full">
                Try Again
              </Button>
              <Button variant="outline" onClick={() => navigate({ to: '/about-contact' })} className="w-full">
                Contact Support
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-12 flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-2xl">Payment Successful!</CardTitle>
          <CardDescription>Your subscription has been activated</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            Thank you for subscribing to Agrigence. You can now submit articles and access all features.
          </p>
          <div className="flex flex-col gap-2">
            <Button onClick={() => navigate({ to: '/dashboard' })} className="w-full">
              Go to Dashboard
            </Button>
            <Button variant="outline" onClick={() => navigate({ to: '/submit-article' })} className="w-full">
              Submit Article
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
