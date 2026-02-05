import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function AccessDeniedScreen() {
  return (
    <div className="container py-12">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Access Denied: You do not have permission to access this page.
        </AlertDescription>
      </Alert>
    </div>
  );
}
