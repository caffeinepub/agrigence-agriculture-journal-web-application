import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Check, CreditCard, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useGetSubscriptionPlans, useIsStripeConfigured, useCreateCheckoutSession } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import StripeSetupDialog from '../components/StripeSetupDialog';
import { useIsCallerAdmin } from '../hooks/useQueries';
import type { ShoppingItem } from '../backend';

export default function SubscriptionPage() {
  const { identity } = useInternetIdentity();
  const { data: plans, isLoading: plansLoading, isError: plansError } = useGetSubscriptionPlans();
  const { data: isStripeConfigured, isLoading: stripeLoading } = useIsStripeConfigured();
  const { data: isAdmin } = useIsCallerAdmin();
  const createCheckoutSession = useCreateCheckoutSession();
  const [showStripeSetup, setShowStripeSetup] = useState(false);
  const [processingPlanId, setProcessingPlanId] = useState<string | null>(null);

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

    setProcessingPlanId(planId);

    try {
      const items: ShoppingItem[] = [
        {
          productName: planName,
          productDescription: `Article Subscription Plan: ${planName}`,
          priceInCents: BigInt(price * 100),
          currency: 'inr',
          quantity: BigInt(1),
        },
      ];

      const session = await createCheckoutSession.mutateAsync(items);

      if (!session?.url) {
        throw new Error('Stripe session missing url');
      }

      window.location.href = session.url;
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.error(error.message || 'Failed to create checkout session');
      setProcessingPlanId(null);
    }
  };

  if (plansLoading || stripeLoading) {
    return (
      <div className="container py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Loading subscription plans...</p>
          </div>
        </div>
      </div>
    );
  }

  if (plansError) {
    return (
      <div className="container py-12">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load subscription plans. Please refresh the page or contact support.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!isStripeConfigured && isAdmin) {
    return (
      <div className="container py-12">
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Stripe payment is not configured. Please set up Stripe to enable subscriptions.
          </AlertDescription>
        </Alert>
        <Button onClick={() => setShowStripeSetup(true)}>
          Configure Stripe
        </Button>
        <StripeSetupDialog open={showStripeSetup} onOpenChange={setShowStripeSetup} />
      </div>
    );
  }

  return (
    <div className="container py-12 space-y-16">
      {/* Article Subscription Plans Section */}
      <section>
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Article Subscription Plans</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the perfect plan for your research publication needs
          </p>
        </div>

        {!isStripeConfigured && (
          <Alert className="mb-8 max-w-4xl mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Payment system is currently being configured. Please check back soon or contact support.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {plans?.map((plan) => {
            const isProcessing = processingPlanId === plan.id;
            const features = [
              plan.isUnlimited
                ? 'Unlimited article submissions'
                : `${Number(plan.maxArticles)} article${Number(plan.maxArticles) > 1 ? 's' : ''}`,
              `Valid for ${Number(plan.durationMonths)} month${Number(plan.durationMonths) > 1 ? 's' : ''}`,
              'Peer review process',
              'Publication support',
            ];

            if (plan.isInstitute) {
              features.push('Institute-wide access');
            }

            return (
              <Card
                key={plan.id}
                className={`relative border-primary/20 hover:shadow-lg transition-all ${
                  plan.isUnlimited ? 'border-2 border-primary' : ''
                }`}
              >
                {plan.isUnlimited && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                  <div className="space-y-1">
                    <div className="text-4xl font-bold text-primary">₹{Number(plan.price)}</div>
                    <CardDescription>
                      per {Number(plan.durationMonths)} month{Number(plan.durationMonths) > 1 ? 's' : ''}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full"
                    variant={plan.isUnlimited ? 'default' : 'outline'}
                    onClick={() => handlePurchase(plan.id, plan.name, Number(plan.price))}
                    disabled={!isAuthenticated || !isStripeConfigured || isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-4 w-4 mr-2" />
                        {isAuthenticated ? 'Purchase Plan' : 'Login to Purchase'}
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Blog Subscription Plans Section */}
      <section className="border-t pt-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Blog Subscription Plans</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Access exclusive agricultural insights and expert analysis
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {[
            { name: 'Basic', price: 99, duration: 1, features: ['Monthly blog access', 'Email newsletter', 'Community forum'] },
            { name: 'Standard', price: 249, duration: 3, features: ['Quarterly blog access', 'Email newsletter', 'Community forum', 'Webinar access'] },
            { name: 'Premium', price: 799, duration: 12, features: ['Annual blog access', 'Email newsletter', 'Community forum', 'Webinar access', 'Expert Q&A sessions'] },
            { name: 'Enterprise', price: 1999, duration: 12, features: ['Annual blog access', 'Email newsletter', 'Community forum', 'Webinar access', 'Expert Q&A sessions', 'Custom content'] },
          ].map((plan) => (
            <Card key={plan.name} className="border-primary/20">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                <div className="space-y-1">
                  <div className="text-4xl font-bold text-primary">₹{plan.price}</div>
                  <CardDescription>
                    per {plan.duration} month{plan.duration > 1 ? 's' : ''}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full" variant="outline" disabled>
                  Coming Soon
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {isAdmin && (
        <StripeSetupDialog open={showStripeSetup} onOpenChange={setShowStripeSetup} />
      )}
    </div>
  );
}
