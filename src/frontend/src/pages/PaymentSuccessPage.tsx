import { useEffect, useState } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useGetStripeSessionStatus, useCreateSubscription } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export default function PaymentSuccessPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();
  const search = useSearch({ strict: false }) as { session_id?: string };
  const sessionId = search.session_id || null;

  const { data: sessionStatus, isLoading: statusLoading } = useGetStripeSessionStatus(sessionId);
  const createSubscription = useCreateSubscription();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setError('No session ID found');
      return;
    }

    if (!identity) {
      setError('Not authenticated');
      return;
    }

    if (sessionStatus && sessionStatus.__kind__ === 'completed' && !isProcessing) {
      setIsProcessing(true);
      
      const processPayment = async () => {
        try {
          const response = JSON.parse(sessionStatus.completed.response);
          const planId = response.metadata?.planId;

          if (!planId) {
            throw new Error('Plan ID not found in session metadata');
          }

          await createSubscription.mutateAsync({
            planId,
            user: identity.getPrincipal(),
          });

          await queryClient.invalidateQueries({ queryKey: ['hasActiveSubscription'] });
          await queryClient.invalidateQueries({ queryKey: ['currentPlanDetails'] });
          await queryClient.invalidateQueries({ queryKey: ['submissionStatus'] });

          toast.success('Subscription activated successfully!');
        } catch (err: any) {
          console.error('Subscription activation error:', err);
          setError(err.message || 'Failed to activate subscription');
          toast.error('Failed to activate subscription');
        } finally {
          setIsProcessing(false);
        }
      };

      processPayment();
    }

    if (sessionStatus && sessionStatus.__kind__ === 'failed') {
      setError(sessionStatus.failed.error);
    }
  }, [sessionStatus, sessionId, identity, isProcessing, createSubscription, queryClient]);

  if (!sessionId) {
    return (
      <div className="container py-12">
        <Card className="max-w-2xl mx-auto border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Invalid Session
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">No payment session found.</p>
            <Button onClick={() => navigate({ to: '/subscription' })}>
              Return to Subscription Plans
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (statusLoading || isProcessing) {
    return (
      <div className="container py-12">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="py-12">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-lg font-medium">Processing your payment...</p>
              <p className="text-sm text-muted-foreground">Please wait while we confirm your subscription</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-12">
        <Card className="max-w-2xl mx-auto border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Payment Processing Error
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <div className="flex gap-4">
              <Button onClick={() => navigate({ to: '/subscription' })} variant="outline">
                Try Again
              </Button>
              <Button onClick={() => navigate({ to: '/dashboard' })}>
                Go to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <Card className="max-w-2xl mx-auto border-primary">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <CheckCircle className="h-6 w-6" />
            Payment Successful!
          </CardTitle>
          <CardDescription>Your subscription has been activated</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert className="border-primary bg-primary/5">
            <CheckCircle className="h-4 w-4 text-primary" />
            <AlertDescription className="text-foreground">
              Thank you for your purchase! Your subscription is now active and you can start submitting articles.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <h3 className="font-semibold">Next Steps:</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span>View your subscription details in the dashboard</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span>Submit your research articles for publication</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span>Track your submission status in real-time</span>
              </li>
            </ul>
          </div>

          <div className="flex gap-4">
            <Button onClick={() => navigate({ to: '/dashboard' })} className="flex-1">
              Go to Dashboard
            </Button>
            <Button onClick={() => navigate({ to: '/submit-article' })} variant="outline" className="flex-1">
              Submit Article
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
