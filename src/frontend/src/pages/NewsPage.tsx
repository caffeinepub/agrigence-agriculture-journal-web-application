import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetAllNews, useGetAllBlogPosts } from '../hooks/useQueries';
import { Newspaper, Calendar, FileText, User } from 'lucide-react';

export default function NewsPage() {
  const { data: news, isLoading: newsLoading } = useGetAllNews();
  const { data: blogPosts, isLoading: blogsLoading } = useGetAllBlogPosts();
  const [activeTab, setActiveTab] = useState('news');

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="container py-12">
      <div className="mb-8 animate-slide-up">
        <h1 className="text-4xl font-bold mb-4 text-primary">News & Updates</h1>
        <p className="text-lg text-muted-foreground">
          Stay updated with the latest announcements, news, and blog posts
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:inline-grid">
          <TabsTrigger value="news" className="gap-2">
            <Newspaper className="h-4 w-4" />
            News & Announcements
          </TabsTrigger>
          <TabsTrigger value="blogs" className="gap-2">
            <FileText className="h-4 w-4" />
            Blog Posts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="news" className="space-y-6">
          {newsLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading news...</p>
            </div>
          ) : news && news.length > 0 ? (
            <div className="grid gap-6">
              {news.map((item) => (
                <Card key={item.id} className="hover:shadow-lg transition-all hover:-translate-y-1 animate-fade-in border-primary/10">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Newspaper className="h-5 w-5 text-primary" />
                          <CardTitle className="text-2xl text-primary">{item.title}</CardTitle>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(item.createdAt)}</span>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">News</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground whitespace-pre-wrap">{item.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-primary/10">
              <CardContent className="py-12 text-center">
                <Newspaper className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No news available at the moment</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="blogs" className="space-y-6">
          {blogsLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading blog posts...</p>
            </div>
          ) : blogPosts && blogPosts.length > 0 ? (
            <div className="grid gap-6">
              {blogPosts.map((blog) => (
                <Card key={blog.id.toString()} className="hover:shadow-lg transition-all hover:-translate-y-1 animate-fade-in border-primary/10">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="h-5 w-5 text-primary" />
                          <CardTitle className="text-2xl text-primary">{blog.title}</CardTitle>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            <span>{blog.authorName}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(blog.publicationDate)}</span>
                          </div>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">Blog</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {blog.blob && (
                      <div className="overflow-hidden rounded-lg border border-primary/10">
                        <img
                          src={blog.blob.getDirectURL()}
                          alt={blog.title}
                          className="w-full h-64 object-cover"
                        />
                      </div>
                    )}
                    <p className="text-muted-foreground whitespace-pre-wrap">{blog.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-primary/10">
              <CardContent className="py-12 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No blog posts available at the moment</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
