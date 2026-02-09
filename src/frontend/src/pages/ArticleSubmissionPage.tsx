import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Upload, AlertCircle, CheckCircle, CreditCard } from 'lucide-react';
import { toast } from 'sonner';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useSubmitArticle, useCheckArticleSubmissionAllowed } from '../hooks/useQueries';
import { Link } from '@tanstack/react-router';

// Placeholder types for features not in current backend
type ExternalBlob = any;
type Variant_doc_pdf = { pdf: null } | { doc: null };

export default function ArticleSubmissionPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const [title, setTitle] = useState('');
  const [fileType, setFileType] = useState<'pdf' | 'doc'>('pdf');
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const submitArticle = useSubmitArticle();
  const { data: submissionStatus, isLoading: statusLoading } = useCheckArticleSubmissionAllowed();

  const isAuthenticated = !!identity;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error('Please login to submit articles');
      return;
    }

    if (!submissionStatus?.canSubmit) {
      toast.error(submissionStatus?.message || 'You cannot submit articles at this time');
      return;
    }

    if (!title || !file) {
      toast.error('Please fill in all fields and select a file');
      return;
    }

    toast.error('Article submission is not available in the current version');
  };

  if (!isAuthenticated) {
    return (
      <div className="container py-12">
        <Card className="max-w-2xl mx-auto border-primary/20">
          <CardHeader>
            <CardTitle className="text-2xl">Article Submission</CardTitle>
            <CardDescription>Login required to submit articles</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                You must be logged in to submit articles. Please login or create an account to continue.
              </AlertDescription>
            </Alert>
            <div className="flex gap-4">
              <Button asChild className="flex-1">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild variant="outline" className="flex-1">
                <Link to="/signup">Create Account</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (statusLoading) {
    return (
      <div className="container py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Checking submission eligibility...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!submissionStatus?.canSubmit) {
    return (
      <div className="container py-12">
        <Card className="max-w-2xl mx-auto border-primary/20">
          <CardHeader>
            <CardTitle className="text-2xl">Article Submission</CardTitle>
            <CardDescription>Subscription required to submit articles</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-base">
                {submissionStatus?.message || 'You need an active subscription to submit articles.'}
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                <h3 className="font-semibold text-lg">Why Subscribe?</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span>Submit your research articles for publication</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span>Access to peer review process</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span>Track submission status in real-time</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span>Choose from flexible Article Subscription Plans</span>
                  </li>
                </ul>
              </div>

              <Button asChild size="lg" className="w-full">
                <Link to="/subscription">
                  <CreditCard className="h-5 w-5 mr-2" />
                  View Article Subscription Plans
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Submit Article</h1>
          <p className="text-muted-foreground">Upload your research article for review and publication</p>
        </div>

        {submissionStatus && (
          <Alert className="mb-6 border-primary/20 bg-primary/5">
            <CheckCircle className="h-4 w-4 text-primary" />
            <AlertDescription className="text-foreground">
              {submissionStatus.message}
            </AlertDescription>
          </Alert>
        )}

        <Card className="border-primary/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <CardTitle>Article Details</CardTitle>
            </div>
            <CardDescription>Provide information about your article</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Article Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter article title"
                  required
                  disabled={isUploading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fileType">File Type</Label>
                <Select value={fileType} onValueChange={(value) => setFileType(value as 'pdf' | 'doc')} disabled={isUploading}>
                  <SelectTrigger id="fileType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="doc">DOC/DOCX</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="file">Upload File</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="file"
                    type="file"
                    accept={fileType === 'pdf' ? '.pdf' : '.doc,.docx'}
                    onChange={handleFileChange}
                    disabled={isUploading}
                    className="flex-1"
                  />
                  {file && (
                    <span className="text-sm text-muted-foreground whitespace-nowrap">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  )}
                </div>
                {file && (
                  <p className="text-sm text-muted-foreground">
                    Selected: {file.name}
                  </p>
                )}
              </div>

              {isUploading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Uploading...</span>
                    <span className="font-medium">{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isUploading || !file}>
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Submit Article
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
