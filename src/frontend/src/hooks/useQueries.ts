import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Principal } from '@dfinity/principal';
import type {
  ProfileInput,
  News,
  Journal,
  SubscriptionPlan,
  Article,
  UserProfile,
  StripeConfiguration,
  ExternalBlob,
  Variant_doc_pdf,
  Variant_approved_rejected,
  EditorialMember,
  ShoppingItem,
  StripeSessionStatus,
  HomePageMagazine,
  HomePageArticle,
  UserReview,
  ArticlePreview,
} from '../backend';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
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
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
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
  });
}

export function useGetAllNews() {
  const { actor, isFetching } = useActor();

  return useQuery<News[]>({
    queryKey: ['news'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllNews();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetLatestNews(count: number) {
  const { actor, isFetching } = useActor();

  return useQuery<News[]>({
    queryKey: ['latestNews', count],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLatestNews(BigInt(count));
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddNews() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ title, content, summary }: { title: string; content: string; summary: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addNews(title, content, summary);
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
      if (!actor) throw new Error('Actor not available');
      return actor.deleteNews(newsId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
      queryClient.invalidateQueries({ queryKey: ['latestNews'] });
    },
  });
}

export function useGetCurrentJournal() {
  const { actor, isFetching } = useActor();

  return useQuery<Journal | null>({
    queryKey: ['currentJournal'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCurrentJournal();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllJournalsByYear(year: number) {
  const { actor, isFetching } = useActor();

  return useQuery<Journal[]>({
    queryKey: ['journals', year],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllJournalsByYear(BigInt(year));
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUploadJournal() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      title,
      month,
      year,
      fileName,
      description,
      fileSize,
      externalBlob,
      isCurrent,
      isArchive,
    }: {
      title: string;
      month: bigint;
      year: bigint;
      fileName: string;
      description: string;
      fileSize: bigint;
      externalBlob: ExternalBlob;
      isCurrent: boolean;
      isArchive: boolean;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.uploadJournal(title, month, year, fileName, description, fileSize, externalBlob, isCurrent, isArchive);
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
      if (!actor) return [];
      return actor.getEditorialBoardMembers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllEditorialMembers() {
  const { actor, isFetching } = useActor();

  return useQuery<EditorialMember[]>({
    queryKey: ['allEditorialMembers'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllEditorialMembers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddEditorialMember() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      name,
      qualification,
      role,
      expertise,
      email,
      phone,
      isEditorialBoardAuthor,
      isEditorInChief,
      isReviewerBoardMember,
      profilePictureUrl,
      profilePicture,
    }: {
      name: string;
      qualification: string;
      role: string;
      expertise: string;
      email: string;
      phone: string;
      isEditorialBoardAuthor: boolean;
      isEditorInChief: boolean;
      isReviewerBoardMember: boolean;
      profilePictureUrl: string;
      profilePicture: ExternalBlob | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addEditorialMember(
        name,
        qualification,
        role,
        expertise,
        email,
        phone,
        isEditorialBoardAuthor,
        isEditorInChief,
        isReviewerBoardMember,
        profilePictureUrl,
        profilePicture
      );
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
      if (!actor) throw new Error('Actor not available');
      return actor.deleteEditorialMember(editorialMemberId);
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
      if (!actor) return [];
      return actor.getSubscriptionPlans();
    },
    enabled: !!actor && !isFetching,
  });
}

// Get user-specific articles (requires authentication)
export function useGetUserArticles(user: Principal | null) {
  const { actor, isFetching } = useActor();

  return useQuery<Article[]>({
    queryKey: ['userArticles', user?.toString()],
    queryFn: async () => {
      if (!actor || !user) return [];
      return actor.getUserArticles(user);
    },
    enabled: !!actor && !isFetching && !!user,
  });
}

// Get all approved articles (public search)
export function useGetAllArticles() {
  const { actor, isFetching } = useActor();

  return useQuery<Article[]>({
    queryKey: ['allArticles'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllArticles();
    },
    enabled: !!actor && !isFetching,
  });
}

// Get all article previews for homepage
export function useGetAllArticlePreviews() {
  const { actor, isFetching } = useActor();

  return useQuery<ArticlePreview[]>({
    queryKey: ['articlePreviews'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllArticlePreviews();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitArticle() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      title,
      fileType,
      fileName,
      fileSize,
      externalBlob,
    }: {
      title: string;
      fileType: Variant_doc_pdf;
      fileName: string;
      fileSize: bigint;
      externalBlob: ExternalBlob;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitArticle(title, fileType, fileName, fileSize, externalBlob);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userArticles'] });
      queryClient.invalidateQueries({ queryKey: ['pendingArticles'] });
    },
  });
}

export function useHasActiveSubscription(user: Principal | null) {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['hasActiveSubscription', user?.toString()],
    queryFn: async () => {
      if (!actor || !user) return false;
      return actor.hasActiveSubscription(user);
    },
    enabled: !!actor && !isFetching && !!user,
  });
}

export function useGetAllPendingArticles() {
  const { actor, isFetching } = useActor();

  return useQuery<Article[]>({
    queryKey: ['pendingArticles'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPendingArticles();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateArticleStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      user,
      articleTitle,
      newStatus,
    }: {
      user: Principal;
      articleTitle: string;
      newStatus: Variant_approved_rejected;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateArticleStatus(user, articleTitle, newStatus);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userArticles'] });
      queryClient.invalidateQueries({ queryKey: ['pendingArticles'] });
    },
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
    mutationFn: async ({ items, planId }: { items: ShoppingItem[]; planId: string }) => {
      if (!actor) throw new Error('Actor not available');
      const baseUrl = `${window.location.protocol}//${window.location.host}`;
      const successUrl = `${baseUrl}/payment-success?plan_id=${planId}`;
      const cancelUrl = `${baseUrl}/payment-failure`;
      return actor.createCheckoutSession(items, successUrl, cancelUrl);
    },
  });
}

export function useGetStripeSessionStatus() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (sessionId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.getStripeSessionStatus(sessionId);
    },
  });
}

export function useCreateSubscription() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ planId, startDate }: { planId: string; startDate: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createSubscription(planId, startDate);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hasActiveSubscription'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useGetHomePageMagazines() {
  const { actor, isFetching } = useActor();

  return useQuery<HomePageMagazine[]>({
    queryKey: ['homePageMagazines'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getHomePageMagazines();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetHomePageArticles() {
  const { actor, isFetching } = useActor();

  return useQuery<HomePageArticle[]>({
    queryKey: ['homePageArticles'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getHomePageArticles();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllUserReviews() {
  const { actor, isFetching } = useActor();

  return useQuery<UserReview[]>({
    queryKey: ['userReviews'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllUserReviews();
    },
    enabled: !!actor && !isFetching,
  });
}
