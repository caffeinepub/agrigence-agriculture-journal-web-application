import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useGetAllNews } from '../hooks/useQueries';
import { Newspaper, Calendar } from 'lucide-react';

export default function NewsPage() {
  const { data: news, isLoading } = useGetAllNews();

  return (
    <div className="container py-12">
      <div className="mb-8 animate-slide-up">
        <h1 className="text-4xl font-bold mb-4">News and Updates</h1>
        <p className="text-lg text-muted-foreground">
          Stay updated with the latest announcements and important information
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading news...</p>
        </div>
      ) : news && news.length > 0 ? (
        <div className="grid gap-6">
          {news.map((item) => (
            <Card key={item.id} className="hover:shadow-lg transition-all hover:-translate-y-1 animate-fade-in">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Newspaper className="h-5 w-5 text-primary" />
                      <CardTitle className="text-2xl">{item.title}</CardTitle>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(Number(item.createdAt) / 1000000).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <Badge variant="secondary">News</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-wrap">{item.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Newspaper className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No news available at the moment</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
