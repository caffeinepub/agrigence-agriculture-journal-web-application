import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BookOpen, ShoppingBag, AlertCircle } from 'lucide-react';
import { useGetProductsByCategory } from '../hooks/useQueries';
import { ProductCategory } from '../backend';
import ProductCard from '../components/ProductCard';

export default function ProductsPage() {
  const { data: books, isLoading: booksLoading, isError: booksError } = useGetProductsByCategory(ProductCategory.books);
  const { data: agProducts, isLoading: agLoading, isError: agError } = useGetProductsByCategory(ProductCategory.agriculturalStore);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-accent/10 py-16 animate-fade-in">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">Products</h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Explore our curated collection of agricultural books and essential farming supplies
          </p>
        </div>
      </section>

      {/* Books Section */}
      <section className="container py-16 animate-fade-in">
        <div className="flex items-center gap-2 mb-6">
          <BookOpen className="h-6 w-6 text-accent" />
          <h2 className="text-3xl font-bold text-primary">Books</h2>
        </div>

        {booksError ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Failed to load books. Please try again later.</AlertDescription>
          </Alert>
        ) : booksLoading ? (
          <Card className="border-primary/10">
            <CardContent className="py-8">
              <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="text-center text-muted-foreground">Loading books...</p>
              </div>
            </CardContent>
          </Card>
        ) : books && books.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <Card className="border-primary/10">
            <CardContent className="py-8">
              <p className="text-center text-muted-foreground">No books available at the moment.</p>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Agricultural Store Section */}
      <section className="bg-muted/30 py-16 animate-fade-in">
        <div className="container">
          <div className="flex items-center gap-2 mb-6">
            <ShoppingBag className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-bold text-primary">Agricultural Store</h2>
          </div>

          {agError ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Failed to load agricultural products. Please try again later.</AlertDescription>
            </Alert>
          ) : agLoading ? (
            <Card className="border-primary/10">
              <CardContent className="py-8">
                <div className="flex flex-col items-center gap-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <p className="text-center text-muted-foreground">Loading products...</p>
                </div>
              </CardContent>
            </Card>
          ) : agProducts && agProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <Card className="border-primary/10">
              <CardContent className="py-8">
                <p className="text-center text-muted-foreground">No agricultural products available at the moment.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}
