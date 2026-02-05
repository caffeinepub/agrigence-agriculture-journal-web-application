import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  useAddNews,
  useDeleteNews,
  useGetAllNews,
  useUploadJournal,
  useGetAllPendingArticles,
  useUpdateArticleStatus,
  useGetAllEditorialMembers,
  useAddEditorialMember,
  useUpdateEditorialMember,
  useDeleteEditorialMember,
  useGetTermsPlaceholders,
  useSetTermsPlaceholders,
  useGetAllBlogPosts,
  useAddBlogPost,
  useUpdateBlogPost,
  useDeleteBlogPost,
} from '../hooks/useQueries';
import { ExternalBlob, Variant_approved_rejected, EditorialMember, TermsPlaceholders, BlogPost } from '../backend';
import { toast } from 'sonner';
import {
  AlertCircle,
  Plus,
  Trash2,
  Upload,
  FileText,
  CheckCircle,
  XCircle,
  BookOpen,
  Newspaper,
  Users,
  Edit,
  UserPlus,
  Scale,
  Save,
  PenTool,
} from 'lucide-react';
import { Principal } from '@dfinity/principal';

export default function AdminPanelContent() {
  const { data: news, isError: newsError } = useGetAllNews();
  const { data: blogPosts, isError: blogError } = useGetAllBlogPosts();
  const { data: pendingArticles, isError: pendingError } = useGetAllPendingArticles();
  const { data: editorialMembers, isError: editorialError } = useGetAllEditorialMembers();
  const { data: termsPlaceholders, isError: termsError } = useGetTermsPlaceholders();

  const [newsTitle, setNewsTitle] = useState('');
  const [newsContent, setNewsContent] = useState('');
  const [newsSummary, setNewsSummary] = useState('');
  
  const [blogTitle, setBlogTitle] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [blogAuthorName, setBlogAuthorName] = useState('');
  const [blogSummary, setBlogSummary] = useState('');
  const [blogImage, setBlogImage] = useState<File | null>(null);
  const [blogImageUploadProgress, setBlogImageUploadProgress] = useState(0);
  
  const [journalTitle, setJournalTitle] = useState('');
  const [journalDescription, setJournalDescription] = useState('');
  const [journalMonth, setJournalMonth] = useState('');
  const [journalYear, setJournalYear] = useState('');
  const [journalFile, setJournalFile] = useState<File | null>(null);
  const [isCurrent, setIsCurrent] = useState(false);
  const [isArchive, setIsArchive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [memberName, setMemberName] = useState('');
  const [memberQualification, setMemberQualification] = useState('');
  const [memberRole, setMemberRole] = useState('');
  const [memberExpertise, setMemberExpertise] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [memberPhone, setMemberPhone] = useState('');
  const [memberPhoto, setMemberPhoto] = useState<File | null>(null);
  const [photoUploadProgress, setPhotoUploadProgress] = useState(0);

  const [websiteName, setWebsiteName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [addressCity, setAddressCity] = useState('');
  const [lastUpdateDate, setLastUpdateDate] = useState('');

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<EditorialMember | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<EditorialMember | null>(null);

  const [blogEditDialogOpen, setBlogEditDialogOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [blogDeleteDialogOpen, setBlogDeleteDialogOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<BlogPost | null>(null);

  const addNews = useAddNews();
  const deleteNews = useDeleteNews();
  const addBlogPost = useAddBlogPost();
  const updateBlogPost = useUpdateBlogPost();
  const deleteBlogPost = useDeleteBlogPost();
  const uploadJournal = useUploadJournal();
  const updateArticleStatus = useUpdateArticleStatus();
  const addEditorialMember = useAddEditorialMember();
  const updateEditorialMember = useUpdateEditorialMember();
  const deleteEditorialMember = useDeleteEditorialMember();
  const setTermsPlaceholders = useSetTermsPlaceholders();

  useEffect(() => {
    if (termsPlaceholders) {
      setWebsiteName(termsPlaceholders.websiteName);
      setCompanyName(termsPlaceholders.companyName);
      setCompanyEmail(termsPlaceholders.companyEmail);
      setCompanyAddress(termsPlaceholders.companyAddress);
      setAddressCity(termsPlaceholders.addressCity);
      setLastUpdateDate(termsPlaceholders.lastUpdateDate);
    }
  }, [termsPlaceholders]);

  const getDisplayRole = (member: EditorialMember) => {
    if (member.isEditorInChief) {
      return 'Editor-in-Chief';
    }
    return member.role;
  };

  // Show error state if any admin data fails to load
  if (newsError || blogError || pendingError || editorialError || termsError) {
    return (
      <div className="container py-12">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error loading admin data. You may not have permission to access this content.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const handleAddNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsTitle || !newsContent) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await addNews.mutateAsync({ title: newsTitle, content: newsContent, summary: newsSummary });
      toast.success('News published successfully');
      setNewsTitle('');
      setNewsContent('');
      setNewsSummary('');
    } catch (error) {
      toast.error('Failed to publish news');
      console.error(error);
    }
  };

  const handleDeleteNews = async (newsId: string) => {
    if (!confirm('Are you sure you want to delete this news item?')) {
      return;
    }

    try {
      await deleteNews.mutateAsync(newsId);
      toast.success('News deleted successfully');
    } catch (error) {
      toast.error('Failed to delete news');
      console.error(error);
    }
  };

  const handleAddBlogPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogTitle || !blogContent || !blogAuthorName || !blogSummary) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      let externalBlob: ExternalBlob | null = null;
      if (blogImage) {
        const arrayBuffer = await blogImage.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        externalBlob = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
          setBlogImageUploadProgress(percentage);
        });
      }

      await addBlogPost.mutateAsync({
        title: blogTitle,
        content: blogContent,
        authorName: blogAuthorName,
        imageUrl: blogImage ? blogImage.name : null,
        publicationDate: BigInt(Date.now() * 1000000),
        blob: externalBlob,
        shortSummary: blogSummary,
      });

      toast.success('Blog post published successfully');
      setBlogTitle('');
      setBlogContent('');
      setBlogAuthorName('');
      setBlogSummary('');
      setBlogImage(null);
      setBlogImageUploadProgress(0);
    } catch (error) {
      toast.error('Failed to publish blog post');
      console.error(error);
      setBlogImageUploadProgress(0);
    }
  };

  const handleEditBlog = (blog: BlogPost) => {
    setEditingBlog(blog);
    setBlogTitle(blog.title);
    setBlogContent(blog.content);
    setBlogAuthorName(blog.authorName);
    setBlogSummary(blog.shortSummary);
    setBlogEditDialogOpen(true);
  };

  const handleUpdateBlog = async () => {
    if (!editingBlog) return;

    try {
      let externalBlob: ExternalBlob | null = null;
      if (blogImage) {
        const arrayBuffer = await blogImage.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        externalBlob = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
          setBlogImageUploadProgress(percentage);
        });
      }

      await updateBlogPost.mutateAsync({
        blogPostId: editingBlog.id,
        title: blogTitle,
        content: blogContent,
        authorName: blogAuthorName,
        publicationDate: editingBlog.publicationDate,
        imageUrl: blogImage ? blogImage.name : (editingBlog.imageUrl ?? null),
        blob: externalBlob ?? (editingBlog.blob ?? null),
        shortSummary: blogSummary,
      });

      toast.success('Blog post updated successfully');
      setBlogEditDialogOpen(false);
      setEditingBlog(null);
      setBlogTitle('');
      setBlogContent('');
      setBlogAuthorName('');
      setBlogSummary('');
      setBlogImage(null);
      setBlogImageUploadProgress(0);
    } catch (error) {
      toast.error('Failed to update blog post');
      console.error(error);
      setBlogImageUploadProgress(0);
    }
  };

  const handleDeleteBlog = async () => {
    if (!blogToDelete) return;

    try {
      await deleteBlogPost.mutateAsync(blogToDelete.id);
      toast.success('Blog post deleted successfully');
      setBlogDeleteDialogOpen(false);
      setBlogToDelete(null);
    } catch (error) {
      toast.error('Failed to delete blog post');
      console.error(error);
    }
  };

  const openBlogDeleteDialog = (blog: BlogPost) => {
    setBlogToDelete(blog);
    setBlogDeleteDialogOpen(true);
  };

  const handleUploadJournal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!journalTitle || !journalMonth || !journalYear || !journalFile) {
      toast.error('Please fill in all required fields and select a PDF file');
      return;
    }

    const monthNum = parseInt(journalMonth);
    const yearNum = parseInt(journalYear);

    if (monthNum < 1 || monthNum > 12) {
      toast.error('Month must be between 1 and 12');
      return;
    }

    if (yearNum < 2020 || yearNum > 2030) {
      toast.error('Year must be between 2020 and 2030');
      return;
    }

    try {
      const arrayBuffer = await journalFile.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const externalBlob = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
        setUploadProgress(percentage);
      });

      await uploadJournal.mutateAsync({
        title: journalTitle,
        month: BigInt(monthNum),
        year: BigInt(yearNum),
        fileName: journalFile.name,
        description: journalDescription,
        fileSize: BigInt(journalFile.size),
        externalBlob,
        isCurrent,
        isArchive,
      });

      toast.success('Magazine published successfully');
      setJournalTitle('');
      setJournalDescription('');
      setJournalMonth('');
      setJournalYear('');
      setJournalFile(null);
      setIsCurrent(false);
      setIsArchive(false);
      setUploadProgress(0);
    } catch (error) {
      toast.error('Failed to upload magazine');
      console.error(error);
      setUploadProgress(0);
    }
  };

  const handleArticleAction = async (author: string, title: string, action: 'approve' | 'reject') => {
    try {
      const status: Variant_approved_rejected =
        action === 'approve' ? Variant_approved_rejected.approved : Variant_approved_rejected.rejected;
      await updateArticleStatus.mutateAsync({
        user: Principal.fromText(author),
        articleTitle: title,
        newStatus: status,
      });
      toast.success(`Article ${action}d successfully`);
    } catch (error) {
      toast.error(`Failed to ${action} article`);
      console.error(error);
    }
  };

  const handleAddEditorialMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberName || !memberQualification || !memberRole || !memberExpertise) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      let externalBlob: ExternalBlob | null = null;
      if (memberPhoto) {
        const arrayBuffer = await memberPhoto.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        externalBlob = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
          setPhotoUploadProgress(percentage);
        });
      }

      await addEditorialMember.mutateAsync({
        name: memberName,
        qualification: memberQualification,
        role: memberRole,
        expertise: memberExpertise,
        email: memberEmail,
        phone: memberPhone,
        isEditorialBoardAuthor: true,
        isEditorInChief: false,
        isReviewerBoardMember: false,
        profilePictureUrl: memberPhoto ? memberPhoto.name : '',
        profilePicture: externalBlob,
      });

      toast.success('Editorial member added successfully');
      setMemberName('');
      setMemberQualification('');
      setMemberRole('');
      setMemberExpertise('');
      setMemberEmail('');
      setMemberPhone('');
      setMemberPhoto(null);
      setPhotoUploadProgress(0);
    } catch (error) {
      toast.error('Failed to add editorial member');
      console.error(error);
      setPhotoUploadProgress(0);
    }
  };

  const handleEditMember = (member: EditorialMember) => {
    setEditingMember(member);
    setMemberName(member.name);
    setMemberQualification(member.qualification);
    setMemberRole(member.role);
    setMemberExpertise(member.expertise);
    setMemberEmail(member.email);
    setMemberPhone(member.phone);
    setEditDialogOpen(true);
  };

  const handleUpdateMember = async () => {
    if (!editingMember) return;

    try {
      let externalBlob: ExternalBlob | null = null;
      if (memberPhoto) {
        const arrayBuffer = await memberPhoto.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        externalBlob = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
          setPhotoUploadProgress(percentage);
        });
      }

      await updateEditorialMember.mutateAsync({
        editorialMemberId: editingMember.id,
        name: memberName,
        qualification: memberQualification,
        role: memberRole,
        expertise: memberExpertise,
        email: memberEmail,
        phone: memberPhone,
        isEditorialBoardAuthor: editingMember.isEditorialBoardAuthor,
        isEditorInChief: editingMember.isEditorInChief,
        isReviewerBoardMember: editingMember.isReviewerBoardMember,
        profilePictureUrl: memberPhoto ? memberPhoto.name : editingMember.profilePictureUrl,
        profilePicture: externalBlob,
      });

      toast.success('Editorial member updated successfully');
      setEditDialogOpen(false);
      setEditingMember(null);
      setMemberName('');
      setMemberQualification('');
      setMemberRole('');
      setMemberExpertise('');
      setMemberEmail('');
      setMemberPhone('');
      setMemberPhoto(null);
      setPhotoUploadProgress(0);
    } catch (error) {
      toast.error('Failed to update editorial member');
      console.error(error);
      setPhotoUploadProgress(0);
    }
  };

  const handleDeleteMember = async () => {
    if (!memberToDelete) return;

    try {
      await deleteEditorialMember.mutateAsync(memberToDelete.id);
      toast.success('Editorial member removed successfully');
      setDeleteDialogOpen(false);
      setMemberToDelete(null);
    } catch (error) {
      toast.error('Failed to remove editorial member');
      console.error(error);
    }
  };

  const openDeleteDialog = (member: EditorialMember) => {
    setMemberToDelete(member);
    setDeleteDialogOpen(true);
  };

  const handleSaveTermsPlaceholders = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const placeholders: TermsPlaceholders = {
        websiteName,
        companyName,
        companyEmail,
        companyAddress,
        addressCity,
        lastUpdateDate,
      };

      await setTermsPlaceholders.mutateAsync(placeholders);
      toast.success('Terms and Conditions placeholders updated successfully');
    } catch (error) {
      toast.error('Failed to update placeholders');
      console.error(error);
    }
  };

  return (
    <div className="container py-12 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 text-primary">Admin Panel</h1>
        <p className="text-lg text-muted-foreground">Manage publications and content for Agrigence</p>
      </div>

      <Tabs defaultValue="magazine" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
          <TabsTrigger value="magazine" className="gap-2">
            <BookOpen className="h-4 w-4" />
            Publish Magazine
          </TabsTrigger>
          <TabsTrigger value="news" className="gap-2">
            <Newspaper className="h-4 w-4" />
            Publish News
          </TabsTrigger>
          <TabsTrigger value="blog" className="gap-2">
            <PenTool className="h-4 w-4" />
            Blog Management
          </TabsTrigger>
          <TabsTrigger value="editorial" className="gap-2">
            <Users className="h-4 w-4" />
            Editorial Board
          </TabsTrigger>
          <TabsTrigger value="terms" className="gap-2">
            <Scale className="h-4 w-4" />
            Terms & Conditions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="magazine" className="space-y-6">
          <Card className="border-primary/20 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
              <CardTitle className="flex items-center gap-2 text-primary">
                <Upload className="h-5 w-5" />
                Upload New Magazine Issue
              </CardTitle>
              <CardDescription>
                Upload monthly journal PDFs with metadata. Latest issue will be featured on the homepage.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleUploadJournal} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="journalTitle" className="text-base">
                    Magazine Title <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="journalTitle"
                    value={journalTitle}
                    onChange={(e) => setJournalTitle(e.target.value)}
                    placeholder="e.g., Agrigence Journal - June 2024"
                    className="border-primary/20 focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="journalDescription" className="text-base">
                    Description
                  </Label>
                  <Textarea
                    id="journalDescription"
                    value={journalDescription}
                    onChange={(e) => setJournalDescription(e.target.value)}
                    placeholder="Brief description of this issue's content and highlights"
                    rows={3}
                    className="border-primary/20 focus:border-primary resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="journalMonth" className="text-base">
                      Month (1-12) <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="journalMonth"
                      type="number"
                      min="1"
                      max="12"
                      value={journalMonth}
                      onChange={(e) => setJournalMonth(e.target.value)}
                      placeholder="e.g., 6"
                      className="border-primary/20 focus:border-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="journalYear" className="text-base">
                      Year <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="journalYear"
                      type="number"
                      min="2020"
                      max="2030"
                      value={journalYear}
                      onChange={(e) => setJournalYear(e.target.value)}
                      placeholder="e.g., 2024"
                      className="border-primary/20 focus:border-primary"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="journalFile" className="text-base">
                    PDF File <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="journalFile"
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setJournalFile(e.target.files?.[0] || null)}
                    className="border-primary/20 focus:border-primary cursor-pointer"
                  />
                  {journalFile && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
                      <FileText className="h-4 w-4 text-primary" />
                      <span className="font-medium">{journalFile.name}</span>
                      <span className="ml-auto">({(journalFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                    </div>
                  )}
                </div>

                <div className="space-y-3 bg-muted/30 p-4 rounded-lg border border-primary/10">
                  <p className="text-sm font-medium text-muted-foreground">Display Options</p>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isCurrent"
                      checked={isCurrent}
                      onCheckedChange={(checked) => setIsCurrent(checked as boolean)}
                    />
                    <Label htmlFor="isCurrent" className="text-sm font-normal cursor-pointer">
                      Mark as current issue (will be featured on homepage)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isArchive"
                      checked={isArchive}
                      onCheckedChange={(checked) => setIsArchive(checked as boolean)}
                    />
                    <Label htmlFor="isArchive" className="text-sm font-normal cursor-pointer">
                      Add to archive (visible in journals archive page)
                    </Label>
                  </div>
                </div>

                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="space-y-2 bg-primary/5 p-4 rounded-lg border border-primary/20">
                    <div className="flex items-center justify-between text-sm font-medium">
                      <span className="text-primary">Uploading magazine...</span>
                      <span className="text-primary">{uploadProgress}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-300 ease-out"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={uploadJournal.isPending}
                  className="w-full md:w-auto"
                  size="lg"
                >
                  {uploadJournal.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Magazine
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {pendingArticles && pendingArticles.length > 0 && (
            <Card className="border-amber-500/20">
              <CardHeader className="bg-amber-50 dark:bg-amber-950/20">
                <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                  <FileText className="h-5 w-5" />
                  Pending Article Submissions
                  <Badge variant="secondary" className="ml-2">
                    {pendingArticles.length}
                  </Badge>
                </CardTitle>
                <CardDescription>Review and approve submitted research articles</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="rounded-md border border-amber-200 dark:border-amber-800">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-amber-50/50 dark:bg-amber-950/10">
                        <TableHead className="font-semibold">Title</TableHead>
                        <TableHead className="font-semibold">Author</TableHead>
                        <TableHead className="font-semibold">Submitted</TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                        <TableHead className="font-semibold text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingArticles.map((article, index) => (
                        <TableRow key={index} className="hover:bg-muted/50">
                          <TableCell className="font-medium">{article.title}</TableCell>
                          <TableCell className="text-sm text-muted-foreground font-mono">
                            {article.author.slice(0, 12)}...
                          </TableCell>
                          <TableCell className="text-sm">
                            {new Date(Number(article.submissionDate) / 1000000).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                              Pending
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-2 justify-end">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleArticleAction(article.author, article.title, 'approve')}
                                disabled={updateArticleStatus.isPending}
                                className="border-green-200 hover:bg-green-50 dark:border-green-800 dark:hover:bg-green-950"
                              >
                                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleArticleAction(article.author, article.title, 'reject')}
                                disabled={updateArticleStatus.isPending}
                                className="border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-950"
                              >
                                <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="news" className="space-y-6">
          <Card className="border-primary/20 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
              <CardTitle className="flex items-center gap-2 text-primary">
                <Plus className="h-5 w-5" />
                Publish New News Item
              </CardTitle>
              <CardDescription>
                Add news and updates that will be displayed on the homepage and news page
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleAddNews} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="newsTitle" className="text-base">
                    News Title <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="newsTitle"
                    value={newsTitle}
                    onChange={(e) => setNewsTitle(e.target.value)}
                    placeholder="Enter a compelling news headline"
                    className="border-primary/20 focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newsSummary" className="text-base">
                    Summary
                  </Label>
                  <Input
                    id="newsSummary"
                    value={newsSummary}
                    onChange={(e) => setNewsSummary(e.target.value)}
                    placeholder="Brief summary for preview (optional)"
                    className="border-primary/20 focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newsContent" className="text-base">
                    Content <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="newsContent"
                    value={newsContent}
                    onChange={(e) => setNewsContent(e.target.value)}
                    placeholder="Enter the full news content"
                    rows={6}
                    className="border-primary/20 focus:border-primary resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={addNews.isPending}
                  className="w-full md:w-auto"
                  size="lg"
                >
                  {addNews.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Publish News
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle>Published News</CardTitle>
              <CardDescription>Manage all published news items</CardDescription>
            </CardHeader>
            <CardContent>
              {news && news.length > 0 ? (
                <div className="space-y-3">
                  {news.map((item) => (
                    <div
                      key={item.id}
                      className="border border-primary/10 rounded-lg p-4 flex items-start justify-between gap-4 hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold mb-1 text-primary">{item.title}</h3>
                        {item.summary && (
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-1">{item.summary}</p>
                        )}
                        <p className="text-sm text-muted-foreground line-clamp-2">{item.content}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Published: {new Date(Number(item.createdAt) / 1000000).toLocaleDateString('en-IN')}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteNews(item.id)}
                        disabled={deleteNews.isPending}
                        className="shrink-0 hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Newspaper className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
                  <p className="text-muted-foreground">No news published yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="blog" className="space-y-6">
          <Card className="border-primary/20 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
              <CardTitle className="flex items-center gap-2 text-primary">
                <Plus className="h-5 w-5" />
                Publish New Blog Post
              </CardTitle>
              <CardDescription>
                Create and publish blog posts that will be displayed on the homepage and news page
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleAddBlogPost} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="blogTitle" className="text-base">
                    Blog Title <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="blogTitle"
                    value={blogTitle}
                    onChange={(e) => setBlogTitle(e.target.value)}
                    placeholder="Enter an engaging blog title"
                    className="border-primary/20 focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="blogAuthorName" className="text-base">
                    Author Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="blogAuthorName"
                    value={blogAuthorName}
                    onChange={(e) => setBlogAuthorName(e.target.value)}
                    placeholder="e.g., Dr. Rajesh Kumar"
                    className="border-primary/20 focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="blogSummary" className="text-base">
                    Short Summary <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="blogSummary"
                    value={blogSummary}
                    onChange={(e) => setBlogSummary(e.target.value)}
                    placeholder="Brief summary for preview (2-3 lines)"
                    rows={2}
                    className="border-primary/20 focus:border-primary resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="blogContent" className="text-base">
                    Content <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="blogContent"
                    value={blogContent}
                    onChange={(e) => setBlogContent(e.target.value)}
                    placeholder="Enter the full blog content"
                    rows={8}
                    className="border-primary/20 focus:border-primary resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="blogImage" className="text-base">
                    Featured Image (optional)
                  </Label>
                  <Input
                    id="blogImage"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setBlogImage(e.target.files?.[0] || null)}
                    className="border-primary/20 focus:border-primary cursor-pointer"
                  />
                  {blogImage && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
                      <FileText className="h-4 w-4 text-primary" />
                      <span className="font-medium">{blogImage.name}</span>
                      <span className="ml-auto">({(blogImage.size / 1024).toFixed(2)} KB)</span>
                    </div>
                  )}
                </div>

                {blogImageUploadProgress > 0 && blogImageUploadProgress < 100 && (
                  <div className="space-y-2 bg-primary/5 p-4 rounded-lg border border-primary/20">
                    <div className="flex items-center justify-between text-sm font-medium">
                      <span className="text-primary">Uploading image...</span>
                      <span className="text-primary">{blogImageUploadProgress}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-300 ease-out"
                        style={{ width: `${blogImageUploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={addBlogPost.isPending}
                  className="w-full md:w-auto"
                  size="lg"
                >
                  {addBlogPost.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Publish Blog Post
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PenTool className="h-5 w-5" />
                Published Blog Posts
                {blogPosts && (
                  <Badge variant="secondary" className="ml-2">
                    {blogPosts.length}
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>Manage all published blog posts</CardDescription>
            </CardHeader>
            <CardContent>
              {blogPosts && blogPosts.length > 0 ? (
                <div className="space-y-3">
                  {blogPosts.map((blog) => (
                    <div
                      key={blog.id.toString()}
                      className="border border-primary/10 rounded-lg p-4 hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold mb-1 text-primary">{blog.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">By {blog.authorName}</p>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{blog.shortSummary}</p>
                          <p className="text-xs text-muted-foreground">
                            Published: {new Date(Number(blog.publicationDate) / 1000000).toLocaleDateString('en-IN')}
                          </p>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditBlog(blog)}
                            className="border-primary/20 hover:bg-primary/5"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openBlogDeleteDialog(blog)}
                            disabled={deleteBlogPost.isPending}
                            className="hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <PenTool className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
                  <p className="text-muted-foreground">No blog posts published yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="editorial" className="space-y-6">
          <Card className="border-primary/20 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
              <CardTitle className="flex items-center gap-2 text-primary">
                <UserPlus className="h-5 w-5" />
                Add Editorial Board Member
              </CardTitle>
              <CardDescription>
                Add new members to the editorial board with their details and profile photo
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleAddEditorialMember} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="memberName" className="text-base">
                      Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="memberName"
                      value={memberName}
                      onChange={(e) => setMemberName(e.target.value)}
                      placeholder="e.g., Dr. Rajesh Kumar"
                      className="border-primary/20 focus:border-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="memberRole" className="text-base">
                      Designation/Role <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="memberRole"
                      value={memberRole}
                      onChange={(e) => setMemberRole(e.target.value)}
                      placeholder="e.g., Associate Editor"
                      className="border-primary/20 focus:border-primary"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="memberQualification" className="text-base">
                    Qualification <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="memberQualification"
                    value={memberQualification}
                    onChange={(e) => setMemberQualification(e.target.value)}
                    placeholder="e.g., Ph.D. in Agricultural Sciences"
                    className="border-primary/20 focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="memberExpertise" className="text-base">
                    Area of Expertise <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="memberExpertise"
                    value={memberExpertise}
                    onChange={(e) => setMemberExpertise(e.target.value)}
                    placeholder="e.g., Soil Science, Crop Management, Sustainable Agriculture"
                    rows={3}
                    className="border-primary/20 focus:border-primary resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="memberEmail" className="text-base">
                      Email
                    </Label>
                    <Input
                      id="memberEmail"
                      type="email"
                      value={memberEmail}
                      onChange={(e) => setMemberEmail(e.target.value)}
                      placeholder="e.g., rajesh@example.com"
                      className="border-primary/20 focus:border-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="memberPhone" className="text-base">
                      Phone
                    </Label>
                    <Input
                      id="memberPhone"
                      value={memberPhone}
                      onChange={(e) => setMemberPhone(e.target.value)}
                      placeholder="e.g., +91 9876543210"
                      className="border-primary/20 focus:border-primary"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="memberPhoto" className="text-base">
                    Profile Photo
                  </Label>
                  <Input
                    id="memberPhoto"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setMemberPhoto(e.target.files?.[0] || null)}
                    className="border-primary/20 focus:border-primary cursor-pointer"
                  />
                  {memberPhoto && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
                      <FileText className="h-4 w-4 text-primary" />
                      <span className="font-medium">{memberPhoto.name}</span>
                      <span className="ml-auto">({(memberPhoto.size / 1024).toFixed(2)} KB)</span>
                    </div>
                  )}
                </div>

                {photoUploadProgress > 0 && photoUploadProgress < 100 && (
                  <div className="space-y-2 bg-primary/5 p-4 rounded-lg border border-primary/20">
                    <div className="flex items-center justify-between text-sm font-medium">
                      <span className="text-primary">Uploading photo...</span>
                      <span className="text-primary">{photoUploadProgress}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-300 ease-out"
                        style={{ width: `${photoUploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={addEditorialMember.isPending}
                  className="w-full md:w-auto"
                  size="lg"
                >
                  {addEditorialMember.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Adding Member...
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add Member
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Current Editorial Board Members
                {editorialMembers && (
                  <Badge variant="secondary" className="ml-2">
                    {editorialMembers.length}
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>Manage existing editorial board members</CardDescription>
            </CardHeader>
            <CardContent>
              {editorialMembers && editorialMembers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {editorialMembers.map((member) => (
                    <div
                      key={member.id.toString()}
                      className="border border-primary/10 rounded-lg p-4 hover:shadow-md transition-all duration-300 bg-gradient-to-br from-background to-muted/20"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div className="shrink-0">
                          {member.blob ? (
                            <img
                              src={member.blob.getDirectURL()}
                              alt={member.name}
                              className="w-16 h-16 rounded-full object-cover border-2 border-primary/20"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20">
                              <Users className="h-8 w-8 text-primary/50" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-primary mb-1 line-clamp-1">{member.name}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-1">{getDisplayRole(member)}</p>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm mb-4">
                        <p className="text-muted-foreground">
                          <span className="font-medium">Qualification:</span> {member.qualification}
                        </p>
                        <p className="text-muted-foreground line-clamp-2">
                          <span className="font-medium">Expertise:</span> {member.expertise}
                        </p>
                        {member.email && (
                          <p className="text-muted-foreground line-clamp-1">
                            <span className="font-medium">Email:</span> {member.email}
                          </p>
                        )}
                        {member.phone && (
                          <p className="text-muted-foreground">
                            <span className="font-medium">Phone:</span> {member.phone}
                          </p>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditMember(member)}
                          className="flex-1 border-primary/20 hover:bg-primary/5"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openDeleteDialog(member)}
                          disabled={deleteEditorialMember.isPending}
                          className="flex-1 border-destructive/20 hover:bg-destructive/5 text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
                  <p className="text-muted-foreground">No editorial board members added yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="terms" className="space-y-6">
          <Card className="border-primary/20 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
              <CardTitle className="flex items-center gap-2 text-primary">
                <Scale className="h-5 w-5" />
                Manage Terms and Conditions Placeholders
              </CardTitle>
              <CardDescription>
                Update placeholder values that will be displayed in the Terms and Conditions page
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSaveTermsPlaceholders} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="websiteName" className="text-base">
                      Website Name
                    </Label>
                    <Input
                      id="websiteName"
                      value={websiteName}
                      onChange={(e) => setWebsiteName(e.target.value)}
                      placeholder="e.g., Agrigence"
                      className="border-primary/20 focus:border-primary"
                    />
                    <p className="text-xs text-muted-foreground">Replaces [Website Name] in the terms</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="companyName" className="text-base">
                      Company Name
                    </Label>
                    <Input
                      id="companyName"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g., Agrigence Publications"
                      className="border-primary/20 focus:border-primary"
                    />
                    <p className="text-xs text-muted-foreground">Replaces [Company Name] in the terms</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyEmail" className="text-base">
                    Contact Email
                  </Label>
                  <Input
                    id="companyEmail"
                    type="email"
                    value={companyEmail}
                    onChange={(e) => setCompanyEmail(e.target.value)}
                    placeholder="e.g., agrigence@gmail.com"
                    className="border-primary/20 focus:border-primary"
                  />
                  <p className="text-xs text-muted-foreground">Replaces [Email] in the terms</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyAddress" className="text-base">
                      Address
                    </Label>
                    <Input
                      id="companyAddress"
                      value={companyAddress}
                      onChange={(e) => setCompanyAddress(e.target.value)}
                      placeholder="e.g., Zura Haradhan, Chandauli, Uttar Pradesh, 221115"
                      className="border-primary/20 focus:border-primary"
                    />
                    <p className="text-xs text-muted-foreground">Replaces [Address] in the terms</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="addressCity" className="text-base">
                      City
                    </Label>
                    <Input
                      id="addressCity"
                      value={addressCity}
                      onChange={(e) => setAddressCity(e.target.value)}
                      placeholder="e.g., Chandauli"
                      className="border-primary/20 focus:border-primary"
                    />
                    <p className="text-xs text-muted-foreground">Replaces [City] in the terms</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastUpdateDate" className="text-base">
                    Last Updated Date
                  </Label>
                  <Input
                    id="lastUpdateDate"
                    value={lastUpdateDate}
                    onChange={(e) => setLastUpdateDate(e.target.value)}
                    placeholder="e.g., February 2, 2026"
                    className="border-primary/20 focus:border-primary"
                  />
                  <p className="text-xs text-muted-foreground">Replaces [Date] in the terms</p>
                </div>

                <Alert className="bg-primary/5 border-primary/20">
                  <AlertCircle className="h-4 w-4 text-primary" />
                  <AlertDescription className="text-sm">
                    These values will replace the corresponding placeholders in the Terms and Conditions page. Make sure all information is accurate before saving.
                  </AlertDescription>
                </Alert>

                <Button
                  type="submit"
                  disabled={setTermsPlaceholders.isPending}
                  className="w-full md:w-auto"
                  size="lg"
                >
                  {setTermsPlaceholders.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Placeholders
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Editorial Member</DialogTitle>
            <DialogDescription>
              Update the member's information below.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={memberName} onChange={(e) => setMemberName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Input value={memberRole} onChange={(e) => setMemberRole(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Qualification</Label>
              <Input value={memberQualification} onChange={(e) => setMemberQualification(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Expertise</Label>
              <Textarea value={memberExpertise} onChange={(e) => setMemberExpertise(e.target.value)} rows={3} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={memberEmail} onChange={(e) => setMemberEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input value={memberPhone} onChange={(e) => setMemberPhone(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Update Photo (optional)</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setMemberPhoto(e.target.files?.[0] || null)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateMember} disabled={updateEditorialMember.isPending}>
              {updateEditorialMember.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={blogEditDialogOpen} onOpenChange={setBlogEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Blog Post</DialogTitle>
            <DialogDescription>
              Update the blog post information below.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={blogTitle} onChange={(e) => setBlogTitle(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Author Name</Label>
              <Input value={blogAuthorName} onChange={(e) => setBlogAuthorName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Short Summary</Label>
              <Textarea value={blogSummary} onChange={(e) => setBlogSummary(e.target.value)} rows={2} />
            </div>
            <div className="space-y-2">
              <Label>Content</Label>
              <Textarea value={blogContent} onChange={(e) => setBlogContent(e.target.value)} rows={6} />
            </div>
            <div className="space-y-2">
              <Label>Update Image (optional)</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setBlogImage(e.target.files?.[0] || null)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBlogEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateBlog} disabled={updateBlogPost.isPending}>
              {updateBlogPost.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Editorial Member?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove <strong>{memberToDelete?.name}</strong> from the editorial board? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteMember}
              className="bg-destructive hover:bg-destructive/90"
            >
              Remove Member
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={blogDeleteDialogOpen} onOpenChange={setBlogDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Blog Post?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{blogToDelete?.title}</strong>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteBlog}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete Blog Post
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
