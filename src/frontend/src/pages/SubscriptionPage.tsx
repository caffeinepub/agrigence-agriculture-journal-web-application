import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetSubscriptionPlans, useCreateCheckoutSession, useIsStripeConfigured, useIsCallerAdmin } from '../hooks/useQueries';
import { toast } from 'sonner';
import { Check, AlertCircle, CreditCard, Loader2 } from 'lucide-react';
import StripeSetupDialog from '../components/StripeSetupDialog';
import type { ShoppingItem } from '../backend';

export default function SubscriptionPage() {
  const { identity } = useInternetIdentity();
  const { data: plans, isLoading } = useGetSubscriptionPlans();
  const { data: isStripeConfigured, isLoading: stripeLoading } = useIsStripeConfigured();
  const { data: isAdmin } = useIsCallerAdmin();
  const createCheckout = useCreateCheckoutSession();

  const isAuthenticated = !!identity;

  const handlePurchase = async (planId: string, planName: string, price: number) => {
    if (!isAuthenticated) {
      toast.error('Please login to purchase a subscription');
      return;
    }

    if (!isStripeConfigured) {
      toast.error('Payment system is not configured. Please contact support.');
      return;
    }

    try {
      const items: ShoppingItem[] = [
        {
          productName: planName,
          productDescription: `Agrigence ${planName} Subscription`,
          priceInCents: BigInt(price * 100),
          currency: 'inr',
          quantity: BigInt(1),
        },
      ];

      const session = await createCheckout.mutateAsync({ items, planId });
      const sessionData = JSON.parse(session);
      
      if (sessionData.url) {
        window.location.href = sessionData.url;
      } else {
        throw new Error('Invalid checkout session response');
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.error(error.message || 'Failed to create checkout session');
    }
  };

  const showStripeSetup = isAdmin && !stripeLoading && !isStripeConfigured;

  return (
    <>
      {showStripeSetup && <StripeSetupDialog open={showStripeSetup} />}
      <div className="container py-12">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Subscription Plans</h1>
          <p className="text-lg text-muted-foreground">
            Choose the plan that best fits your research needs
          </p>
        </div>

        {!isAuthenticated && (
          <Alert className="mb-8">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Please login to purchase a subscription plan.</AlertDescription>
          </Alert>
        )}

        {!stripeLoading && !isStripeConfigured && !isAdmin && (
          <Alert className="mb-8" variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Payment system is currently unavailable. Please contact support for assistance.
            </AlertDescription>
          </Alert>
        )}

        {isLoading ? (
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading subscription plans...</p>
          </div>
        ) : plans && plans.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className={`relative hover:shadow-lg transition-shadow ${
                  plan.isUnlimited ? 'border-primary shadow-md' : ''
                }`}
              >
                {plan.isUnlimited && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">Popular</Badge>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>
                    {plan.isInstitute
                      ? 'For institutions'
                      : plan.isUnlimited
                        ? 'Unlimited submissions'
                        : `Up to ${plan.maxArticles} article${Number(plan.maxArticles) > 1 ? 's' : ''}`}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="text-4xl font-bold">₹{Number(plan.price)}</div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Valid for {Number(plan.durationMonths)} month{Number(plan.durationMonths) > 1 ? 's' : ''}
                    </p>
                  </div>

                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary shrink-0" />
                      <span>
                        {plan.isUnlimited
                          ? 'Unlimited article submissions'
                          : `${Number(plan.maxArticles)} article submission${Number(plan.maxArticles) > 1 ? 's' : ''}`}
                      </span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary shrink-0" />
                      <span>Access to all journals</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary shrink-0" />
                      <span>Priority support</span>
                    </li>
                    {plan.isInstitute && (
                      <li className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-primary shrink-0" />
                        <span>Multiple user accounts</span>
                      </li>
                    )}
                  </ul>

                  <Button
                    className="w-full"
                    variant={plan.isUnlimited ? 'default' : 'outline'}
                    onClick={() => handlePurchase(plan.id, plan.name, Number(plan.price))}
                    disabled={!isAuthenticated || createCheckout.isPending || !isStripeConfigured}
                  >
                    {createCheckout.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-4 w-4 mr-2" />
                        Purchase Plan
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No subscription plans available</p>
            </CardContent>
          </Card>
        )}

        <div className="mt-12 max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Benefits</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Flexible Plans</h3>
                <p className="text-sm text-muted-foreground">
                  Choose from individual, bulk, or institutional plans based on your needs
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Easy Cancellation</h3>
                <p className="text-sm text-muted-foreground">
                  Cancel your subscription anytime if you haven't submitted any articles yet
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Secure Payments</h3>
                <p className="text-sm text-muted-foreground">
                  All payments are processed securely through Stripe
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
