import { Link, useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Mail } from 'lucide-react';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();

  return (
    <div className="container py-12">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <img 
            src="/assets/generated/agrigence-logo-transparent.dim_200x200.png" 
            alt="Agrigence" 
            className="h-20 w-20 mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold mb-2">Password Reset</h1>
          <p className="text-muted-foreground">Password reset is not available</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Reset Password</CardTitle>
            <CardDescription>
              Password reset functionality is not currently supported
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Password reset is not available because email/password authentication is not supported. 
                Please use Internet Identity for secure, password-free authentication.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                <h3 className="font-semibold flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Need Help?
                </h3>
                <p className="text-sm text-muted-foreground">
                  If you're having trouble accessing your account, please contact our support team at{' '}
                  <a href="mailto:admin@agrigence.com" className="text-primary hover:underline">
                    admin@agrigence.com
                  </a>
                </p>
              </div>

              <div className="flex gap-4">
                <Button onClick={() => navigate({ to: '/login' })} className="flex-1">
                  Go to Login
                </Button>
                <Button onClick={() => navigate({ to: '/' })} variant="outline" className="flex-1">
                  Go Home
                </Button>
              </div>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary hover:underline font-medium">
                Create Account
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
