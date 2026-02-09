import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Calendar, FileText, AlertCircle, RefreshCw } from 'lucide-react';
import { useGetCurrentPlanDetails } from '../hooks/useQueries';

export default function ArticleSubmissionPlanDetailsCard() {
  const { data: planDetails, isLoading, isError, refetch } = useGetCurrentPlanDetails();

  if (isLoading) {
    return (
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg">Article Subscription Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError || !planDetails) {
    return (
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg">Article Subscription Plan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Plan details unavailable. Please try again.
            </AlertDescription>
          </Alert>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="w-full"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Article Subscription Plan</CardTitle>
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            Active
          </Badge>
        </div>
        <CardDescription>Your current subscription details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <FileText className="h-5 w-5 text-primary mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">Plan Name</p>
              <p className="text-base font-semibold text-foreground">{planDetails.planName}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-primary mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">Valid Until</p>
              <p className="text-base font-semibold text-foreground">{formatDate(planDetails.validUntil)}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <FileText className="h-5 w-5 text-primary mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">Submissions</p>
              {planDetails.isUnlimited ? (
                <Badge variant="secondary" className="bg-primary/10 text-primary font-semibold">
                  Unlimited
                </Badge>
              ) : (
                <p className="text-base font-semibold text-foreground">
                  {Number(planDetails.remainingArticles)} remaining
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
