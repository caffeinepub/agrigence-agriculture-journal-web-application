import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Principal } from '@dfinity/principal';
import type {
  Product,
  ProductCategory,
  ProductInput,
} from '../backend';

// Placeholder types for features not in current backend
type UserProfile = any;
type ProfileInput = any;
type CMSBannerConfig = any;
type CMSBannerInput = any;
type News = any;
type BlogPost = any;
type Journal = any;
type EditorialMember = any;
type Article = any;
type SubscriptionPlan = any;
type HomePageMagazine = any;
type ArticlePreview = any;
type UserReview = any;
type TermsPlaceholders = any;
type SubmissionStatus = any;
type PlanStatus = any;
type StripeConfiguration = any;
type ShoppingItem = any;
type StripeSessionStatus = any;
type ExternalBlob = any;
type Variant_doc_pdf = any;
type Variant_approved_rejected = any;

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      return null; // Placeholder
    },
    enabled: false,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: ProfileInput) => {
      throw new Error('Not implemented');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

// Banner Notice Hooks
export function useGetBannerConfig() {
  const { actor, isFetching } = useActor();

  return useQuery<CMSBannerConfig>({
    queryKey: ['bannerConfig'],
    queryFn: async () => {
      return { notices: [], isBannerEnabled: false };
    },
    enabled: false,
  });
}

export function useSetBannerNotices() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notices: CMSBannerInput[]) => {
      throw new Error('Not implemented');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bannerConfig'] });
    },
  });
}

export function useToggleBanner() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (isEnabled: boolean) => {
      throw new Error('Not implemented');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bannerConfig'] });
    },
  });
}

export function useGetAllNews() {
  const { actor, isFetching } = useActor();

  return useQuery<News[]>({
    queryKey: ['news'],
    queryFn: async () => {
      return [];
    },
    enabled: false,
    retry: false,
  });
}

export function useGetLatestNews(count: number) {
  const { actor, isFetching } = useActor();

  return useQuery<News[]>({
    queryKey: ['latestNews', count],
    queryFn: async () => {
      return [];
    },
    enabled: false,
  });
}

export function useAddNews() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ title, content, summary }: { title: string; content: string; summary: string }) => {
      throw new Error('Not implemented');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
      queryClient.invalidateQueries({ queryKey: ['latestNews'] });
    },
  });
}

export function useDeleteNews() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newsId: string) => {
      throw new Error('Not implemented');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
      queryClient.invalidateQueries({ queryKey: ['latestNews'] });
    },
  });
}

// Blog Management Hooks
export function useGetAllBlogPosts() {
  const { actor, isFetching } = useActor();

  return useQuery<BlogPost[]>({
    queryKey: ['blogPosts'],
    queryFn: async () => {
      return [];
    },
    enabled: false,
    retry: false,
  });
}

export function useGetLatestBlogPosts(count: number) {
  const { actor, isFetching } = useActor();

  return useQuery<BlogPost[]>({
    queryKey: ['latestBlogPosts', count],
    queryFn: async () => {
      return [];
    },
    enabled: false,
  });
}

export function useGetBlogPostsPaginated(page: number, pageSize: number) {
  const { actor, isFetching } = useActor();

  return useQuery<BlogPost[]>({
    queryKey: ['blogPostsPaginated', page, pageSize],
    queryFn: async () => {
      return [];
    },
    enabled: false,
  });
}

export function useGetBlogPostCount() {
  const { actor, isFetching } = useActor();

  return useQuery<bigint>({
    queryKey: ['blogPostCount'],
    queryFn: async () => {
      return BigInt(0);
    },
    enabled: false,
  });
}

export function useAddBlogPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      throw new Error('Not implemented');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      queryClient.invalidateQueries({ queryKey: ['latestBlogPosts'] });
      queryClient.invalidateQueries({ queryKey: ['blogPostsPaginated'] });
      queryClient.invalidateQueries({ queryKey: ['blogPostCount'] });
    },
  });
}

export function useUpdateBlogPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      throw new Error('Not implemented');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      queryClient.invalidateQueries({ queryKey: ['latestBlogPosts'] });
      queryClient.invalidateQueries({ queryKey: ['blogPostsPaginated'] });
    },
  });
}

