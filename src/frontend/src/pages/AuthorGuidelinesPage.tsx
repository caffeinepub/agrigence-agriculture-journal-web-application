import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { FileText, CheckCircle2, MessageCircle } from 'lucide-react';
import { SiWhatsapp } from 'react-icons/si';

export default function AuthorGuidelinesPage() {
  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Author Guidelines</h1>
          <p className="text-lg text-muted-foreground">
            Comprehensive formatting requirements for article submissions
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-6 w-6 text-primary" />
              <CardTitle>Article Formatting Requirements</CardTitle>
            </div>
            <CardDescription>
              Please ensure your manuscript adheres to the following formatting guidelines before submission
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                General Formatting
              </h3>
              <div className="space-y-2 ml-7">
                <div className="flex items-start gap-3">
                  <Badge variant="secondary" className="mt-0.5">Font</Badge>
                  <p className="text-muted-foreground">Times New Roman</p>
                </div>
                <div className="flex items-start gap-3">
                  <Badge variant="secondary" className="mt-0.5">Font Size</Badge>
                  <p className="text-muted-foreground">12pt</p>
                </div>
                <div className="flex items-start gap-3">
                  <Badge variant="secondary" className="mt-0.5">Line Spacing</Badge>
                  <p className="text-muted-foreground">1.5</p>
                </div>
                <div className="flex items-start gap-3">
                  <Badge variant="secondary" className="mt-0.5">Margins</Badge>
                  <p className="text-muted-foreground">1 inch on all sides</p>
                </div>
                <div className="flex items-start gap-3">
                  <Badge variant="secondary" className="mt-0.5">File Type</Badge>
                  <p className="text-muted-foreground">PDF or DOC only</p>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                Required Sections
              </h3>
              <div className="space-y-2 ml-7">
                <p className="text-muted-foreground">Your manuscript must include the following sections in order:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Title Page (with author information and affiliations)</li>
                  <li>Abstract (150-250 words)</li>
                  <li>Introduction</li>
                  <li>Methodology</li>
                  <li>Results</li>
                  <li>Discussion</li>
                  <li>Conclusion</li>
                  <li>References</li>
                </ul>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                Citation Format
              </h3>
              <div className="space-y-2 ml-7">
                <p className="text-muted-foreground">
                  All references must follow either <strong>APA</strong> or <strong>IEEE</strong> citation style consistently throughout the manuscript.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Ensure all in-text citations have corresponding entries in the reference list, and vice versa.
                </p>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                Submission Limits
              </h3>
              <div className="space-y-2 ml-7">
                <p className="text-muted-foreground">
                  The number of articles you can submit depends on your subscription plan:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li><strong>₹149 Plan:</strong> 1 Article submission</li>
                  <li><strong>₹499 Plan:</strong> 10 Articles (valid 12 months)</li>
                  <li><strong>₹1499 Plan:</strong> Unlimited Articles (2 years)</li>
                  <li><strong>₹4999 Institute Plan:</strong> Unlimited Articles (1 year)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <MessageCircle className="h-6 w-6 text-primary" />
              <CardTitle>Need Help?</CardTitle>
            </div>
            <CardDescription>
              Contact our support team for any queries or assistance with your submission
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <SiWhatsapp className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">WhatsApp Support</h3>
                <a
                  href="https://wa.me/919452571317"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  +91 9452571317
                </a>
                <p className="text-sm text-muted-foreground mt-1">
                  Available Monday - Saturday, 9:00 AM - 6:00 PM
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 p-6 bg-primary/5 rounded-lg border border-primary/20">
          <h3 className="font-semibold mb-2 text-primary">Important Note</h3>
          <p className="text-sm text-muted-foreground">
            All submissions undergo a peer-review process. Please ensure your manuscript meets all formatting requirements to avoid delays in the review process. Incomplete or improperly formatted submissions may be returned for revision.
          </p>
        </div>
      </div>
    </div>
  );
}
