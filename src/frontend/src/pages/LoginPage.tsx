import { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LogIn, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsCallerAdmin } from '../hooks/useQueries';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(false);

  const { login, loginStatus } = useInternetIdentity();
  const { refetch: refetchIsAdmin } = useIsCallerAdmin();

  const handleInternetIdentityLogin = async () => {
    if (isCheckingAdmin) return;

    try {
      setIsCheckingAdmin(true);

      await login();

      const adminCheckResult = await refetchIsAdmin();

      if (adminCheckResult.isError) {
        toast.error('Unable to verify account permissions. Please try again or contact support.');
        return;
      }

      if (adminCheckResult.data === true) {
        toast.success('Welcome, Admin!');
        navigate({ to: '/admin' });
      } else {
        toast.success('Login successful!');
        navigate({ to: '/dashboard' });
      }
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.message === 'User is already authenticated') {
        toast.error('You are already logged in. Please refresh the page.');
      } else {
        toast.error('Login failed. Please try again.');
      }
    } finally {
      setIsCheckingAdmin(false);
    }
  };

  const isInternetIdentityLoading = loginStatus === 'logging-in' || isCheckingAdmin;

  return (
    <div className="container py-12">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <img 
            src="/assets/generated/agrigence-logo-transparent.dim_200x200.png" 
            alt="Agrigence" 
            className="h-20 w-20 mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
          <p className="text-muted-foreground">Login to your Agrigence account</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Email/password authentication is not available</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Email and password authentication is not currently supported. Please use Internet Identity to login securely.
              </AlertDescription>
            </Alert>

            <div className="space-y-4 opacity-50 pointer-events-none">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  disabled
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  disabled
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <Link to="/forgot-password" className="text-primary hover:underline">
                  Forgot Password?
                </Link>
              </div>

              <Button type="button" className="w-full" disabled>
                <LogIn className="h-4 w-4 mr-2" />
                Login (Unavailable)
              </Button>
            </div>

            <div className="text-center text-sm text-muted-foreground mt-4">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary hover:underline font-medium">
                Create Account
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground mb-4">Continue with</p>
          <Button 
            variant="default" 
            className="w-full" 
            onClick={handleInternetIdentityLogin}
            disabled={isInternetIdentityLoading}
          >
            {isInternetIdentityLoading ? 'Logging in...' : 'Internet Identity'}
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            Secure authentication powered by Internet Computer
          </p>
        </div>
      </div>
    </div>
  );
}
