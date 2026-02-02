import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { InternetIdentityProvider } from './hooks/useInternetIdentity';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import HomePage from './pages/HomePage';
import NewsPage from './pages/NewsPage';
import JournalsPage from './pages/JournalsPage';
import DashboardPage from './pages/DashboardPage';
import AdminPanelPage from './pages/AdminPanelPage';
import SubscriptionPage from './pages/SubscriptionPage';
import AboutContactPage from './pages/AboutContactPage';
import ArticleSubmissionPage from './pages/ArticleSubmissionPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PaymentFailurePage from './pages/PaymentFailurePage';
import EditorialBoardPage from './pages/EditorialBoardPage';
import AuthorGuidelinesPage from './pages/AuthorGuidelinesPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import Layout from './components/Layout';
import LoadingScreen from './components/LoadingScreen';
import './index.css';

const queryClient = new QueryClient();

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
});

const signupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/signup',
  component: SignupPage,
});

const forgotPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/forgot-password',
  component: ForgotPasswordPage,
});

const newsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/news',
  component: NewsPage,
});

const journalsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/journals',
  component: JournalsPage,
});

const editorialBoardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/editorial-board',
  component: EditorialBoardPage,
});

const authorGuidelinesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/author-guidelines',
  component: AuthorGuidelinesPage,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: DashboardPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminPanelPage,
});

const subscriptionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/subscription',
  component: SubscriptionPage,
});

const aboutContactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about-contact',
  component: AboutContactPage,
});

const articleSubmissionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/submit-article',
  component: ArticleSubmissionPage,
});

const paymentSuccessRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/payment-success',
  component: PaymentSuccessPage,
});

const paymentFailureRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/payment-failure',
  component: PaymentFailurePage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  signupRoute,
  forgotPasswordRoute,
  newsRoute,
  journalsRoute,
  editorialBoardRoute,
  authorGuidelinesRoute,
  dashboardRoute,
  adminRoute,
  subscriptionRoute,
  aboutContactRoute,
  articleSubmissionRoute,
  paymentSuccessRoute,
  paymentFailureRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <QueryClientProvider client={queryClient}>
        <InternetIdentityProvider>
          <LoadingScreen />
          <RouterProvider router={router} />
          <Toaster />
        </InternetIdentityProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
