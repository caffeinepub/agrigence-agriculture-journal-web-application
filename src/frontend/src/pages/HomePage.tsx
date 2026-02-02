import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useGetLatestNews, useGetHomePageMagazines, useGetHomePageArticles, useGetAllUserReviews, useGetAllArticlePreviews } from '../hooks/useQueries';
import { FileText, Newspaper, BookOpen, Calendar, User, Eye, Download, Star, Quote, Library, BookMarked } from 'lucide-react';
import React from 'react';

export default function HomePage() {
  const { data: latestNews, isLoading: newsLoading } = useGetLatestNews(3);
  const { data: homePageMagazines, isLoading: magazinesLoading } = useGetHomePageMagazines();
  const { data: homePageArticles, isLoading: articlesLoading } = useGetHomePageArticles();
  const { data: userReviews, isLoading: reviewsLoading } = useGetAllUserReviews();
  const { data: articlePreviews, isLoading: articlePreviewsLoading } = useGetAllArticlePreviews();

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const featuredMagazine = homePageMagazines?.[0];
  const featuredArticle = homePageArticles?.[0];

  const renderStars = (rating: bigint) => {
    const stars: React.ReactElement[] = [];
    const ratingNum = Number(rating);
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`h-4 w-4 ${i < ratingNum ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'}`}
        />
      );
    }
    return stars;
  };

  return (
    <div className="flex flex-col">
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden animate-fade-in">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/assets/generated/indian-farmer-rice-fields.dim_1200x600.jpg)' }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 to-background/70" />
        </div>
        <div className="container relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-slide-up text-foreground">
            Agriculture Knowledge, Research & Opportunities in One Place
          </h1>
          <p className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-8 animate-fade-in text-primary drop-shadow-lg px-4 py-3 leading-relaxed" style={{ animationDelay: '0.2s', animationDuration: '1s' }}>
            Join the leading platform for agricultural research and journal publication
          </p>
          <div className="flex flex-wrap gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <Button asChild size="lg">
              <Link to="/subscription">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/journals">Browse Journals</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-muted/30 py-16 animate-fade-in">
        <div className="container">
          <div className="flex items-center gap-2 mb-6">
            <Newspaper className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-bold">News and Updates</h2>
          </div>
          <div className="space-y-4">
            {newsLoading ? (
              <Card>
                <CardContent className="py-8">
                  <p className="text-center text-muted-foreground">Loading news...</p>
                </CardContent>
              </Card>
            ) : latestNews && latestNews.length > 0 ? (
              <>
                {latestNews.map((news) => (
                  <Card key={news.id} className="hover:shadow-md transition-all hover:-translate-y-1">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-2">{news.title}</CardTitle>
                          <CardDescription className="line-clamp-2 mb-2">
                            {news.summary || news.content}
                          </CardDescription>
                          <p className="text-xs text-muted-foreground">
                            <Calendar className="inline h-3 w-3 mr-1" />
                            {formatDate(news.createdAt)}
                          </p>
                        </div>
                        <Badge variant="secondary" className="shrink-0">
                          New
                        </Badge>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
                <div className="flex justify-center mt-6">
                  <Button asChild variant="outline">
                    <Link to="/news">View All News</Link>
                  </Button>
                </div>
              </>
            ) : (
              <Card>
                <CardContent className="py-8">
                  <p className="text-center text-muted-foreground">No news available at the moment</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      <section className="container py-16 animate-fade-in">
        <div className="flex items-center gap-2 mb-6">
          <Library className="h-6 w-6 text-primary" />
          <h2 className="text-3xl font-bold">Latest Magazines</h2>
        </div>
        {magazinesLoading ? (
          <Card>
            <CardContent className="py-8">
              <p className="text-center text-muted-foreground">Loading magazines...</p>
            </CardContent>
          </Card>
        ) : homePageMagazines && homePageMagazines.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {homePageMagazines.map((magazine, index) => (
              <Card 
                key={magazine.id} 
                className="overflow-hidden shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="bg-muted/30 flex items-center justify-center p-6">
                  <img
                    src={magazine.imageUrl || '/assets/generated/magazine-cover-template.dim_300x400.png'}
                    alt={magazine.title}
                    className="w-full max-w-[200px] h-auto object-cover rounded-lg shadow-md"
                  />
                </div>
                <CardHeader>
                  <Badge variant="secondary" className="mb-2 w-fit">
                    {magazine.issue}
                  </Badge>
                  <CardTitle className="text-xl line-clamp-2">{magazine.title}</CardTitle>
                  <CardDescription className="line-clamp-3 text-sm">
                    {magazine.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-3">
                    <p className="text-xs text-muted-foreground">
                      <Calendar className="inline h-3 w-3 mr-1" />
                      {formatDate(magazine.publishedDate)}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Button asChild size="sm" className="flex-1">
                        <Link to="/journals">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Link>
                      </Button>
                      <Button asChild variant="outline" size="sm" className="flex-1">
                        <Link to="/journals">
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-8">
              <p className="text-center text-muted-foreground">No magazines available at the moment</p>
            </CardContent>
          </Card>
        )}
      </section>

      <section className="bg-muted/30 py-16 animate-fade-in">
        <div className="container">
          <div className="flex items-center gap-2 mb-6">
            <BookMarked className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-bold">Articles Preview</h2>
          </div>
          {articlePreviewsLoading ? (
            <Card>
              <CardContent className="py-8">
                <p className="text-center text-muted-foreground">Loading articles...</p>
              </CardContent>
            </Card>
          ) : articlePreviews && articlePreviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articlePreviews.map((article, index) => (
                <Card 
                  key={article.id} 
                  className="bg-card hover:shadow-lg transition-all hover:-translate-y-1 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader>
                    <CardTitle className="text-xl text-primary line-clamp-2">
                      {article.title}
                    </CardTitle>
                    <CardDescription className="text-sm text-muted-foreground line-clamp-3 mt-2">
                      {article.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild variant="default" size="sm" className="w-full">
                      <Link to="/journals">
                        Read More
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8">
                <p className="text-center text-muted-foreground">No article previews available at the moment</p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      <section className="container py-16 animate-fade-in">
        <div className="container">
          <div className="flex items-center gap-2 mb-6">
            <BookOpen className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-bold">Featured Magazine</h2>
          </div>
          {magazinesLoading ? (
            <Card>
              <CardContent className="py-8">
                <p className="text-center text-muted-foreground">Loading magazine...</p>
              </CardContent>
            </Card>
          ) : featuredMagazine ? (
            <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <div className="grid md:grid-cols-[300px_1fr] gap-6">
                <div className="bg-muted/30 flex items-center justify-center p-8">
                  <img
                    src={featuredMagazine.imageUrl || '/assets/generated/magazine-cover-template.dim_300x400.png'}
                    alt={featuredMagazine.title}
                    className="w-full max-w-[250px] h-auto object-cover rounded-lg shadow-md"
                  />
                </div>
                <div className="p-6 flex flex-col justify-between">
                  <div>
                    <Badge variant="secondary" className="mb-3">
                      {featuredMagazine.issue}
                    </Badge>
                    <CardTitle className="text-2xl mb-3">{featuredMagazine.title}</CardTitle>
                    <CardDescription className="text-base mb-4">
                      {featuredMagazine.description}
                    </CardDescription>
                    <p className="text-sm text-muted-foreground mb-4">
                      <Calendar className="inline h-4 w-4 mr-1" />
                      Published: {formatDate(featuredMagazine.publishedDate)}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Button asChild>
                      <Link to="/journals">
                        <Eye className="h-4 w-4 mr-2" />
                        View Magazine
                      </Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link to="/journals">
                        <Download className="h-4 w-4 mr-2" />
                        Browse Archive
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-8">
                <p className="text-center text-muted-foreground">No magazine available at the moment</p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      <section className="bg-muted/30 py-16 animate-fade-in">
        <div className="container">
          <div className="flex items-center gap-2 mb-6">
            <FileText className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-bold">Featured Article</h2>
          </div>
          {articlesLoading ? (
            <Card>
              <CardContent className="py-8">
                <p className="text-center text-muted-foreground">Loading article...</p>
              </CardContent>
            </Card>
          ) : featuredArticle ? (
            <Card className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="text-2xl">{featuredArticle.title}</CardTitle>
                <CardDescription className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4" />
                    <span>{featuredArticle.author}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(featuredArticle.submissionDate)}</span>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{featuredArticle.description}</p>
                <Button asChild variant="outline">
                  <Link to="/journals">Read More Articles</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-8">
                <p className="text-center text-muted-foreground">No articles available at the moment</p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      <section className="container py-16 animate-fade-in">
        <div className="container">
          <div className="flex items-center gap-2 mb-6">
            <Quote className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-bold">What Our Users Say</h2>
          </div>
          {reviewsLoading ? (
            <Card>
              <CardContent className="py-8">
                <p className="text-center text-muted-foreground">Loading reviews...</p>
              </CardContent>
            </Card>
          ) : userReviews && userReviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userReviews.map((review) => (
                <Card key={review.id} className="hover:shadow-lg transition-all hover:-translate-y-1 animate-fade-in">
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-3">
                      {review.photoUrl ? (
                        <img
                          src={review.photoUrl}
                          alt={review.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-6 w-6 text-primary" />
                        </div>
                      )}
                      <div className="flex-1">
                        <CardTitle className="text-base">{review.name}</CardTitle>
                        <div className="flex gap-0.5 mt-1">
                          {renderStars(review.rating)}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground italic">"{review.feedback}"</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8">
                <p className="text-center text-muted-foreground">No reviews available at the moment</p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}
