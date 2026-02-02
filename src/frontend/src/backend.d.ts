import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export type Time = bigint;
export interface HomePageArticle {
    title: string;
    description: string;
    author: string;
    submissionDate: Time;
}
export interface Subscription {
    endDate: Time;
    planId: string;
    isUnlimited: boolean;
    isActive: boolean;
    remainingArticles: bigint;
    isInstitute: boolean;
    startDate: Time;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface UserReview {
    id: bigint;
    name: string;
    photoUrl?: string;
    feedback: string;
    rating: bigint;
}
export interface EditorialMember {
    id: bigint;
    blob?: ExternalBlob;
    name: string;
    createdAt: Time;
    role: string;
    isEditorialBoardAuthor: boolean;
    email: string;
    expertise: string;
    profilePictureUrl: string;
    isEditorInChief: boolean;
    phone: string;
    isReviewerBoardMember: boolean;
    qualification: string;
}
export interface SubscriptionPlan {
    id: string;
    name: string;
    durationMonths: bigint;
    isUnlimited: boolean;
    maxArticles: bigint;
    price: bigint;
    isInstitute: boolean;
}
export interface HomePageMagazine {
    id: bigint;
    title: string;
    publishedDate: Time;
    description: string;
    imageUrl: string;
    issue: string;
}
export interface ProfileOutput {
    occupation: string;
    name: string;
    isUnlimited: boolean;
    email: string;
    phone: string;
    isInstitute: boolean;
    activeSubscriptions?: Array<Subscription>;
    qualification: string;
}
export type StripeSessionStatus = {
    __kind__: "completed";
    completed: {
        userPrincipal?: string;
        response: string;
    };
} | {
    __kind__: "failed";
    failed: {
        error: string;
    };
};
export interface StripeConfiguration {
    allowedCountries: Array<string>;
    secretKey: string;
}
export interface Article {
    status: Variant_pending_approved_rejected;
    title: string;
    externalBlob: ExternalBlob;
    fileName: string;
    filePath: string;
    fileSize: bigint;
    fileType: Variant_doc_pdf;
    author: string;
    submissionDate: Time;
}
export interface ArticlePreview {
    id: bigint;
    title: string;
    description: string;
    author: string;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface VisitorCounter {
    averageSessionDuration: bigint;
    activeSessions?: bigint;
    totalSessions: bigint;
    pageViews: bigint;
    uniqueVisitors: bigint;
}
export interface ShoppingItem {
    productName: string;
    currency: string;
    quantity: bigint;
    priceInCents: bigint;
    productDescription: string;
}
export interface Journal {
    id: bigint;
    month: bigint;
    title: string;
    blob: ExternalBlob;
    year: bigint;
    description: string;
    fileSize: bigint;
    fileType: Variant_pdf;
    filename: string;
    isArchive: boolean;
    isCurrent: boolean;
    uploadDate: Time;
}
export interface News {
    id: string;
    title: string;
    content: string;
    createdAt: Time;
    summary: string;
}
export interface Magazine {
    id: bigint;
    title: string;
    publishedDate: Time;
    description: string;
    imageUrl: string;
    issue: string;
}
export interface ProfileInput {
    occupation: string;
    name: string;
    isUnlimited: boolean;
    email: string;
    phone: string;
    isInstitute: boolean;
    qualification: string;
}
export interface UserProfile {
    occupation: string;
    name: string;
    isUnlimited: boolean;
    email: string;
    phone: string;
    isInstitute: boolean;
    qualification: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Variant_approved_rejected {
    approved = "approved",
    rejected = "rejected"
}
export enum Variant_doc_pdf {
    doc = "doc",
    pdf = "pdf"
}
export enum Variant_pdf {
    pdf = "pdf"
}
export enum Variant_pending_approved_rejected {
    pending = "pending",
    approved = "approved",
    rejected = "rejected"
}
export interface backendInterface {
    addEditorialMember(name: string, qualification: string, role: string, expertise: string, email: string, phone: string, isEditorialBoardAuthor: boolean, isEditorInChief: boolean, isReviewerBoardMember: boolean, profilePictureUrl: string, profilePicture: ExternalBlob | null): Promise<void>;
    addNews(title: string, content: string, summary: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    cancelSubscription(planId: string): Promise<void>;
    createCheckoutSession(items: Array<ShoppingItem>, successUrl: string, cancelUrl: string): Promise<string>;
    createFeaturedHomePageMagazine(title: string, issue: string, imageUrl: string, description: string, publishedDate: Time): Promise<void>;
    createHomePageArticle(title: string, author: string, description: string, submissionDate: Time): Promise<void>;
    createHomePageMagazine(title: string, issue: string, imageUrl: string, description: string, publishedDate: Time): Promise<void>;
    createMagazine(title: string, issue: string, imageUrl: string, description: string, publishedDate: Time): Promise<void>;
    createSubscription(planId: string, startDate: Time): Promise<void>;
    createUserReview(name: string, photoUrl: string | null, rating: bigint, feedback: string): Promise<void>;
    deleteArticle(articleTitle: string): Promise<void>;
    deleteEditorialMember(editorialMemberId: bigint): Promise<void>;
    deleteNews(newsId: string): Promise<void>;
    getAllArticlePreviews(): Promise<Array<ArticlePreview>>;
    getAllArticles(): Promise<Array<Article>>;
    getAllEditorialMembers(): Promise<Array<EditorialMember>>;
    getAllJournalsByYear(year: bigint): Promise<Array<Journal>>;
    getAllMagazines(): Promise<Array<Magazine>>;
    getAllNews(): Promise<Array<News>>;
    getAllPendingArticles(): Promise<Array<Article>>;
    getAllUserReviews(): Promise<Array<UserReview>>;
    getArticlePreview(id: bigint): Promise<ArticlePreview>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCurrentJournal(): Promise<Journal | null>;
    getEditorInChiefMembers(): Promise<Array<EditorialMember>>;
    getEditorialBoardMembers(): Promise<Array<EditorialMember>>;
    getFilteredProfilesDTOs(isInstitute: boolean, isUnlimited: boolean): Promise<Array<ProfileOutput>>;
    getHomePageArticles(): Promise<Array<HomePageArticle>>;
    getHomePageMagazines(): Promise<Array<HomePageMagazine>>;
    getJournal(journalId: bigint): Promise<Journal>;
    getJournalCount(): Promise<bigint>;
    getLatestNews(count: bigint): Promise<Array<News>>;
    getMagazine(magazineId: bigint): Promise<Magazine>;
    getNews(newsId: string): Promise<News>;
    getNewsCount(): Promise<bigint>;
    getPendingArticleCount(): Promise<bigint>;
    getPlanCount(): Promise<bigint>;
    getRemainingArticles(user: Principal): Promise<bigint>;
    getReviewerBoardMembers(): Promise<Array<EditorialMember>>;
    getStripeSessionStatus(sessionId: string): Promise<StripeSessionStatus>;
    getSubscriptionPlanObject(planId: string): Promise<SubscriptionPlan>;
    getSubscriptionPlans(): Promise<Array<SubscriptionPlan>>;
    getUserArticles(user: Principal): Promise<Array<Article>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUserReview(userReviewId: bigint): Promise<UserReview>;
    getUsersByPlan(planId: string): Promise<Array<Principal>>;
    getVisitorCounter(): Promise<VisitorCounter>;
    hasActiveSubscription(user: Principal): Promise<boolean>;
    isCallerAdmin(): Promise<boolean>;
    isStripeConfigured(): Promise<boolean>;
    saveCallerUserProfile(profile: ProfileInput): Promise<void>;
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    submitArticle(title: string, fileType: Variant_doc_pdf, fileName: string, fileSize: bigint, externalBlob: ExternalBlob): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateArticleStatus(user: Principal, articleTitle: string, newStatus: Variant_approved_rejected): Promise<void>;
    updateSubscriptionsTimestamp(): Promise<void>;
    updateVisitorCounter(pageViews: bigint, uniqueVisitors: bigint, totalSessions: bigint, averageSessionDuration: bigint, activeSessions: bigint | null): Promise<void>;
    uploadJournal(title: string, month: bigint, year: bigint, fileName: string, description: string, fileSize: bigint, externalBlob: ExternalBlob, isCurrent: boolean, isArchive: boolean): Promise<void>;
}
