import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useGetUserArticles, useHasActiveSubscription } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { User, FileText, CheckCircle, XCircle, Clock, AlertCircle, CreditCard } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import ArticleSubmissionPlanDetailsCard from '../components/ArticleSubmissionPlanDetailsCard';

// Placeholder types for features not in current backend
type Article = {
  title: string;
  author: string;
  submissionDate: bigint;
  status: string;
  fileType: any;
  fileName: string;
  filePath: string;
  fileSize: bigint;
  externalBlob: any;
};

export default function DashboardPage() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isError: profileError } = useGetCallerUserProfile();
  const { data: userArticles, isLoading: articlesLoading, isError: articlesError } = useGetUserArticles(identity?.getPrincipal() || null);
  const { data: hasActiveSubscription, isLoading: subscriptionLoading, isError: subscriptionError } = useHasActiveSubscription(identity?.getPrincipal() || null);

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
      case 'pending':
      default:
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
    }
  };

  if (profileLoading || subscriptionLoading) {
    return (
      <div className="container py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (profileError || subscriptionError) {
    return (
      <div className="container py-12">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load dashboard data. Please refresh the page or contact support if the issue persists.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container py-12 space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Manage your profile, subscriptions, and article submissions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="border-primary/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Profile Information</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {userProfile ? (
              <>
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{userProfile.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{userProfile.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{userProfile.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Qualification</p>
                  <p className="font-medium">{userProfile.qualification}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Occupation</p>
                  <p className="font-medium">{userProfile.occupation}</p>
                </div>
              </>
            ) : (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>Profile not found</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Subscription Status Card */}
        <Card className="border-primary/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Subscription Status</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {hasActiveSubscription ? (
              <>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Active Subscription
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  You have an active subscription. View details below.
                </p>
              </>
            ) : (
              <>
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    No active subscription. Purchase a plan to submit articles.
                  </AlertDescription>
                </Alert>
                <Button asChild className="w-full">
                  <Link to="/subscription">
                    <CreditCard className="h-4 w-4 mr-2" />
                    View Article Subscription Plans
                  </Link>
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Plan Details Card - Only show if has active subscription */}
        {hasActiveSubscription && <ArticleSubmissionPlanDetailsCard />}
      </div>

      {/* Submitted Articles */}
      <Card className="border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Submitted Articles</CardTitle>
            </div>
            <Button asChild size="sm">
              <Link to="/submit-article">
                <FileText className="h-4 w-4 mr-2" />
                Submit New Article
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {articlesLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : articlesError ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Failed to load articles</AlertDescription>
            </Alert>
          ) : !userArticles || userArticles.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No articles submitted yet</p>
              <Button asChild>
                <Link to="/submit-article">Submit Your First Article</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {userArticles.map((article: Article, index: number) => (
                <Card key={index} className="border-primary/10">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <h3 className="font-semibold text-lg">{article.title}</h3>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                          <span>Submitted: {formatDate(article.submissionDate)}</span>
                          <span>•</span>
                          <span>{article.fileName}</span>
                          <span>•</span>
                          <span>{(Number(article.fileSize) / 1024 / 1024).toFixed(2)} MB</span>
                        </div>
                      </div>
                      {getStatusBadge(article.status)}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
