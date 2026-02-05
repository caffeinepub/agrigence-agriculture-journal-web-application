import { useIsCallerAdmin } from '../hooks/useQueries';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import AccessDeniedScreen from '../components/AccessDeniedScreen';
import AdminPanelContent from './AdminPanelContent';

export default function AdminPanelPage() {
  const { data: isAdmin, isLoading: adminLoading, isError } = useIsCallerAdmin();

  if (adminLoading) {
    return (
      <div className="container py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Loading admin panel...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container py-12">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error checking admin status. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!isAdmin) {
    return <AccessDeniedScreen />;
  }

  return <AdminPanelContent />;
}
