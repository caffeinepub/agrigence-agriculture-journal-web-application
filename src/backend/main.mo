import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Map "mo:core/Map";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Storage "blob-storage/Storage";
import Stripe "stripe/stripe";
import MixinStorage "blob-storage/Mixin";
import Nat "mo:core/Nat";
import OutCall "http-outcalls/outcall";
import Order "mo:core/Order";

actor {
  type UserRole = AccessControl.UserRole;

  // Mixin blob storage
  include MixinStorage();

  // AUTHORIZATION STATE (from prefabricated component)
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type ArticlePreview = {
    id : Nat;
    title : Text;
    description : Text;
    author : Text;
  };

  public type VisitorCounter = {
    pageViews : Nat;
    uniqueVisitors : Nat;
    totalSessions : Nat;
    averageSessionDuration : Nat;
    activeSessions : ?Nat;
  };

  public type Magazine = {
    id : Nat;
    title : Text;
    issue : Text;
    imageUrl : Text;
    description : Text;
    publishedDate : Time.Time;
  };

  public type HomePageMagazine = {
    id : Nat;
    title : Text;
    issue : Text;
    imageUrl : Text;
    description : Text;
    publishedDate : Time.Time;
  };

  public type HomePageArticle = {
    title : Text;
    author : Text;
    description : Text;
    submissionDate : Time.Time;
  };

  public type News = {
    id : Text;
    title : Text;
    content : Text;
    createdAt : Time.Time;
    summary : Text;
  };

  public type UserReview = {
    id : Nat;
    name : Text;
    photoUrl : ?Text;
    rating : Nat;
    feedback : Text;
  };

  public type UserProfile = {
    name : Text;
    email : Text;
    phone : Text;
    qualification : Text;
    occupation : Text;
    isInstitute : Bool;
    isUnlimited : Bool;
  };

  public type EditorialMember = {
    id : Nat;
    name : Text;
    qualification : Text;
    role : Text;
    expertise : Text;
    email : Text;
    phone : Text;
    isEditorialBoardAuthor : Bool;
    isEditorInChief : Bool;
    isReviewerBoardMember : Bool;
    createdAt : Time.Time;
    profilePictureUrl : Text;
    blob : ?Storage.ExternalBlob;
  };

  public type Article = {
    title : Text;
    author : Text;
    submissionDate : Time.Time;
    status : { #pending; #approved; #rejected };
    fileType : { #pdf; #doc };
    fileName : Text;
    filePath : Text;
    fileSize : Nat;
    externalBlob : Storage.ExternalBlob;
  };

  public type SubscriptionPlan = {
    id : Text;
    name : Text;
    price : Nat;
    maxArticles : Nat;
    durationMonths : Nat;
    isUnlimited : Bool;
    isInstitute : Bool;
  };

  public type Subscription = {
    planId : Text;
    startDate : Time.Time;
    endDate : Time.Time;
    remainingArticles : Nat;
    isActive : Bool;
    isInstitute : Bool;
    isUnlimited : Bool;
  };

  public type Journal = {
    blob : Storage.ExternalBlob;
    id : Nat;
    title : Text;
    month : Nat;
    year : Nat;
    filename : Text;
    description : Text;
    fileSize : Nat;
    fileType : { #pdf };
    uploadDate : Time.Time;
    isCurrent : Bool;
    isArchive : Bool;
  };

  public type ProfileInput = {
    name : Text;
    email : Text;
    phone : Text;
    qualification : Text;
    occupation : Text;
    isInstitute : Bool;
    isUnlimited : Bool;
  };

  public type ProfileOutput = {
    name : Text;
    email : Text;
    phone : Text;
    qualification : Text;
    occupation : Text;
    isInstitute : Bool;
    isUnlimited : Bool;
    activeSubscriptions : ?[Subscription];
  };

  module ProfileOutput {
    public func compareByEmail(p1 : ProfileOutput, p2 : ProfileOutput) : Order.Order {
      Text.compare(p1.email, p2.email);
    };

    public func compareByName(p1 : ProfileOutput, p2 : ProfileOutput) : Order.Order {
      Text.compare(p1.name, p2.name);
    };

    public func compare(p1 : ProfileOutput, p2 : ProfileOutput) : Order.Order {
      compareByName(p1, p2);
    };
  };

  module Article {
    public func compareBySubmissionDate(a1 : Article, a2 : Article) : Order.Order {
      Nat.compare((a1.submissionDate).toNat(), (a2.submissionDate).toNat());
    };

    public func compareByAuthor(a1 : Article, a2 : Article) : Order.Order {
      Text.compare(a1.author, a2.author);
    };

    public func compare(a1 : Article, a2 : Article) : Order.Order {
      compareBySubmissionDate(a1, a2);
    };
  };

  module Journal {
    public func compareByUploadDate(j1 : Journal, j2 : Journal) : Order.Order {
      if (j1.uploadDate < j2.uploadDate) {
        #less;
      } else if (j1.uploadDate > j2.uploadDate) {
        #greater;
      } else {
        #equal;
      };
    };

    public func compareByYear(j1 : Journal, j2 : Journal) : Order.Order {
      Nat.compare(j1.year, j2.year);
    };

    public func compare(j1 : Journal, j2 : Journal) : Order.Order {
      compareByUploadDate(j1, j2);
    };
  };

  // DEFAULTS
  let defaultPlans : [SubscriptionPlan] = [
    {
      id = "plan-1-article";
      name = "1 Article";
      price = 149;
      maxArticles = 1;
      durationMonths = 12;
      isUnlimited = false;
      isInstitute = false;
    },
    {
      id = "plan-10-articles";
      name = "10 Articles";
      price = 499;
      maxArticles = 10;
      durationMonths = 12;
      isUnlimited = false;
      isInstitute = false;
    },
    {
      id = "plan-unlimited-2-years";
      name = "Unlimited Articles (2 years)";
      price = 1499;
      maxArticles = 0;
      durationMonths = 24;
      isUnlimited = true;
      isInstitute = false;
    },
    {
      id = "plan-institute-unlimited-1-year";
      name = "Institute Plan";
      price = 4999;
      maxArticles = 0;
      durationMonths = 12;
      isUnlimited = true;
      isInstitute = true;
    },
  ];

  // STORED DATA
  let articlePreviews = Map.empty<Nat, ArticlePreview>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let articles = Map.empty<Principal, [Article]>();
  let subscriptions = Map.empty<Principal, [Subscription]>();
  let news = Map.empty<Text, News>();
  let journals = Map.empty<Nat, Journal>();
  let editorialMembers = Map.empty<Nat, EditorialMember>();
  let magazines = Map.empty<Nat, Magazine>();
  let homePageArticles = Map.empty<Nat, HomePageArticle>();
  let homePageMagazines = Map.empty<Nat, HomePageMagazine>();
  let userReviews = Map.empty<Nat, UserReview>();

  var newsIdCounter = 1;
  var journalIdCounter = 1;
  var editorialMemberIdCounter = 1;
  var magazineIdCounter = 1;
  var homePageArticleIdCounter = 1;
  var homePageMagazineIdCounter = 1;
  var userReviewIdCounter = 1;
  var visitorCounter : VisitorCounter = {
    pageViews = 0;
    uniqueVisitors = 0;
    totalSessions = 0;
    averageSessionDuration = 0;
    activeSessions = null;
  };

  // ENDPOINTS

  // ARTICLE PREVIEWS (NEW)
  public query func getAllArticlePreviews() : async [ArticlePreview] {
    articlePreviews.values().toArray();
  };

  public query func getArticlePreview(id : Nat) : async ArticlePreview {
    switch (articlePreviews.get(id)) {
      case (null) { Runtime.trap("Article preview does not exist") };
      case (?preview) { preview };
    };
  };

  // VISITOR COUNTER
  public query func getVisitorCounter() : async VisitorCounter {
    visitorCounter;
  };

  public shared ({ caller }) func updateVisitorCounter(
    pageViews : Nat,
    uniqueVisitors : Nat,
    totalSessions : Nat,
    averageSessionDuration : Nat,
    activeSessions : ?Nat,
  ) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update visitor counter");
    };
    visitorCounter := {
      pageViews;
      uniqueVisitors;
      totalSessions;
      averageSessionDuration;
      activeSessions;
    };
  };

  // PROFILE MANAGEMENT
  public shared ({ caller }) func saveCallerUserProfile(profile : ProfileInput) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    let newProfile : UserProfile = {
      name = profile.name;
      email = profile.email;
      phone = profile.phone;
      qualification = profile.qualification;
      occupation = profile.occupation;
      isInstitute = profile.isInstitute;
      isUnlimited = profile.isUnlimited;
    };
    userProfiles.add(caller, newProfile);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getFilteredProfilesDTOs(isInstitute : Bool, isUnlimited : Bool) : async [ProfileOutput] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view bucketed profiles");
    };
    let filteredProfiles = userProfiles.values().toArray().map<UserProfile, ProfileOutput>(
      func(profile) {
        {
          profile with
          activeSubscriptions = null;
        };
      }
    ).filter(
      func(profile) {
        (profile.isInstitute == isInstitute) and (profile.isUnlimited == isUnlimited)
      }
    );
    filteredProfiles.sort();
  };

  // EDITORIAL MEMBERS
  public query func getEditorialBoardMembers() : async [EditorialMember] {
    getEditorialMembersByFilter(true, false, false);
  };

  public query func getEditorInChiefMembers() : async [EditorialMember] {
    getEditorialMembersByFilter(false, true, false);
  };

  public query func getReviewerBoardMembers() : async [EditorialMember] {
    getEditorialMembersByFilter(false, false, true);
  };

  public query func getAllEditorialMembers() : async [EditorialMember] {
    editorialMembers.values().toArray();
  };

  public shared ({ caller }) func addEditorialMember(
    name : Text,
    qualification : Text,
    role : Text,
    expertise : Text,
    email : Text,
    phone : Text,
    isEditorialBoardAuthor : Bool,
    isEditorInChief : Bool,
    isReviewerBoardMember : Bool,
    profilePictureUrl : Text,
    profilePicture : ?Storage.ExternalBlob
  ) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add editorial members");
    };
    let newMember : EditorialMember = {
      blob = profilePicture;
      id = editorialMemberIdCounter;
      name;
      qualification;
      role;
      expertise;
      email;
      phone;
      isEditorialBoardAuthor;
      isEditorInChief;
      isReviewerBoardMember;
      createdAt = Time.now();
      profilePictureUrl;
    };
    editorialMembers.add(editorialMemberIdCounter, newMember);
    editorialMemberIdCounter += 1;
  };

  public shared ({ caller }) func deleteEditorialMember(editorialMemberId : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete editorial members");
    };
    editorialMembers.remove(editorialMemberId);
  };

  func getEditorialMembersByFilter(
    isEditorialBoardAuthor : Bool,
    isEditorInChief : Bool,
    isReviewerBoardMember : Bool
  ) : [EditorialMember] {
    editorialMembers.values().toArray().filter(
      func(member) {
        member.isEditorialBoardAuthor == isEditorialBoardAuthor and
        member.isEditorInChief == isEditorInChief and
        member.isReviewerBoardMember == isReviewerBoardMember
      }
    );
  };

  // MAGAZINES
  public query func getAllMagazines() : async [Magazine] {
    magazines.values().toArray();
  };

  public query func getMagazine(magazineId : Nat) : async Magazine {
    switch (magazines.get(magazineId)) {
      case (null) { Runtime.trap("Magazine does not exist") };
      case (?magazine) { magazine };
    };
  };

  public shared ({ caller }) func createMagazine(
    title : Text,
    issue : Text,
    imageUrl : Text,
    description : Text,
    publishedDate : Time.Time
  ) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add magazines");
    };
    let newMagazine : Magazine = {
      id = magazineIdCounter;
      title;
      issue;
      description;
      publishedDate;
      imageUrl;
    };
    magazines.add(magazineIdCounter, newMagazine);
    magazineIdCounter += 1;
  };

  // HOME PAGE MAGAZINES AND ARTICLES
  public query func getHomePageMagazines() : async [HomePageMagazine] {
    homePageMagazines.values().toArray();
  };

  public query func getHomePageArticles() : async [HomePageArticle] {
    homePageArticles.values().toArray();
  };

  public shared ({ caller }) func createHomePageMagazine(
    title : Text,
    issue : Text,
    imageUrl : Text,
    description : Text,
    publishedDate : Time.Time
  ) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add home page magazines");
    };
    let newMagazine : HomePageMagazine = {
      id = homePageMagazineIdCounter;
      title;
      issue;
      description;
      publishedDate;
      imageUrl;
    };
    homePageMagazines.add(homePageMagazineIdCounter, newMagazine);
    homePageMagazineIdCounter += 1;
  };

  public shared ({ caller }) func createFeaturedHomePageMagazine(
    title : Text,
    issue : Text,
    imageUrl : Text,
    description : Text,
    publishedDate : Time.Time
  ) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add home page magazines");
    };
    let newMagazine : HomePageMagazine = {
      id = homePageMagazineIdCounter;
      title;
      issue;
      description;
      publishedDate;
      imageUrl;
    };
    homePageMagazines.add(homePageMagazineIdCounter, newMagazine);
    homePageMagazineIdCounter += 1;
  };

  public shared ({ caller }) func createHomePageArticle(
    title : Text,
    author : Text,
    description : Text,
    submissionDate : Time.Time
  ) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add home page articles");
    };
    let newArticle : HomePageArticle = {
      title;
      author;
      description;
      submissionDate;
    };
    homePageArticles.add(homePageArticleIdCounter, newArticle);
    homePageArticleIdCounter += 1;
  };

  // USER REVIEWS
  public query func getAllUserReviews() : async [UserReview] {
    userReviews.values().toArray();
  };

  public query func getUserReview(userReviewId : Nat) : async UserReview {
    switch (userReviews.get(userReviewId)) {
      case (null) { Runtime.trap("User review does not exist") };
      case (?userReview) { userReview };
    };
  };

  public shared ({ caller }) func createUserReview(
    name : Text,
    photoUrl : ?Text,
    rating : Nat,
    feedback : Text
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add reviews");
    };
    let newUserReview : UserReview = {
      id = userReviewIdCounter;
      name;
      photoUrl;
      rating;
      feedback;
    };
    userReviews.add(userReviewIdCounter, newUserReview);
    userReviewIdCounter += 1;
  };

  // NEWS
  public shared ({ caller }) func addNews(title : Text, content : Text, summary : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add news");
    };
    let newNews : News = {
      id = title.concat("_").concat(newsIdCounter.toText());
      title;
      summary;
      content;
      createdAt = Time.now();
    };
    news.add(newNews.id, newNews);
    newsIdCounter += 1;
  };

  public shared ({ caller }) func deleteNews(newsId : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete news");
    };
    news.remove(newsId);
  };

  public query func getNews(newsId : Text) : async News {
    switch (news.get(newsId)) {
      case (null) { Runtime.trap("News does not exist") };
      case (?n) { n };
    };
  };

  public query func getAllNews() : async [News] {
    let allNews = news.values().toArray();
    allNews;
  };

  public query func getLatestNews(count : Nat) : async [News] {
    let sortedNews = news.values().toArray();
    let sorted = sortedNews.reverse();
    sorted.sliceToArray(0, Nat.min(count, sorted.size()));
  };

  public query func getNewsCount() : async Nat {
    news.size();
  };

  // JOURNALS
  public shared ({ caller }) func uploadJournal(
    title : Text,
    month : Nat,
    year : Nat,
    fileName : Text,
    description : Text,
    fileSize : Nat,
    externalBlob : Storage.ExternalBlob,
    isCurrent : Bool,
    isArchive : Bool
  ) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can upload journals");
    };
    let newJournal : Journal = {
      blob = externalBlob;
      id = journalIdCounter;
      title;
      month;
      year;
      filename = fileName;
      description;
      fileSize;
      fileType = #pdf;
      uploadDate = Time.now();
      isCurrent;
      isArchive;
    };
    journals.add(journalIdCounter, newJournal);
    journalIdCounter += 1;
  };

  public query func getJournal(journalId : Nat) : async Journal {
    switch (journals.get(journalId)) {
      case (null) { Runtime.trap("Journal does not exist") };
      case (?journal) { journal };
    };
  };

  public query func getAllJournalsByYear(year : Nat) : async [Journal] {
    let allJournals = journals.values().toArray();
    let filteredJournals = allJournals.filter(
      func(journal) { journal.year == year }
    );
    filteredJournals.sort();
  };

  public query func getCurrentJournal() : async ?Journal {
    let currentYear = 2024 : Nat;
    let currentMonth = 6 : Nat;
    let filtered = journals.values().toArray().filter(func(journal) { journal.year == currentYear and journal.month == currentMonth });
    switch (filtered.size()) {
      case (0) { null };
      case (_) { ?filtered[0] };
    };
  };

  public query func getJournalCount() : async Nat {
    journals.size();
  };

  // STRIPE PRODUCTS
  public query func getSubscriptionPlans() : async [SubscriptionPlan] {
    defaultPlans;
  };

  public query func getSubscriptionPlanObject(planId : Text) : async SubscriptionPlan {
    switch (defaultPlans.find(func(plan) { plan.id == planId })) {
      case (null) { Runtime.trap("Subscription plan does not exist") };
      case (?plan) { plan };
    };
  };

  public query ({ caller }) func getUsersByPlan(planId : Text) : async [Principal] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view users by plan");
    };

    let usersWithPlan = subscriptions.toArray().filter(
      func((principal, subs)) {
        subs.find(func(sub) { sub.planId == planId }) != null;
      }
    );

    usersWithPlan.map(func((principal, _)) { principal });
  };

  public query func getPlanCount() : async Nat {
    defaultPlans.size();
  };

  // ARTICLES
  public query func getAllArticles() : async [Article] {
    var allArticles : [Article] = [];
    for ((_, userArticles) in articles.entries()) {
      let approvedArticles = userArticles.filter(func(article) { article.status == #approved });
      allArticles := allArticles.concat(approvedArticles);
    };
    allArticles.sort();
  };

  public query ({ caller }) func getUserArticles(user : Principal) : async [Article] {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own articles");
    };
    switch (articles.get(user)) {
      case (null) { [] };
      case (?userArticles) { userArticles.sort() };
    };
  };

  // SUBSCRIPTION VALIDATION FOR ARTICLES
  public shared ({ caller }) func submitArticle(
    title : Text,
    fileType : { #pdf; #doc },
    fileName : Text,
    fileSize : Nat,
    externalBlob : Storage.ExternalBlob,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit articles");
    };

    if (not (hasActiveSubscriptionInternal(caller))) {
      Runtime.trap("Your subscription is not eligible for article submission, check dashboard for details");
    };

    let newArticle : Article = {
      title;
      author = caller.toText();
      submissionDate = Time.now();
      status = #pending;
      fileType;
      fileName;
      filePath = "";
      fileSize;
      externalBlob;
    };

    switch (articles.get(caller)) {
      case (?existingArticles) {
        let updated = existingArticles.concat([newArticle]);
        articles.add(caller, updated);
      };
      case (null) {
        articles.add(caller, [newArticle]);
      };
    };
  };

  public shared ({ caller }) func updateArticleStatus(
    user : Principal,
    articleTitle : Text,
    newStatus : { #approved; #rejected },
  ) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can approve or reject articles");
    };

    switch (articles.get(user)) {
      case (?userArticles) {
        let updatedArticles = userArticles.map(
          func(article) {
            if (article.title == articleTitle) {
              { article with status = newStatus };
            } else { article };
          }
        );
        articles.add(user, updatedArticles);
      };
      case (null) {};
    };
  };

  public shared ({ caller }) func deleteArticle(articleTitle : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete articles");
    };
    switch (articles.get(caller)) {
      case (?userArticles) {
        let updatedArticles = userArticles.filter(
          func(article) { article.title != articleTitle }
        );
        articles.add(caller, updatedArticles);
      };
      case (null) {};
    };
  };

  public query ({ caller }) func getPendingArticleCount() : async Nat {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view pending article count");
    };
    var count = 0;
    let allArticles = articles.values().toArray();
    for (articleList in allArticles.values()) {
      for (article in articleList.values()) {
        if (article.status == #pending) { count += 1 };
      };
    };
    count;
  };

  public query ({ caller }) func getAllPendingArticles() : async [Article] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can get all pending articles");
    };
    var allPending : [Article] = [];
    let allArticles = articles.values().toArray();
    for (articleList in allArticles.values()) {
      for (article in articleList.values()) {
        if (article.status == #pending) {
          allPending := allPending.concat([article]);
        };
      };
    };
    allPending.sort();
  };

  // SUBSCRIPTIONS
  public shared ({ caller }) func createSubscription(planId : Text, startDate : Time.Time) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create subscriptions");
    };

    let plan = await getSubscriptionPlanObject(planId);
    let endDate : Time.Time = calculateEndDate(startDate, plan.durationMonths);

    let newSub : Subscription = {
      planId;
      startDate;
      endDate;
      remainingArticles = plan.maxArticles;
      isActive = true;
      isInstitute = plan.isInstitute;
      isUnlimited = plan.isUnlimited;
    };

    switch (subscriptions.get(caller)) {
      case (?existingSubs) {
        if (isNewSubscriptionConflict(existingSubs, planId)) {
          Runtime.trap("Conflicting subscriptions not allowed. This user currently has an active subscription of a different plan type. Please wait until it expires or contact support to upgrade/change the plan.");
        };
        let updatedSubs = existingSubs.filter(func(p) { p.planId != planId });
        subscriptions.add(caller, updatedSubs.concat([newSub]));
      };
      case (null) { subscriptions.add(caller, [newSub]) };
    };
  };

  public shared ({ caller }) func updateSubscriptionsTimestamp() : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update subscription timestamps");
    };
    let mapped = subscriptions.toArray();
    let updated = mapped.map(func((principal, existingSubs)) { (principal, existingSubs) });
    subscriptions.clear();
    for ((k, v) in updated.values()) {
      subscriptions.add(k, v);
    };
  };

  public query ({ caller }) func hasActiveSubscription(user : Principal) : async Bool {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only check your own subscription status");
    };
    hasActiveSubscriptionInternal(user);
  };

  func hasActiveSubscriptionInternal(user : Principal) : Bool {
    switch (subscriptions.get(user)) {
      case (null) { false };
      case (?userSubs) {
        userSubs.find(func(sub) { sub.isActive }) != null;
      };
    };
  };

  public query ({ caller }) func getRemainingArticles(user : Principal) : async Nat {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only check your own remaining articles");
    };
    switch (subscriptions.get(user)) {
      case (null) { 0 };
      case (?userSubs) {
        let active = userSubs.filter(func(sub) { sub.isActive });
        active.size();
      };
    };
  };

  public shared ({ caller }) func cancelSubscription(planId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can cancel subscriptions");
    };

    let userArticles = switch (articles.get(caller)) {
      case (?articles) { articles };
      case (null) { [] };
    };

    if (userArticles.size() > 0) {
      Runtime.trap("Cannot cancel subscription with existing articles. You must finish your remaining articles first.");
    };

    switch (subscriptions.get(caller)) {
      case (?existingSubs) {
        let filtered = existingSubs.filter(func(sub) { sub.planId != planId });
        subscriptions.add(caller, filtered);
      };
      case (null) {};
    };
  };

  // STRIPE/PAYMENT INTEGRATION
  var configuration : ?Stripe.StripeConfiguration = null;

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    configuration := ?config;
  };

  public query ({ caller }) func isStripeConfigured() : async Bool {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can check Stripe configuration status");
    };
    configuration != null;
  };

  func getStripeConfiguration() : Stripe.StripeConfiguration {
    switch (configuration) {
      case (null) { Runtime.trap("Stripe needs to be first configured") };
      case (?value) { value };
    };
  };

  public shared ({ caller }) func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can check session status");
    };
    await Stripe.getSessionStatus(getStripeConfiguration(), sessionId, transform);
  };

  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create checkout sessions");
    };
    await Stripe.createCheckoutSession(getStripeConfiguration(), caller, items, successUrl, cancelUrl, transform);
  };

  // HELPERS
  func calculateEndDate(startDate : Time.Time, durationMnts : Nat) : Time.Time {
    switch (durationMnts) {
      case (12) { startDate + 365 * 24 * 60 * 60 * 1000000 };
      case (24) { startDate + 2 * 365 * 24 * 60 * 60 * 1000000 };
      case (6) { startDate + 182 * 24 * 60 * 60 * 1000000 };
      case (1) { startDate + 30 * 24 * 60 * 60 * 1000000 };
      case (_) { startDate + 365 * 24 * 60 * 60 * 1000000 };
    };
  };

  func isNewSubscriptionConflict(existingSubs : [Subscription], newPlanId : Text) : Bool {
    let newPlanType = getPlanType(newPlanId);
    let existingPlansTypes = existingSubs.map(func(sub) { getPlanType(sub.planId) });
    switch (existingPlansTypes.find(func(pType) { pType == newPlanType })) {
      case (null) { false };
      case (_) { true };
    };
  };

  func getPlanType(planId : Text) : Text {
    switch (defaultPlans.find(func(p) { p.id == planId })) {
      case (?plan) {
        if (plan.isUnlimited) {
          "unlimited";
        } else if (plan.isInstitute) {
          "institute";
        } else {
          "regular";
        };
      };
      case (null) { "regular" };
    };
  };

  // HELPERS
  public query ({ caller }) func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };
};
