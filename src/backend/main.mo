import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Map "mo:core/Map";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Storage "blob-storage/Storage";
import Stripe "stripe/stripe";
import MixinStorage "blob-storage/Mixin";
import OutCall "http-outcalls/outcall";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";



actor {
  type UserRole = AccessControl.UserRole;

  // Mixin blob storage
  include MixinStorage();

  // AUTHORIZATION STATE (from prefabricated component)
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Types
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

  public type BlogPost = {
    id : Nat;
    title : Text;
    content : Text;
    authorName : Text;
    publicationDate : Time.Time;
    imageUrl : ?Text;
    blob : ?Storage.ExternalBlob;
    shortSummary : Text;
  };

  public type TermsAndConditions = {
    content : Text;
    placeHolders : {
      websiteName : Text;
      companyName : Text;
      companyEmail : Text;
      companyAddress : Text;
      addressCity : Text;
      lastUpdateDate : Text;
    };
  };

  public type TermsPlaceholders = {
    websiteName : Text;
    companyName : Text;
    companyEmail : Text;
    companyAddress : Text;
    addressCity : Text;
    lastUpdateDate : Text;
  };

  // Defaults
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

  let defaultTermsContent : Text = "Welcome to [Company Name]. [Company Name] (or \"we\", \"us\", or \"our\") operates"
    # " [Website Name] (\"Website\", \"Platform\", \"Service\")."
    # "\n\n1. Acceptance of Terms\nBy accessing or using our Website, you agree to be bound by these Terms"
    # " and any applicable policies, including our Privacy Policy."
    # "\nIf you do not agree with these Terms, you must not use our Website.\n"
    # "\n2. Website Purpose\nThis Website is designed for the academic and professional exchange of "
    # "agricultural research. It serves educational and informational purposes only. No guarantee is "
    # "made regarding the accuracy or application of content.\n"
    # "\n3. User Content & Responsibilities\n- Users are solely responsible for the content they submit. "
    # "- By submitting content, you affirm it is original, does not infringe on intellectual property, "
    # "and contains no harmful or illegal material.\n"
    # "- Any views expressed in submitted articles are those of the author and do not reflect the "
    # "position of [Company Name].\n"
    # "- Users must not attempt to exploit platform vulnerabilities or use the Website for unauthorized "
    # "commercial activity.\n"
    # "- Users must comply with all applicable laws and platform policies at all times.\n"
    # "\n4. Account Security\n- Users must provide valid contact information and maintain strong passwords. "
    # "- Each account is limited to one individual or designated institution member.\n"
    # "- Inappropriate, fraudulent, or noncompliant accounts will be access restricted or terminated.\n"
    # "\n5. Subscriptions & Payments\n- Subscription fees are non-refundable except as required by law.\n"
    # "- By accessing premium content, you agree to comply with your plan status.\n"
    # "- All payments are processed through third-party provider Stripe's secure platform.\n"
    # "- Prices and subscription terms may vary by plan and regional requirements.\n"
    # "\n6. Content Ownership & Usage\n- [Company Name] retains ownership of site branding and design elements."
    # "- Content authors maintain copyright to original works in their name.\n"
    # "- By submitting work, you grant [Company Name] a perpetual license to display, reproduce, and "
    # "share content within the Platform's scope.\n"
    # "\n7. Platform Limitations\n- The Platform is provided \"as is\" and we make no guarantees regarding "
    # "uptime, performance, or uninterrupted availability.\n"
    # "- We reserve the right to modify, suspend, or discontinue services at any time."
    # "- [Company Name] is not responsible for loss of data, access restrictions, or technical "
    # "interruptions.\n"
    # "\n8. Privacy Policy\n- We collect and process user data for legitimate Platform operation and service "
    # "improvement purposes only.\n"
    # "- Data is shared only as required for payment processing, legal obligations, or with user consent.\n"
    # "- We do not sell, rent, or lease personal information to third parties for marketing purposes.\n"
    # "- We process, store, and transfer data in accordance with the laws of [Address], [City].\n"
    # "\n9. Dispute Resolution & Jurisdiction\n- Disputes will be resolved using binding arbitration, with all "
    # "claims subject to the laws of the governing jurisdiction.\n"
    # "- Legal proceedings relating to Platform use must be filed in designated courts of competent "
    # "jurisdiction in [Address], [City].\n"
    # "- Users waive any claims to class actions, loss of profit, punitive damages, or indirect losses.\n"
    # "\n10. Policy Changes\n- Terms may be revised periodically to stay current with Platform operations. "
    # "- Users will be notified prior to any substantive changes taking effect.\n"
    # "- Continued use of the Platform constitutes acceptance of current Terms.\n"
    # "[Address], [City]\nContact: [Email]\nLast Updated: [Date]";

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
  let blogPosts = Map.empty<Nat, BlogPost>();

  var newsIdCounter = 1;
  var journalIdCounter = 1;
  var editorialMemberIdCounter = 2;
  var magazineIdCounter = 1;
  var homePageArticleIdCounter = 1;
  var homePageMagazineIdCounter = 1;
  var userReviewIdCounter = 1;
  var blogPostIdCounter = 1;
  var visitorCounter : VisitorCounter = {
    pageViews = 0;
    uniqueVisitors = 0;
    totalSessions = 0;
    averageSessionDuration = 0;
    activeSessions = null;
  };

  var termsContent : Text = defaultTermsContent;
  var termsPlaceholders : TermsPlaceholders = {
    websiteName = "Agrigence";
    companyName = "Agrigence Private Limited";
    companyEmail = "admin@agrigence.com";
    companyAddress = "Zura Haradhan, Chandauli Uttar Pradesh, 221115";
    addressCity = "Chandauli";
    lastUpdateDate = "2024-06-04";
  };

  // Blog Management
  public shared ({ caller }) func addBlogPost(
    title : Text,
    content : Text,
    authorName : Text,
    imageUrl : ?Text,
    publicationDate : Time.Time,
    blob : ?Storage.ExternalBlob,
    shortSummary : Text,
  ) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add blog posts");
    };
    let newPost : BlogPost = {
      id = blogPostIdCounter;
      title;
      content;
      authorName;
      publicationDate;
      imageUrl;
      blob = blob;
      shortSummary;
    };
    blogPosts.add(blogPostIdCounter, newPost);
    blogPostIdCounter += 1;
  };

  public shared ({ caller }) func updateBlogPost(
    blogPostId : Nat,
    title : Text,
    content : Text,
    authorName : Text,
    publicationDate : Time.Time,
    imageUrl : ?Text,
    blob : ?Storage.ExternalBlob,
    shortSummary : Text,
  ) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update blog posts");
    };
    switch (blogPosts.get(blogPostId)) {
      case (null) { Runtime.trap("Blog post does not exist") };
      case (?_) {
        let updatedPost : BlogPost = {
          id = blogPostId;
          title;
          content;
          authorName;
          publicationDate;
          imageUrl;
          blob;
          shortSummary;
        };
        blogPosts.add(blogPostId, updatedPost);
      };
    };
  };

  public shared ({ caller }) func deleteBlogPost(blogPostId : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete blog posts");
    };
    blogPosts.remove(blogPostId);
  };

  public query func getBlogPost(blogPostId : Nat) : async BlogPost {
    // Public access - no authorization check needed
    switch (blogPosts.get(blogPostId)) {
      case (null) { Runtime.trap("Blog post does not exist") };
      case (?post) { post };
    };
  };

  public query func getAllBlogPosts() : async [BlogPost] {
    // Public access - no authorization check needed
    blogPosts.values().toArray();
  };

  public query func getLatestBlogPosts(count : Nat) : async [BlogPost] {
    // Public access - no authorization check needed
    let sortedPosts = blogPosts.values().toArray();
    let sorted = sortedPosts.reverse();
    sorted.sliceToArray(0, Nat.min(count, sorted.size()));
  };

  public query func getBlogPostCount() : async Nat {
    // Public access - no authorization check needed
    blogPosts.size();
  };

  public query func getBlogPostsPaginated(page : Nat, pageSize : Nat) : async [BlogPost] {
    // Public access - no authorization check needed
    let allPosts = blogPosts.toArray();
    let (start, end) = calculatePaginationIndices(allPosts.size(), page, pageSize);
    switch (start < allPosts.size()) {
      case (true) {
        switch (end <= allPosts.size()) {
          case (true) {
            switch (start == end) {
              case (true) { allPosts.sliceToArray(start, Nat.min(end + 1, allPosts.size())).map(func((_, post)) { post }) };
              case (false) { allPosts.sliceToArray(start, end).map(func((_, post)) { post }) };
            };
          };
          case (false) {
            allPosts.sliceToArray(start, allPosts.size()).map(func((_, post)) { post });
          };
        };
      };
      case (false) { [] };
    };
  };

  func calculatePaginationIndices(totalSize : Nat, page : Nat, pageSize : Nat) : (Nat, Nat) {
    let start = page * pageSize;
    let end = natMin(totalSize, start + pageSize);
    (start, end);
  };

  func natMin(a : Nat, b : Nat) : Nat {
    if (a < b) { a } else { b };
  };

  // Terms and Conditions Management
  public query func getTermsAndConditions() : async Text {
    // Public access - no authorization check needed
    // Replace placeholders with actual values
    var content = termsContent;
    content := content.replace(#text("[Website Name]"), termsPlaceholders.websiteName);
    content := content.replace(#text("[Company Name]"), termsPlaceholders.companyName);
    content := content.replace(#text("[Email]"), termsPlaceholders.companyEmail);
    content := content.replace(#text("[Address]"), termsPlaceholders.companyAddress);
    content := content.replace(#text("[City]"), termsPlaceholders.addressCity);
    content := content.replace(#text("[Date]"), termsPlaceholders.lastUpdateDate);
    content;
  };

  public query ({ caller }) func getTermsPlaceholders() : async TermsPlaceholders {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view terms placeholders");
    };
    termsPlaceholders;
  };

  public shared ({ caller }) func setTermsPlaceholders(placeholders : TermsPlaceholders) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update terms placeholders");
    };
    termsPlaceholders := placeholders;
  };

  public shared ({ caller }) func updateTermsAndConditions(content : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update terms and conditions");
    };
    termsContent := content;
  };

  // Endpoints

  // Article Previews (new)
  public query func getAllArticlePreviews() : async [ArticlePreview] {
    // Public access - no authorization check needed
    articlePreviews.values().toArray();
  };

  public query func getArticlePreview(id : Nat) : async ArticlePreview {
    // Public access - no authorization check needed
    switch (articlePreviews.get(id)) {
      case (null) { Runtime.trap("Article preview does not exist") };
      case (?preview) { preview };
    };
  };

  // Visitor Counter
  public query func getVisitorCounter() : async VisitorCounter {
    // Public access - no authorization check needed
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

  // Profile Management
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
      Runtime.trap("Unauthorized: Only users can view profiles");
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

  // Editorial Members
  public query func getEditorialBoardMembers() : async [EditorialMember] {
    // Public access - no authorization check needed
    getEditorialMembersByFilter(true, false, false);
  };

  public query func getEditorInChiefMembers() : async [EditorialMember] {
    // Public access - no authorization check needed
    getEditorialMembersByFilter(false, true, false);
  };

  public query func getReviewerBoardMembers() : async [EditorialMember] {
    // Public access - no authorization check needed
    getEditorialMembersByFilter(false, false, true);
  };

  public query func getAllEditorialMembers() : async [EditorialMember] {
    // Public access - no authorization check needed
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

  public shared ({ caller }) func updateEditorialMember(
    editorialMemberId : Nat,
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
      Runtime.trap("Unauthorized: Only admins can update editorial members");
    };

    switch (editorialMembers.get(editorialMemberId)) {
      case (null) { Runtime.trap("Editorial member does not exist") };
      case (?existingMember) {
        let updatedMember : EditorialMember = {
          blob = profilePicture;
          id = editorialMemberId;
          name;
          qualification;
          role;
          expertise;
          email;
          phone;
          isEditorialBoardAuthor;
          isEditorInChief;
          isReviewerBoardMember;
          createdAt = existingMember.createdAt;
          profilePictureUrl;
        };
        editorialMembers.add(editorialMemberId, updatedMember);
      };
    };
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

  // Magazines
  public query func getAllMagazines() : async [Magazine] {
    // Public access - no authorization check needed
    magazines.values().toArray();
  };

  public query func getMagazine(magazineId : Nat) : async Magazine {
    // Public access - no authorization check needed
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

  // Home Page Magazines and Articles
  public query func getHomePageMagazines() : async [HomePageMagazine] {
    // Public access - no authorization check needed
    homePageMagazines.values().toArray();
  };

  public query func getHomePageArticles() : async [HomePageArticle] {
    // Public access - no authorization check needed
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

  // User Reviews
  public query func getAllUserReviews() : async [UserReview] {
    // Public access - no authorization check needed
    userReviews.values().toArray();
  };

  public query func getUserReview(userReviewId : Nat) : async UserReview {
    // Public access - no authorization check needed
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

  // News
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
    // Public access - no authorization check needed
    switch (news.get(newsId)) {
      case (null) { Runtime.trap("News does not exist") };
      case (?n) { n };
    };
  };

  public query func getAllNews() : async [News] {
    // Public access - no authorization check needed
    let allNews = news.values().toArray();
    allNews;
  };

  public query func getLatestNews(count : Nat) : async [News] {
    // Public access - no authorization check needed
    let sortedNews = news.values().toArray();
    let sorted = sortedNews.reverse();
    sorted.sliceToArray(0, Nat.min(count, sorted.size()));
  };

  public query func getNewsCount() : async Nat {
    // Public access - no authorization check needed
    news.size();
  };

  // Journals
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
    // Public access - no authorization check needed
    switch (journals.get(journalId)) {
      case (null) { Runtime.trap("Journal does not exist") };
      case (?journal) { journal };
    };
  };

  public query func getAllJournalsByYear(year : Nat) : async [Journal] {
    // Public access - no authorization check needed
    let allJournals = journals.values().toArray();
    let filteredJournals = allJournals.filter(
      func(journal) { journal.year == year }
    );
    filteredJournals.sort();
  };

  public query func getCurrentJournal() : async ?Journal {
    // Public access - no authorization check needed
    let currentJournals = journals.values().toArray().filter(func(journal) { journal.isCurrent });
    switch (currentJournals.size()) {
      case (0) { null };
      case (_) { ?currentJournals[0] };
    };
  };

  public query func getJournalCount() : async Nat {
    // Public access - no authorization check needed
    journals.size();
  };

  // Stripe Products
  public query func getSubscriptionPlans() : async [SubscriptionPlan] {
    // Public access - no authorization check needed
    defaultPlans;
  };

  public query func getSubscriptionPlanObject(planId : Text) : async SubscriptionPlan {
    // Public access - no authorization check needed
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
    // Public access - no authorization check needed
    defaultPlans.size();
  };

  // Articles
  public query func getAllArticles() : async [Article] {
    // Public access - no authorization check needed (only approved articles shown)
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

  // Subscription Validation for Articles
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

        // Decrement remainingArticles when article is approved
        if (newStatus == #approved) {
          decrementRemainingArticles(user);
        };
      };
      case (null) {};
    };
  };

  // Helper function to decrement remaining articles for non-unlimited subscriptions
  func decrementRemainingArticles(user : Principal) {
    switch (subscriptions.get(user)) {
      case (?userSubs) {
        let currentTime = Time.now();
        let updatedSubs = userSubs.map(
          func(sub : Subscription) : Subscription {
            // Only decrement for active, non-unlimited subscriptions with remaining articles
            if (sub.isActive and not sub.isUnlimited and sub.endDate > currentTime and sub.remainingArticles > 0) {
              {
                sub with
                remainingArticles = sub.remainingArticles - 1;
              }
            } else {
              sub
            }
          }
        );
        subscriptions.add(user, updatedSubs);
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

  // Subscriptions
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
    
    let currentTime = Time.now();
    let allSubs = subscriptions.toArray();
    
    for ((principal, userSubs) in allSubs.values()) {
      let updatedSubs = userSubs.map(
        func(sub : Subscription) : Subscription {
          // Deactivate subscriptions that have expired
          if (sub.isActive and sub.endDate <= currentTime) {
            { sub with isActive = false }
          } else {
            sub
          }
        }
      );
      subscriptions.add(principal, updatedSubs);
    };
  };

  public query ({ caller }) func hasActiveSubscription(user : Principal) : async Bool {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only check your own subscription status");
    };
    hasActiveSubscriptionInternal(user);
  };

  func hasActiveSubscriptionInternal(user : Principal) : Bool {
    let currentTime = Time.now();
    switch (subscriptions.get(user)) {
      case (null) { false };
      case (?userSubs) {
        userSubs.find(func(sub) { sub.isActive and sub.endDate > currentTime }) != null;
      };
    };
  };

  public shared ({ caller }) func getRemainingArticles(user : Principal) : async Nat {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only check your own remaining articles");
    };

    var remainingArticlesSum : Nat = 0;
    let currentTime = Time.now();

    switch (subscriptions.get(user)) {
      case (null) { remainingArticlesSum };
      case (?userSubs) {
        for (sub in userSubs.values()) {
          if (sub.isActive and (sub.endDate > currentTime)) {
            remainingArticlesSum += sub.remainingArticles;
          };
        };
        remainingArticlesSum;
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

  // Stripe/Payment Integration
  var configuration : ?Stripe.StripeConfiguration = null;

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    configuration := ?config;
  };

  public query func isStripeConfigured() : async Bool {
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

  // Helpers
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

  // Transform function for HTTP outcalls - must be public and have no authorization
  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    // No authorization check - required for HTTP outcalls to work
    OutCall.transform(input);
  };
};