export function useDeleteBlogPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (blogPostId: bigint) => {
      throw new Error('Not implemented');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      queryClient.invalidateQueries({ queryKey: ['latestBlogPosts'] });
      queryClient.invalidateQueries({ queryKey: ['blogPostsPaginated'] });
      queryClient.invalidateQueries({ queryKey: ['blogPostCount'] });
    },
  });
}

export function useGetCurrentJournal() {
  const { actor, isFetching } = useActor();

  return useQuery<Journal | null>({
    queryKey: ['currentJournal'],
    queryFn: async () => {
      return null;
    },
    enabled: false,
  });
}

export function useGetAllJournalsByYear(year: number) {
  const { actor, isFetching } = useActor();

  return useQuery<Journal[]>({
    queryKey: ['journals', year],
    queryFn: async () => {
      return [];
    },
    enabled: false,
  });
}

export function useUploadJournal() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      throw new Error('Not implemented');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journals'] });
      queryClient.invalidateQueries({ queryKey: ['currentJournal'] });
    },
  });
}

export function useGetEditorialBoardMembers() {
  const { actor, isFetching } = useActor();

  return useQuery<EditorialMember[]>({
    queryKey: ['editorialBoardMembers'],
    queryFn: async () => {
      return [];
    },
    enabled: false,
  });
}

export function useGetAllEditorialMembers() {
  const { actor, isFetching } = useActor();

  return useQuery<EditorialMember[]>({
    queryKey: ['allEditorialMembers'],
    queryFn: async () => {
      return [];
    },
    enabled: false,
    retry: false,
  });
}

export function useAddEditorialMember() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      throw new Error('Not implemented');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['editorialBoardMembers'] });
      queryClient.invalidateQueries({ queryKey: ['allEditorialMembers'] });
    },
  });
}

export function useUpdateEditorialMember() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      throw new Error('Not implemented');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['editorialBoardMembers'] });
      queryClient.invalidateQueries({ queryKey: ['allEditorialMembers'] });
    },
  });
}

export function useDeleteEditorialMember() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (editorialMemberId: bigint) => {
      throw new Error('Not implemented');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['editorialBoardMembers'] });
      queryClient.invalidateQueries({ queryKey: ['allEditorialMembers'] });
    },
  });
}

export function useGetSubscriptionPlans() {
  const { actor, isFetching } = useActor();

  return useQuery<SubscriptionPlan[]>({
    queryKey: ['subscriptionPlans'],
    queryFn: async () => {
      return [];
    },
    enabled: false,
  });
}

export function useGetSubscriptionPlanObject(planId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<SubscriptionPlan | null>({
    queryKey: ['subscriptionPlan', planId],
    queryFn: async () => {
      return null;
    },
    enabled: false,
  });
}

export function useGetUserArticles(user: Principal | null) {
  const { actor, isFetching } = useActor();

  return useQuery<Article[]>({
    queryKey: ['userArticles', user?.toString()],
    queryFn: async () => {
      return [];
    },
    enabled: false,
  });
}

export function useGetAllArticles() {
  const { actor, isFetching } = useActor();

  return useQuery<Article[]>({
    queryKey: ['allArticles'],
    queryFn: async () => {
      return [];
    },
    enabled: false,
  });
}

export function useGetAllArticlePreviews() {
  const { actor, isFetching } = useActor();

  return useQuery<ArticlePreview[]>({
    queryKey: ['articlePreviews'],
    queryFn: async () => {
      return [];
    },
    enabled: false,
  });
}

export function useSubmitArticle() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      throw new Error('Not implemented');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userArticles'] });
      queryClient.invalidateQueries({ queryKey: ['pendingArticles'] });
      queryClient.invalidateQueries({ queryKey: ['submissionStatus'] });
      queryClient.invalidateQueries({ queryKey: ['currentPlanDetails'] });
    },
  });
}

export function useHasActiveSubscription(user: Principal | null) {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['hasActiveSubscription', user?.toString()],
    queryFn: async () => {
      return false;
    },
    enabled: false,
  });
}

export function useCheckArticleSubmissionAllowed() {
  const { actor, isFetching } = useActor();

  return useQuery<SubmissionStatus>({
    queryKey: ['submissionStatus'],
    queryFn: async () => {
      return { canSubmit: false, message: 'Not available' };
    },
    enabled: false,
  });
}

