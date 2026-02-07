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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(false);

  const { login, loginStatus, identity } = useInternetIdentity();
  const { data: isAdmin, refetch: refetchIsAdmin } = useIsCallerAdmin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Replace with actual backend authentication once implemented
      // await loginWithEmailPassword(email, password);
      
      // Temporary placeholder - will be replaced with actual backend call
      toast.error('Email/password authentication is not yet implemented. Please use Internet Identity for now.');
      
      // Once backend is ready, uncomment:
      // toast.success('Login successful!');
      // navigate({ to: '/dashboard' });
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInternetIdentityLogin = async () => {
    if (isCheckingAdmin) return;

    try {
      setIsCheckingAdmin(true);
      setError('');

      // Perform Internet Identity login
      await login();

      // After successful login, check if user is admin
      const adminCheckResult = await refetchIsAdmin();

      if (adminCheckResult.isError) {
        // If admin check fails, show error and don't navigate
        setError('Unable to verify account permissions. Please try again or contact support.');
        return;
      }

      // Navigate based on admin status
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
        setError('You are already logged in. Please refresh the page.');
      } else {
        setError('Login failed. Please try again.');
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
            <CardDescription>Enter your email and password to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
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

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <Link to="/forgot-password" className="text-primary hover:underline">
                  Forgot Password?
                </Link>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  'Logging in...'
                ) : (
                  <>
                    <LogIn className="h-4 w-4 mr-2" />
                    Login
                  </>
                )}
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link to="/signup" className="text-primary hover:underline font-medium">
                  Create Account
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground mb-4">Or continue with</p>
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={handleInternetIdentityLogin}
            disabled={isInternetIdentityLoading}
          >
            {isInternetIdentityLoading ? 'Logging in...' : 'Internet Identity'}
          </Button>
        </div>
      </div>
    </div>
  );
}
