import { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { KeyRound, AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Replace with actual backend password reset once implemented
      // await requestPasswordReset(email);
      
      // Temporary placeholder - will be replaced with actual backend call
      toast.error('Password reset is not yet implemented. Please contact support for assistance.');
      
      // Once backend is ready, uncomment:
      // setSuccess(true);
      // toast.success('Password reset instructions sent to your email');
    } catch (err: any) {
      setError(err.message || 'Failed to send reset instructions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-12">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <img 
            src="/assets/generated/agrigence-logo-transparent.dim_200x200.png" 
            alt="Agrigence" 
            className="h-20 w-20 mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold mb-2">Forgot Password</h1>
          <p className="text-muted-foreground">Reset your Agrigence account password</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Reset Password</CardTitle>
            <CardDescription>
              Enter your email address and we'll send you instructions to reset your password
            </CardDescription>
          </CardHeader>
          <CardContent>
            {success ? (
              <div className="space-y-4">
                <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800 dark:text-green-200">
                    Password reset instructions have been sent to your email address. Please check your inbox and follow the instructions.
                  </AlertDescription>
                </Alert>
                <Button className="w-full" onClick={() => navigate({ to: '/login' })}>
                  Return to Login
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    required
                    disabled={isLoading}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    'Sending Instructions...'
                  ) : (
                    <>
                      <KeyRound className="h-4 w-4 mr-2" />
                      Send Reset Instructions
                    </>
                  )}
                </Button>

                <div className="text-center text-sm text-muted-foreground">
                  Remember your password?{' '}
                  <Link to="/login" className="text-primary hover:underline font-medium">
                    Login
                  </Link>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Need help? Contact us at{' '}
            <a href="mailto:agrigence@gmail.com" className="text-primary hover:underline">
              agrigence@gmail.com
            </a>
            {' '}or WhatsApp{' '}
            <a href="https://wa.me/919452571317" className="text-primary hover:underline">
              +91 9452571317
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