export function useGetCurrentPlanDetails() {
  const { actor, isFetching } = useActor();

  return useQuery<PlanStatus | null>({
    queryKey: ['currentPlanDetails'],
    queryFn: async () => {
      return null;
    },
    enabled: false,
  });
}

export function useGetAllPendingArticles() {
  const { actor, isFetching } = useActor();

  return useQuery<Article[]>({
    queryKey: ['pendingArticles'],
    queryFn: async () => {
      return [];
    },
    enabled: false,
    retry: false,
  });
}

export function useUpdateArticleStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      throw new Error('Not implemented');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingArticles'] });
      queryClient.invalidateQueries({ queryKey: ['allArticles'] });
      queryClient.invalidateQueries({ queryKey: ['userArticles'] });
    },
  });
}

export function useCreateSubscription() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ planId, user }: { planId: string; user: Principal }) => {
      throw new Error('Not implemented');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hasActiveSubscription'] });
      queryClient.invalidateQueries({ queryKey: ['currentPlanDetails'] });
      queryClient.invalidateQueries({ queryKey: ['submissionStatus'] });
    },
  });
}

export function useGetHomePageMagazines() {
  const { actor, isFetching } = useActor();

  return useQuery<HomePageMagazine[]>({
    queryKey: ['homePageMagazines'],
    queryFn: async () => {
      return [];
    },
    enabled: false,
  });
}

export function useGetAllUserReviews() {
  const { actor, isFetching } = useActor();

  return useQuery<UserReview[]>({
    queryKey: ['userReviews'],
    queryFn: async () => {
      return [];
    },
    enabled: false,
  });
}

export function useGetTermsPlaceholders() {
  const { actor, isFetching } = useActor();

  return useQuery<TermsPlaceholders>({
    queryKey: ['termsPlaceholders'],
    queryFn: async () => {
      return {};
    },
    enabled: false,
    retry: false,
  });
}

export function useSetTermsPlaceholders() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (placeholders: TermsPlaceholders) => {
      throw new Error('Not implemented');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['termsPlaceholders'] });
      queryClient.invalidateQueries({ queryKey: ['termsAndConditions'] });
    },
  });
}

export function useGetTermsAndConditions() {
  const { actor, isFetching } = useActor();

  return useQuery<string>({
    queryKey: ['termsAndConditions'],
    queryFn: async () => {
      return '';
    },
    enabled: false,
  });
}

export function useIsStripeConfigured() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isStripeConfigured'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isStripeConfigured();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSetStripeConfiguration() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (config: StripeConfiguration) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setStripeConfiguration(config);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['isStripeConfigured'] });
    },
  });
}

export function useCreateCheckoutSession() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (items: ShoppingItem[]): Promise<{ id: string; url: string }> => {
      if (!actor) throw new Error('Actor not available');
      const baseUrl = `${window.location.protocol}//${window.location.host}`;
      const successUrl = `${baseUrl}/payment-success`;
      const cancelUrl = `${baseUrl}/payment-failure`;
      const result = await actor.createCheckoutSession(items, successUrl, cancelUrl);
      const session = JSON.parse(result) as { id: string; url: string };
      if (!session?.url) {
        throw new Error('Stripe session missing url');
      }
      return session;
    },
  });
}

export function useGetStripeSessionStatus(sessionId: string | null) {
  const { actor, isFetching } = useActor();

  return useQuery<StripeSessionStatus>({
    queryKey: ['stripeSessionStatus', sessionId],
    queryFn: async () => {
      if (!actor || !sessionId) throw new Error('Actor or session ID not available');
      return actor.getStripeSessionStatus(sessionId);
    },
    enabled: !!actor && !isFetching && !!sessionId,
  });
}

// Product Management Hooks
export function useGetProductsByCategory(category: ProductCategory) {
  const { actor, isFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ['products', category],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProductsByCategory(category);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useListAllProducts() {
  const { actor, isFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ['allProducts'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listAllProducts();
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

export function useAddProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: ProductInput) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addProduct(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['allProducts'] });
    },
  });
}

export function useUpdateProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updatedInput }: { id: string; updatedInput: ProductInput }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateProduct(id, updatedInput);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['allProducts'] });
    },
  });
}

export function useRemoveProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.removeProduct(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['allProducts'] });
    },
  });
}
