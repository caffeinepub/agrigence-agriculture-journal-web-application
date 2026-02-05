import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useGetLatestNews, useGetHomePageMagazines, useGetAllUserReviews, useGetAllArticlePreviews, useGetLatestBlogPosts } from '../hooks/useQueries';
import { Newspaper, Calendar, User, Star, Quote, BookMarked, Library, FileText, Leaf, BookOpen, Users, Microscope, Sprout, MessageCircle, Award, GraduationCap, Lightbulb, Handshake, TrendingUp } from 'lucide-react';
import React from 'react';

export default function HomePage() {
  const { data: latestNews, isLoading: newsLoading } = useGetLatestNews(3);
  const { data: latestBlogs, isLoading: blogsLoading } = useGetLatestBlogPosts(3);
  const { data: homePageMagazines, isLoading: magazinesLoading } = useGetHomePageMagazines();
  const { data: userReviews, isLoading: reviewsLoading } = useGetAllUserReviews();
  const { data: articlePreviews, isLoading: articlePreviewsLoading } = useGetAllArticlePreviews();

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
        <div className="absolute inset-0">
          <img
            src="/assets/file_0000000065347208b2ffcbe536786e2e.png"
            alt="Indian agriculture field with crops, vegetables, and farm machinery during sunrise"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 to-background/70" />
        </div>
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
            ) : latestNews && latestNews.length > 0 ? (
              <>
                {latestNews.map((news, index) => (
                  <Card key={news.id} className="hover:shadow-md transition-all hover:-translate-y-1 animate-slide-up bg-card border-primary/10" style={{ animationDelay: `${index * 0.1}s` }}>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-2 text-primary">{news.title}</CardTitle>
                          <CardDescription className="line-clamp-2 mb-2 text-foreground">
                            {news.summary || news.content}
                          </CardDescription>
                          <p className="text-xs text-muted-foreground">
                            <Calendar className="inline h-3 w-3 mr-1" />
                            {formatDate(news.createdAt)}
                          </p>
                        </div>
                        <Badge variant="secondary" className="shrink-0 bg-primary/10 text-primary border-primary/20">
                          New
                        </Badge>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
                <div className="flex justify-center mt-6">
                  <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary/10">
                    <Link to="/news">View All News</Link>
                  </Button>
                </div>
              </>
            ) : (
              <Card className="border-primary/10">
                <CardContent className="py-8">
                  <p className="text-center text-muted-foreground">No news available at the moment</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Blog Posts Preview Section */}
      <section className="container py-16 animate-fade-in">
        <div className="flex items-center gap-2 mb-6">
          <FileText className="h-6 w-6 text-primary" />
          <h2 className="text-3xl font-bold text-primary">Latest Blog Posts</h2>
        </div>
        {blogsLoading ? (
          <Card className="border-primary/10">
            <CardContent className="py-8">
              <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="text-center text-muted-foreground">Loading blog posts...</p>
              </div>
            </CardContent>
          </Card>
        ) : latestBlogs && latestBlogs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestBlogs.map((blog, index) => (
                <Card 
                  key={blog.id.toString()} 
                  className="bg-card hover:shadow-lg transition-all hover:-translate-y-1 animate-fade-in border-primary/10"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {blog.blob && (
                    <div className="overflow-hidden rounded-t-lg">
                      <img
                        src={blog.blob.getDirectURL()}
                        alt={blog.title}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-xl text-primary line-clamp-2">
                      {blog.title}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span>{blog.authorName}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      <Calendar className="inline h-3 w-3 mr-1" />
                      {formatDate(blog.publicationDate)}
                    </p>
                    <CardDescription className="text-sm text-foreground line-clamp-3 mt-2">
                      {blog.shortSummary}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild variant="default" size="sm" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                      <Link to="/news">
                        Read More
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="flex justify-center mt-6">
              <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary/10">
                <Link to="/news">View All Blog Posts</Link>
              </Button>
            </div>
          </>
        ) : (
          <Card className="border-primary/10">
            <CardContent className="py-8">
              <p className="text-center text-muted-foreground">No blog posts available at the moment</p>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Magazines Section */}
      <section className="bg-muted/30 py-16 animate-fade-in">
        <div className="container">
          <div className="flex items-center gap-2 mb-6">
            <Library className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-bold text-primary">Featured Magazines</h2>
          </div>
          {magazinesLoading ? (
            <Card className="border-primary/10">
              <CardContent className="py-8">
                <div className="flex flex-col items-center gap-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <p className="text-center text-muted-foreground">Loading magazines...</p>
                </div>
              </CardContent>
            </Card>
          ) : homePageMagazines && homePageMagazines.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {homePageMagazines.slice(0, 3).map((magazine, index) => (
                <Card 
                  key={magazine.id} 
                  className="bg-card hover:shadow-lg transition-all hover:-translate-y-1 animate-fade-in border-primary/10"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader>
                    <div className="mb-4 overflow-hidden rounded-md border border-primary/10">
                      <img
                        src={magazine.imageUrl}
                        alt={magazine.title}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                    <CardTitle className="text-xl text-primary line-clamp-2">
                      {magazine.title}
                    </CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                      {magazine.issue}
                    </CardDescription>
                    <CardDescription className="text-sm text-foreground line-clamp-3 mt-2">
                      {magazine.description}
                    </CardDescription>
                    <p className="text-xs text-muted-foreground mt-2">
                      <Calendar className="inline h-3 w-3 mr-1" />
                      {formatDate(magazine.publishedDate)}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <Button asChild variant="default" size="sm" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                      <Link to="/journals">
                        View Magazine
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-primary/10">
              <CardContent className="py-8">
                <p className="text-center text-muted-foreground">No magazines available at the moment</p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Articles Preview Section */}
      <section className="container py-16 animate-fade-in">
        <div className="flex items-center gap-2 mb-6">
          <BookMarked className="h-6 w-6 text-primary" />
          <h2 className="text-3xl font-bold text-primary">Featured Articles</h2>
        </div>
        {articlePreviewsLoading ? (
          <Card className="border-primary/10">
            <CardContent className="py-8">
              <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="text-center text-muted-foreground">Loading articles...</p>
              </div>
            </CardContent>
          </Card>
        ) : articlePreviews && articlePreviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articlePreviews.slice(0, 3).map((article, index) => (
              <Card 
                key={article.id} 
                className="bg-card hover:shadow-lg transition-all hover:-translate-y-1 animate-fade-in border-primary/10"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <CardTitle className="text-xl text-primary line-clamp-2">
                    {article.title}
                  </CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">
                    By {article.author}
                  </CardDescription>
                  <CardDescription className="text-sm text-foreground line-clamp-3 mt-2">
                    {article.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="default" size="sm" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                    <Link to="/journals">
                      Read More
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-primary/10">
            <CardContent className="py-8">
              <p className="text-center text-muted-foreground">No article previews available at the moment</p>
            </CardContent>
          </Card>
        )}
      </section>

      {/* User Reviews Section */}
      <section className="bg-muted/30 py-16 animate-fade-in">
        <div className="container">
          <div className="flex items-center gap-2 mb-6">
            <Quote className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-bold text-primary">What Our Users Say</h2>
          </div>
          {reviewsLoading ? (
            <Card className="border-primary/10">
              <CardContent className="py-8">
                <div className="flex flex-col items-center gap-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <p className="text-center text-muted-foreground">Loading reviews...</p>
                </div>
              </CardContent>
            </Card>
          ) : userReviews && userReviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {userReviews.slice(0, 4).map((review, index) => (
                <Card key={review.id} className="hover:shadow-lg transition-all hover:-translate-y-1 animate-fade-in border-primary/10" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-3">
                      {review.photoUrl ? (
                        <img
                          src={review.photoUrl}
                          alt={review.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20">
                          <User className="h-6 w-6 text-primary" />
                        </div>
                      )}
                      <div className="flex-1">
                        <CardTitle className="text-base text-primary">{review.name}</CardTitle>
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
            <Card className="border-primary/10">
              <CardContent className="py-8">
                <p className="text-center text-muted-foreground">No reviews available at the moment</p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Why Choose Agrigence Section */}
      <section className="relative container py-16 animate-fade-in overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <img
            src="/assets/generated/agrigence-leaf-pattern.dim_2400x1400.png"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10">
          <h2 className="text-3xl font-bold text-primary mb-8 text-center">Why Choose Agrigence</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-primary/10">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <CardDescription className="text-sm text-foreground leading-relaxed">
                  Expert-curated, practical agricultural content
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-primary/10">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardDescription className="text-sm text-foreground leading-relaxed">
                  Strong readership of farmers, students, agri-startups, and institutions
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-primary/10">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Lightbulb className="h-6 w-6 text-primary" />
                </div>
                <CardDescription className="text-sm text-foreground leading-relaxed">
                  Coverage of new varieties, technologies, government schemes, and innovations
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-primary/10">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <CardDescription className="text-sm text-foreground leading-relaxed">
                  Regional relevance for North Indian agriculture
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-primary/10">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <MessageCircle className="h-6 w-6 text-primary" />
                </div>
                <CardDescription className="text-sm text-foreground leading-relaxed">
                  Multi-format presence: magazine, social media, seminars, and field events
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-primary/10">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <GraduationCap className="h-6 w-6 text-primary" />
                </div>
                <CardDescription className="text-sm text-foreground leading-relaxed">
                  Platform for students, researchers, and professionals to publish
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-primary/10">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Sprout className="h-6 w-6 text-primary" />
                </div>
                <CardDescription className="text-sm text-foreground leading-relaxed">
                  Focus on sustainable and climate-smart farming
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-primary/10">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Leaf className="h-6 w-6 text-primary" />
                </div>
                <CardDescription className="text-sm text-foreground leading-relaxed">
                  Trusted, unbiased, easy-to-understand agricultural knowledge
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="relative bg-muted/30 py-16 animate-fade-in overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <img
            src="/assets/generated/agrigence-field-texture.dim_2400x1400.png"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container relative z-10">
          <h2 className="text-3xl font-bold text-primary mb-8 text-center">What We Do</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-primary/10">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <CardDescription className="text-sm text-foreground leading-relaxed">
                  Publish a dedicated agriculture magazine with field-relevant insights
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-primary/10">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <CardDescription className="text-sm text-foreground leading-relaxed">
                  Highlight agri innovations, new crop varieties, technologies, and government schemes
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-primary/10">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <CardDescription className="text-sm text-foreground leading-relaxed">
                  Document success stories of progressive farmers and agri-startups
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-primary/10">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardDescription className="text-sm text-foreground leading-relaxed">
                  Conduct conferences on modern agriculture and emerging trends
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-primary/10">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <GraduationCap className="h-6 w-6 text-primary" />
                </div>
                <CardDescription className="text-sm text-foreground leading-relaxed">
                  Organize training programs for farmers, students, and agri-entrepreneurs
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-primary/10">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Microscope className="h-6 w-6 text-primary" />
                </div>
                <CardDescription className="text-sm text-foreground leading-relaxed">
                  Host practical workshops on farming techniques and agri technologies
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-primary/10">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <MessageCircle className="h-6 w-6 text-primary" />
                </div>
                <CardDescription className="text-sm text-foreground leading-relaxed">
                  Deliver seminars in universities, colleges, villages, and cities
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-primary/10">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Handshake className="h-6 w-6 text-primary" />
                </div>
                <CardDescription className="text-sm text-foreground leading-relaxed">
                  Collaborate with agri companies, institutions, and startups for knowledge outreach
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-primary/10">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Sprout className="h-6 w-6 text-primary" />
                </div>
                <CardDescription className="text-sm text-foreground leading-relaxed">
                  Promote scientific, sustainable, and climate-smart farming practices
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-primary/10">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Lightbulb className="h-6 w-6 text-primary" />
                </div>
                <CardDescription className="text-sm text-foreground leading-relaxed">
                  Provide a publishing platform for experts, researchers, and students
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Objective Section */}
      <section className="relative w-full py-20 animate-fade-in overflow-hidden">
        <div className="absolute inset-0 opacity-[0.08] pointer-events-none">
          <img
            src="/assets/generated/agrigence-field-texture.dim_2400x1400.png"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container relative z-10 px-4 md:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-10 text-center">
            Main Objective
          </h2>
          <div className="max-w-4xl mx-auto space-y-6">
            <p className="text-base md:text-lg leading-relaxed text-foreground">
              The primary objective of Agrigence is to establish a credible, high-impact agriculture magazine and knowledge platform that seamlessly connects agricultural research, innovation, and practical field application.
            </p>
            <p className="text-base md:text-lg leading-relaxed text-foreground">
              Agrigence is committed to publishing practical, field-relevant agricultural content and delivering structured trainings, workshops, conferences, and seminars that translate knowledge into measurable outcomes for farmers, students, agri-entrepreneurs, and institutions.
            </p>
            <p className="text-base md:text-lg leading-relaxed text-foreground">
              Through expert contributions, real success stories, and regionally relevant insights, Agrigence promotes modern, sustainable, and climate-smart farming practices tailored to Indian agriculture—especially the needs of North Indian farming systems.
            </p>
            <p className="text-base md:text-lg leading-relaxed text-foreground font-medium">
              Agrigence exists to connect knowledge with the field and transform learning into agricultural progress.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
