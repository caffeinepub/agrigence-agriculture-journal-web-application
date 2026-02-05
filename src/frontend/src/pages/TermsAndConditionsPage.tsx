import { useGetTermsAndConditions } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { FileText, AlertCircle } from 'lucide-react';

export default function TermsAndConditionsPage() {
  const { data: termsContent, isLoading, error } = useGetTermsAndConditions();

  if (isLoading) {
    return (
      <div className="container py-12 animate-fade-in">
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-12">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load Terms and Conditions. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container py-12 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FileText className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold text-primary">Terms and Conditions</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Please read these terms carefully before using our platform
          </p>
        </div>

        <Card className="border-primary/20 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent border-b border-primary/10">
            <CardTitle className="text-2xl text-primary">Legal Agreement</CardTitle>
          </CardHeader>
          <CardContent className="pt-8">
            <div className="prose prose-sm max-w-none">
              <pre className="text-muted-foreground leading-relaxed whitespace-pre-wrap font-sans text-sm">
                {termsContent}
              </pre>
            </div>

            <div className="mt-8 pt-6 border-t border-primary/10">
              <Alert className="bg-primary/5 border-primary/20">
                <AlertCircle className="h-4 w-4 text-primary" />
                <AlertDescription className="text-sm text-muted-foreground">
                  By using this platform, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
