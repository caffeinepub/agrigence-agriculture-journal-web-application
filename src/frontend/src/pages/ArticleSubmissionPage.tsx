import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useSubmitArticle, useHasActiveSubscription } from '../hooks/useQueries';
import { ExternalBlob, Variant_doc_pdf } from '../backend';
import { toast } from 'sonner';
import { Upload, AlertCircle, FileText } from 'lucide-react';

export default function ArticleSubmissionPage() {
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [fileType, setFileType] = useState<'pdf' | 'doc'>('pdf');
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const submitArticle = useSubmitArticle();
  const principal = identity?.getPrincipal();
  const { data: hasSubscription, isLoading: subscriptionLoading } = useHasActiveSubscription(principal || null as any);

  const isAuthenticated = !!identity;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !file) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!hasSubscription) {
      toast.error('You need an active subscription to submit articles');
      navigate({ to: '/subscription' });
      return;
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const externalBlob = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
        setUploadProgress(percentage);
      });

      const fileTypeVariant: Variant_doc_pdf = fileType === 'pdf' ? Variant_doc_pdf.pdf : Variant_doc_pdf.doc;

      await submitArticle.mutateAsync({
        title,
        fileType: fileTypeVariant,
        fileName: file.name,
        fileSize: BigInt(file.size),
        externalBlob,
      });

      toast.success('Article submitted successfully!');
      navigate({ to: '/dashboard' });
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit article');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container py-12">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Please login to submit articles.</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (subscriptionLoading) {
    return (
      <div className="container py-12">
        <p className="text-center text-muted-foreground">Checking subscription status...</p>
      </div>
    );
  }

  if (!hasSubscription) {
    return (
      <div className="container py-12">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You need an active subscription to submit articles.{' '}
            <Button variant="link" className="p-0 h-auto" onClick={() => navigate({ to: '/subscription' })}>
              View subscription plans
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container py-12 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Submit Article</h1>
        <p className="text-lg text-muted-foreground">
          Share your research with the agricultural community
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Article Submission Form
          </CardTitle>
          <CardDescription>
            Please provide your article details and upload your document
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Article Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter your article title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fileType">File Type</Label>
              <Select value={fileType} onValueChange={(value: 'pdf' | 'doc') => setFileType(value)}>
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
              <Label htmlFor="file">Upload Document</Label>
              <Input
                id="file"
                type="file"
                accept={fileType === 'pdf' ? '.pdf' : '.doc,.docx'}
                onChange={handleFileChange}
                required
              />
              {file && (
                <p className="text-sm text-muted-foreground">
                  Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>

            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={submitArticle.isPending}>
              {submitArticle.isPending ? (
                'Submitting...'
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
  );
}
