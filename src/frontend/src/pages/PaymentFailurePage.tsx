import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { XCircle, AlertCircle } from 'lucide-react';

export default function PaymentFailurePage() {
  const navigate = useNavigate();

  return (
    <div className="container py-12 flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-4">
            <XCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-2xl">Payment Failed</CardTitle>
          <CardDescription>Your payment could not be processed</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              The payment was cancelled or could not be completed. No charges have been made to your account.
            </AlertDescription>
          </Alert>
          <p className="text-center text-muted-foreground">
            Please try again or contact support if you continue to experience issues.
          </p>
          <div className="flex flex-col gap-2">
            <Button onClick={() => navigate({ to: '/subscription' })} className="w-full">
              Try Again
            </Button>
            <Button variant="outline" onClick={() => navigate({ to: '/about-contact' })} className="w-full">
              Contact Support
            </Button>
            <Button variant="ghost" onClick={() => navigate({ to: '/' })} className="w-full">
              Return Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
