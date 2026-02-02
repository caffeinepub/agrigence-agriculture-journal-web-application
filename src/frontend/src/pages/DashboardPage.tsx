import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useGetUserArticles, useHasActiveSubscription } from '../hooks/useQueries';
import ProfileSetupDialog from '../components/ProfileSetupDialog';
import { FileText, Upload, User, Mail, Phone, Briefcase, AlertCircle, CreditCard, Calendar, CheckCircle2 } from 'lucide-react';

export default function DashboardPage() {
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const principal = identity?.getPrincipal();
  const { data: articles, isLoading: articlesLoading } = useGetUserArticles(principal || null as any);
  const { data: hasActiveSubscription, isLoading: subscriptionLoading } = useHasActiveSubscription(principal || null as any);

  const isAuthenticated = !!identity;

  if (!isAuthenticated) {
    return (
      <div className="container py-12">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please login to access your dashboard.{' '}
            <Button variant="link" className="p-0 h-auto" onClick={() => navigate({ to: '/login' })}>
              Login here
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  if (profileLoading || subscriptionLoading) {
    return (
      <div className="container py-12">
        <p className="text-center text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <>
      <ProfileSetupDialog open={showProfileSetup} />
      <div className="container py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
          <p className="text-lg text-muted-foreground">Manage your profile and submissions</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {userProfile ? (
                  <>
                    <div>
                      <p className="text-sm text-muted-foreground">Name</p>
                      <p className="font-medium">{userProfile.name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm">{userProfile.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm">{userProfile.phone}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm">{userProfile.occupation}</p>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">No profile information available</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Subscription Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                {hasActiveSubscription ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle2 className="h-5 w-5" />
                      <span className="font-medium">Active Subscription</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Plan details available in subscription page</span>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full" onClick={() => navigate({ to: '/subscription' })}>
                      View Subscription Details
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        You don't have an active subscription. Purchase a plan to submit articles.
                      </AlertDescription>
                    </Alert>
                    <Button className="w-full" onClick={() => navigate({ to: '/subscription' })}>
                      <CreditCard className="h-4 w-4 mr-2" />
                      Buy Subscription
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  className="w-full" 
                  onClick={() => navigate({ to: '/submit-article' })}
                  disabled={!hasActiveSubscription}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Submit Article
                </Button>
                {!hasActiveSubscription && (
                  <p className="text-xs text-muted-foreground text-center">
                    Active subscription required
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  My Submissions
                </CardTitle>
                <CardDescription>Track the status of your submitted articles</CardDescription>
              </CardHeader>
              <CardContent>
                {articlesLoading ? (
                  <p className="text-muted-foreground">Loading submissions...</p>
                ) : articles && articles.length > 0 ? (
                  <div className="space-y-4">
                    {articles.map((article, index) => (
                      <div key={index} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold">{article.title}</h3>
                          <Badge
                            variant={
                              article.status === 'approved'
                                ? 'default'
                                : article.status === 'rejected'
                                  ? 'destructive'
                                  : 'secondary'
                            }
                          >
                            {article.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{article.fileName}</span>
                          <span>•</span>
                          <span>{new Date(Number(article.submissionDate) / 1000000).toLocaleDateString()}</span>
                          <span>•</span>
                          <span>{(Number(article.fileSize) / 1024 / 1024).toFixed(2)} MB</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">No submissions yet</p>
                    {hasActiveSubscription ? (
                      <Button onClick={() => navigate({ to: '/submit-article' })}>
                        <Upload className="h-4 w-4 mr-2" />
                        Submit Your First Article
                      </Button>
                    ) : (
                      <Button onClick={() => navigate({ to: '/subscription' })}>
                        <CreditCard className="h-4 w-4 mr-2" />
                        Get Subscription to Submit
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
