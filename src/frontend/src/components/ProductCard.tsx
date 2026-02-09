import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';
import { Product, ProductCategory } from '../backend';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const getCategoryLabel = (category: ProductCategory) => {
    switch (category) {
      case ProductCategory.books:
        return 'Book';
      case ProductCategory.agriculturalStore:
        return 'Agricultural Store';
      default:
        return 'Product';
    }
  };

  const getCategoryColor = (category: ProductCategory) => {
    switch (category) {
      case ProductCategory.books:
        return 'bg-accent/20 text-accent border-accent/30';
      case ProductCategory.agriculturalStore:
        return 'bg-primary/20 text-primary border-primary/30';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const handleBuyClick = () => {
    if (product.buyLink) {
      window.open(product.buyLink, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Card className="hover:shadow-md transition-all hover:-translate-y-1 border-primary/10">
      <CardHeader>
        <div className="flex items-start justify-between gap-2 mb-2">
          <CardTitle className="text-lg text-primary">{product.name}</CardTitle>
          <Badge variant="outline" className={`shrink-0 ${getCategoryColor(product.category)}`}>
            {getCategoryLabel(product.category)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={handleBuyClick}
          className="w-full bg-primary hover:bg-primary/90"
          disabled={!product.buyLink}
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          Buy Now
        </Button>
      </CardContent>
    </Card>
  );
}
