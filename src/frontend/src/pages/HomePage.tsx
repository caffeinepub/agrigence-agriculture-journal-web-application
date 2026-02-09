import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useGetLatestNews, useGetHomePageMagazines, useGetAllUserReviews, useGetAllArticlePreviews, useGetLatestBlogPosts, useGetProductsByCategory } from '../hooks/useQueries';
import { Newspaper, Calendar, User, Star, Quote, BookMarked, Library, FileText, Leaf, BookOpen, Users, Microscope, Sprout, MessageCircle, Award, GraduationCap, Lightbulb, Handshake, TrendingUp, ShoppingBag, ExternalLink, Info } from 'lucide-react';
import React from 'react';
import HomeHeroIllustration from '../components/HomeHeroIllustration';
import { fillToMinimum, sampleNews, sampleBlogPosts, sampleMagazines, sampleArticlePreviews, sampleUserReviews, sampleBooks, sampleAgProducts } from '../utils/homePageSamples';
import { ProductCategory } from '../backend';
import ProductCard from '../components/ProductCard';

export default function HomePage() {
  const { data: latestNews, isLoading: newsLoading } = useGetLatestNews(5);
  const { data: latestBlogs, isLoading: blogsLoading } = useGetLatestBlogPosts(5);
  const { data: homePageMagazines, isLoading: magazinesLoading } = useGetHomePageMagazines();
  const { data: userReviews, isLoading: reviewsLoading } = useGetAllUserReviews();
  const { data: articlePreviews, isLoading: articlePreviewsLoading } = useGetAllArticlePreviews();
  const { data: books, isLoading: booksLoading } = useGetProductsByCategory(ProductCategory.books);
  const { data: agProducts, isLoading: agProductsLoading } = useGetProductsByCategory(ProductCategory.agriculturalStore);

  // Ensure minimum 5 items per section
  const displayNews = React.useMemo(() => {
    return fillToMinimum(latestNews || [], sampleNews, 5);
  }, [latestNews]);

  const displayBlogs = React.useMemo(() => {
    return fillToMinimum(latestBlogs || [], sampleBlogPosts, 5);
  }, [latestBlogs]);

  const displayMagazines = React.useMemo(() => {
    return fillToMinimum(homePageMagazines || [], sampleMagazines, 5);
  }, [homePageMagazines]);

  const displayArticles = React.useMemo(() => {
    return fillToMinimum(articlePreviews || [], sampleArticlePreviews, 5);
  }, [articlePreviews]);

  const displayReviews = React.useMemo(() => {
    return fillToMinimum(userReviews || [], sampleUserReviews, 5);
  }, [userReviews]);

  const displayBooks = React.useMemo(() => {
    return fillToMinimum(books || [], sampleBooks, 5);
  }, [books]);

  const displayAgProducts = React.useMemo(() => {
    return fillToMinimum(agProducts || [], sampleAgProducts, 5);
  }, [agProducts]);

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

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
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden animate-fade-in">
        <HomeHeroIllustration />
        <div className="container relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-slide-up text-primary">
            Agriculture Knowledge, Research & Opportunities in One Place
          </h1>
          <p className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-8 animate-fade-in text-primary drop-shadow-lg px-4 py-3 leading-relaxed bg-background/80 backdrop-blur-sm rounded-lg inline-block" style={{ animationDelay: '0.2s', animationDuration: '1s' }}>
            Join the leading platform for agricultural research and journal publication
          </p>
          <div className="flex flex-wrap gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link to="/subscription">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-primary text-primary hover:bg-primary/10">
              <Link to="/journals">Browse Journals</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* News and Updates Section */}
      <section className="bg-muted/30 py-16 animate-fade-in">
        <div className="container">
          <div className="flex items-center gap-2 mb-6">
            <Newspaper className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-bold text-primary">News and Updates</h2>
          </div>
          <div className="space-y-4">
            {newsLoading ? (
              <Card className="border-primary/10">
                <CardContent className="py-8">
                  <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <p className="text-center text-muted-foreground">Loading news...</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <>
                {displayNews.map((news, index) => (
                  <Card key={news.id} className="hover:shadow-md transition-all hover:-translate-y-1 animate-slide-up bg-card border-primary/10" style={{ animationDelay: `${index * 0.1}s` }}>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-2 text-primary">{news.title}</CardTitle>
                          <CardDescription className="line-clamp-2 mb-2 text-foreground">{news.content}</CardDescription>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {formatDate(news.timestamp)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </>
            )}
          </div>
          <div className="mt-6 text-center">
            <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary/10">
              <Link to="/news">View All News</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Latest Blog Posts Section */}
      <section className="py-16 animate-fade-in">
        <div className="container">
          <div className="flex items-center gap-2 mb-6">
            <FileText className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-bold text-primary">Latest Blog Posts</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogsLoading ? (
              <Card className="border-primary/10">
                <CardContent className="py-8">
                  <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <p className="text-center text-muted-foreground">Loading blogs...</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <>
                {displayBlogs.map((blog, index) => (
                  <Card key={blog.id} className="hover:shadow-md transition-all hover:-translate-y-1 animate-slide-up bg-card border-primary/10 overflow-hidden" style={{ animationDelay: `${index * 0.1}s` }}>
                    {blog.featuredImage && (
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={blog.featuredImage}
                          alt={blog.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="text-lg text-primary line-clamp-2">{blog.title}</CardTitle>
                      <CardDescription className="line-clamp-3 text-foreground">{blog.content}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {blog.author}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(blog.publishedAt)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </>
            )}
          </div>
          <div className="mt-6 text-center">
            <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary/10">
              <Link to="/news">View All Blog Posts</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Magazines Section */}
      <section className="bg-muted/30 py-16 animate-fade-in">
        <div className="container">
          <div className="flex items-center gap-2 mb-6">
            <BookMarked className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-bold text-primary">Featured Magazines</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {magazinesLoading ? (
              <Card className="border-primary/10">
                <CardContent className="py-8">
                  <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <p className="text-center text-muted-foreground">Loading magazines...</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <>
                {displayMagazines.map((magazine, index) => (
                  <Card key={magazine.id} className="hover:shadow-md transition-all hover:-translate-y-1 animate-slide-up bg-card border-primary/10" style={{ animationDelay: `${index * 0.1}s` }}>
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div className="shrink-0 w-20 h-28 bg-primary/10 rounded flex items-center justify-center">
                          <Library className="h-10 w-10 text-primary" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-2 text-primary">{magazine.title}</CardTitle>
                          <CardDescription className="line-clamp-2 text-foreground">{magazine.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="bg-primary/10 text-primary">
                          Issue {Number(magazine.issueNumber)}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(magazine.publishedAt)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </>
            )}
          </div>
        </div>
      </section>

      {/* Featured Articles Section */}
      <section className="py-16 animate-fade-in">
        <div className="container">
          <div className="flex items-center gap-2 mb-6">
            <Microscope className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-bold text-primary">Featured Articles</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articlePreviewsLoading ? (
              <Card className="border-primary/10">
                <CardContent className="py-8">
                  <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <p className="text-center text-muted-foreground">Loading articles...</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <>
                {displayArticles.map((article, index) => (
                  <Card key={article.id} className="hover:shadow-md transition-all hover:-translate-y-1 animate-slide-up bg-card border-primary/10" style={{ animationDelay: `${index * 0.1}s` }}>
                    <CardHeader>
                      <CardTitle className="text-lg text-primary line-clamp-2">{article.title}</CardTitle>
                      <CardDescription className="line-clamp-3 text-foreground">{article.abstract}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <User className="h-4 w-4" />
                          <span>{article.authors.join(', ')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="border-primary/30 text-primary">
                            {article.category}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </>
            )}
          </div>
        </div>
      </section>

      {/* User Reviews Section */}
      <section className="bg-muted/30 py-16 animate-fade-in">
        <div className="container">
          <div className="flex items-center gap-2 mb-6">
            <MessageCircle className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-bold text-primary">User Reviews</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviewsLoading ? (
              <Card className="border-primary/10">
                <CardContent className="py-8">
                  <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <p className="text-center text-muted-foreground">Loading reviews...</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <>
                {displayReviews.map((review, index) => (
                  <Card key={review.id} className="hover:shadow-md transition-all hover:-translate-y-1 animate-slide-up bg-card border-primary/10" style={{ animationDelay: `${index * 0.1}s` }}>
                    <CardHeader>
                      <div className="flex items-start gap-3">
                        <Quote className="h-6 w-6 text-primary shrink-0 mt-1" />
                        <div className="flex-1">
                          <CardDescription className="text-foreground mb-3 italic">
                            "{review.comment}"
                          </CardDescription>
                          <div className="flex items-center gap-2 mb-2">
                            {renderStars(review.rating)}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <User className="h-4 w-4" />
                            <span className="font-medium">{review.userName}</span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </>
            )}
          </div>
        </div>
      </section>

      {/* Books Section */}
      <section className="py-16 animate-fade-in">
        <div className="container">
          <div className="flex items-center gap-2 mb-6">
            <BookOpen className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-bold text-primary">Recommended Books</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {booksLoading ? (
              <Card className="border-primary/10">
                <CardContent className="py-8">
                  <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <p className="text-center text-muted-foreground">Loading books...</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <>
                {displayBooks.map((book) => (
                  <ProductCard key={book.id} product={book} />
                ))}
              </>
            )}
          </div>
          <div className="mt-6 text-center">
            <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary/10">
              <Link to="/products">View All Products</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Agricultural Products Section */}
      <section className="bg-muted/30 py-16 animate-fade-in">
        <div className="container">
          <div className="flex items-center gap-2 mb-6">
            <ShoppingBag className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-bold text-primary">Agricultural Products</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agProductsLoading ? (
              <Card className="border-primary/10">
                <CardContent className="py-8">
                  <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <p className="text-center text-muted-foreground">Loading products...</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <>
                {displayAgProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </>
            )}
          </div>
          <div className="mt-6 text-center">
            <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary/10">
              <Link to="/products">View All Products</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Consultation Charges Disclaimer */}
      <section className="py-8 bg-muted/20">
        <div className="container">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Info className="h-4 w-4" />
            <p className="text-sm">
              Charges may vary based on consultation type
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
