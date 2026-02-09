import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useSetStripeConfiguration } from '../hooks/useQueries';
import { toast } from 'sonner';
import { Loader2, AlertCircle } from 'lucide-react';

interface StripeSetupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function StripeSetupDialog({ open, onOpenChange }: StripeSetupDialogProps) {
  const [secretKey, setSecretKey] = useState('');
  const [countries, setCountries] = useState('IN,US,GB,CA');
  const setStripeConfig = useSetStripeConfiguration();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!secretKey.trim()) {
      toast.error('Please enter Stripe secret key');
      return;
    }

    if (!countries.trim()) {
      toast.error('Please enter at least one country code');
      return;
    }

    try {
      const allowedCountries = countries.split(',').map((c) => c.trim()).filter(c => c.length > 0);
      
      if (allowedCountries.length === 0) {
        toast.error('Please enter valid country codes');
        return;
      }

      await setStripeConfig.mutateAsync({
        secretKey: secretKey.trim(),
        allowedCountries,
      });
      
      toast.success('Stripe configured successfully!');
      setSecretKey('');
      onOpenChange(false);
    } catch (error: any) {
      console.error('Stripe configuration error:', error);
      toast.error(error.message || 'Failed to configure Stripe');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Configure Stripe Payment</DialogTitle>
          <DialogDescription>
            Enter your Stripe credentials to enable payment processing for subscriptions.
          </DialogDescription>
        </DialogHeader>
        
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            This is required before users can purchase subscriptions. You can find your Stripe secret key in your Stripe Dashboard.
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="secretKey">Stripe Secret Key *</Label>
            <Input
              id="secretKey"
              type="password"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              placeholder="sk_test_... or sk_live_..."
              required
            />
            <p className="text-xs text-muted-foreground">
              Your Stripe secret key (starts with sk_test_ or sk_live_)
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="countries">Allowed Countries (comma-separated) *</Label>
            <Input
              id="countries"
              value={countries}
              onChange={(e) => setCountries(e.target.value)}
              placeholder="IN,US,GB,CA"
              required
            />
            <p className="text-xs text-muted-foreground">
              ISO country codes for payment processing (e.g., IN for India, US for United States)
            </p>
          </div>
          
          <Button type="submit" className="w-full" disabled={setStripeConfig.isPending}>
            {setStripeConfig.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Configuring...
              </>
            ) : (
              'Configure Stripe'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
