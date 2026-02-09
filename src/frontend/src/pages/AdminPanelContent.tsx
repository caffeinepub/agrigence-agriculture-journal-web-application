import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
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
  useListAllProducts,
  useAddProduct,
  useUpdateProduct,
  useRemoveProduct,
} from '../hooks/useQueries';
import { Product, ProductCategory, ProductInput } from '../backend';
import { toast } from 'sonner';
import {
  AlertCircle,
  Plus,
  Trash2,
  Edit,
  ShoppingBag,
} from 'lucide-react';

export default function AdminPanelContent() {
  const { data: allProducts, isError: productsError } = useListAllProducts();

  const [productName, setProductName] = useState('');
  const [productCategory, setProductCategory] = useState<ProductCategory>(ProductCategory.books);
  const [productBuyLink, setProductBuyLink] = useState('');

  const [productEditDialogOpen, setProductEditDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productDeleteDialogOpen, setProductDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const addProduct = useAddProduct();
  const updateProduct = useUpdateProduct();
  const removeProduct = useRemoveProduct();

  const getCategoryLabel = (category: ProductCategory) => {
    switch (category) {
      case ProductCategory.books:
        return 'Books';
      case ProductCategory.agriculturalStore:
        return 'Agricultural Store';
      default:
        return 'Unknown';
    }
  };

  // Show error state if any admin data fails to load
  if (productsError) {
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

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName || !productBuyLink) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const productId = `${productCategory}-${Date.now()}`;
      const input: ProductInput = {
        id: productId,
        name: productName,
        buyLink: productBuyLink,
        category: productCategory,
      };
      await addProduct.mutateAsync(input);
      toast.success('Product added successfully');
      setProductName('');
      setProductBuyLink('');
      setProductCategory(ProductCategory.books);
    } catch (error) {
      toast.error('Failed to add product');
      console.error(error);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductName(product.name);
    setProductBuyLink(product.buyLink);
    setProductCategory(product.category);
    setProductEditDialogOpen(true);
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct) return;

    try {
      const updatedInput: ProductInput = {
        id: editingProduct.id,
        name: productName,
        buyLink: productBuyLink,
        category: productCategory,
      };
      await updateProduct.mutateAsync({ id: editingProduct.id, updatedInput });
      toast.success('Product updated successfully');
      setProductEditDialogOpen(false);
      setEditingProduct(null);
      setProductName('');
      setProductBuyLink('');
      setProductCategory(ProductCategory.books);
    } catch (error) {
      toast.error('Failed to update product');
      console.error(error);
    }
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;

    try {
      await removeProduct.mutateAsync(productToDelete.id);
      toast.success('Product deleted successfully');
      setProductDeleteDialogOpen(false);
      setProductToDelete(null);
    } catch (error) {
      toast.error('Failed to delete product');
      console.error(error);
    }
  };

  const openProductDeleteDialog = (product: Product) => {
    setProductToDelete(product);
    setProductDeleteDialogOpen(true);
  };

  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold mb-8 text-primary">Admin Panel</h1>

      <Tabs defaultValue="products" className="space-y-6">
        <TabsList>
          <TabsTrigger value="products">
            <ShoppingBag className="h-4 w-4 mr-2" />
            Products
          </TabsTrigger>
        </TabsList>

        {/* Products Tab */}
        <TabsContent value="products" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add New Product
              </CardTitle>
              <CardDescription>Add books or agricultural store products</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddProduct} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="productName">Product Name *</Label>
                    <Input
                      id="productName"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      placeholder="Enter product name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="productCategory">Category *</Label>
                    <Select
                      value={productCategory}
                      onValueChange={(value) => setProductCategory(value as ProductCategory)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={ProductCategory.books}>Books</SelectItem>
                        <SelectItem value={ProductCategory.agriculturalStore}>Agricultural Store</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="productBuyLink">Buy Link *</Label>
                  <Input
                    id="productBuyLink"
                    type="url"
                    value={productBuyLink}
                    onChange={(e) => setProductBuyLink(e.target.value)}
                    placeholder="https://example.com/product"
                    required
                  />
                </div>
                <Button type="submit" disabled={addProduct.isPending}>
                  {addProduct.isPending ? 'Adding...' : 'Add Product'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>All Products</CardTitle>
              <CardDescription>Manage existing products</CardDescription>
            </CardHeader>
            <CardContent>
              {!allProducts || allProducts.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No products found</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Buy Link</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{getCategoryLabel(product.category)}</Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          <a
                            href={product.buyLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            {product.buyLink}
                          </a>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditProduct(product)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => openProductDeleteDialog(product)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Product Dialog */}
      <Dialog open={productEditDialogOpen} onOpenChange={setProductEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="editProductName">Product Name *</Label>
              <Input
                id="editProductName"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Enter product name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editProductCategory">Category *</Label>
              <Select
                value={productCategory}
                onValueChange={(value) => setProductCategory(value as ProductCategory)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ProductCategory.books}>Books</SelectItem>
                  <SelectItem value={ProductCategory.agriculturalStore}>Agricultural Store</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="editProductBuyLink">Buy Link *</Label>
              <Input
                id="editProductBuyLink"
                type="url"
                value={productBuyLink}
                onChange={(e) => setProductBuyLink(e.target.value)}
                placeholder="https://example.com/product"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setProductEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateProduct} disabled={updateProduct.isPending}>
              {updateProduct.isPending ? 'Updating...' : 'Update Product'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Product Confirmation */}
      <AlertDialog open={productDeleteDialogOpen} onOpenChange={setProductDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{productToDelete?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProduct} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
