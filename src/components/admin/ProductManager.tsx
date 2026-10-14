import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Sparkles,
  Package,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  UploadCloud,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import {
  fetchAllAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  fetchCategories,
  type CreateProductInput,
} from '../../services/productService';
import { compressImageToWebP, type CompressionResult } from '../../utils/imageOptimizer';
import { uploadOptimizedProductImage } from '../../services/storageService';

export const ProductManager: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  // New Product Form State
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState<number>(299);
  const [compareAtPrice, setCompareAtPrice] = useState<number | undefined>(499);
  const [stockQuantity, setStockQuantity] = useState<number>(10);
  const [tag, setTag] = useState<'Bestseller' | 'Sale' | 'New' | ''>('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');

  // Image upload within form
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [compressionResult, setCompressionResult] = useState<CompressionResult | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);

  const loadCatalog = async () => {
    setLoading(true);
    try {
      const [prods, cats]: [any[], any[]] = await Promise.all([
        fetchAllAdminProducts(),
        fetchCategories(),
      ]);
      setProducts(prods);
      setCategories(cats);
      if (cats && cats.length > 0 && !categoryId) {
        setCategoryId(cats[0]?.id || '');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCatalog();
  }, []);

  const handleImagePick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedImageFile(file);
    setIsCompressing(true);
    setFormError(null);

    try {
      const result = await compressImageToWebP(file, {
        maxWidth: 1000,
        maxHeight: 1000,
        quality: 0.8,
        targetMaxKb: 85,
      });
      setCompressionResult(result);
    } catch (err: any) {
      setFormError('Failed to optimize image: ' + err.message);
    } finally {
      setIsCompressing(false);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    if (!title.trim()) {
      setFormError('Product title is required');
      return;
    }
    if (price <= 0) {
      setFormError('Price must be greater than ₹0');
      return;
    }

    setIsSubmitting(true);

    try {
      let finalImageUrl: string | undefined = undefined;

      // 1. Upload compressed image if selected
      if (selectedImageFile) {
        const uploadRes = await uploadOptimizedProductImage(selectedImageFile, {
          folder: 'catalog',
          altText: title,
        });

        if (!uploadRes.success) {
          throw new Error(uploadRes.error || 'Failed to upload image to Supabase');
        }
        finalImageUrl = uploadRes.publicUrl;
      }

      // 2. Create Product in Supabase
      const payload: CreateProductInput = {
        title: title.trim(),
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        price,
        compareAtPrice: compareAtPrice || undefined,
        stockQuantity,
        categoryId: categoryId || undefined,
        tag: tag || undefined,
        isFeatured,
        isActive: true,
        shortDescription: shortDescription || undefined,
        description: description || undefined,
        imageUrl: finalImageUrl,
      };

      const res = await createProduct(payload);

      if (!res.success) {
        throw new Error(res.error || 'Failed to save product in database');
      }

      setFormSuccess('🎉 Product created successfully and added to live catalog!');
      setTimeout(() => {
        setIsModalOpen(false);
        resetForm();
        loadCatalog();
      }, 1500);
    } catch (err: any) {
      setFormError(err.message || 'Error creating product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setPrice(299);
    setCompareAtPrice(499);
    setStockQuantity(10);
    setTag('');
    setIsFeatured(false);
    setShortDescription('');
    setDescription('');
    setSelectedImageFile(null);
    setCompressionResult(null);
    setFormError(null);
    setFormSuccess(null);
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    const res = await updateProduct(id, { is_active: !currentStatus });
    if (res.success) {
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, is_active: !currentStatus } : p))
      );
    }
  };

  const handleDelete = async (id: string, productTitle: string) => {
    if (window.confirm(`Are you sure you want to delete "${productTitle}"?`)) {
      const res = await deleteProduct(id);
      if (res.success) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      }
    }
  };

  const handleStockChange = async (id: string, newStock: number) => {
    const res = await updateProduct(id, { stock_quantity: newStock });
    if (res.success) {
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, stock_quantity: newStock } : p))
      );
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.categoryName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-3xl border border-brand-border/70 p-6 sm:p-8 shadow-soft space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-brand-border/60">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-softPink text-brand-burgundy">
              Catalog Management
            </span>
            <span className="text-xs text-brand-text-muted">
              {products.length} Products in Supabase
            </span>
          </div>
          <h2 className="font-serif text-xl font-bold text-brand-burgundy mt-1">
            Product Catalog & Inventory
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-brand-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs rounded-full border border-brand-border bg-brand-cream/30 focus:bg-white focus:outline-none focus:border-brand-burgundy w-44 sm:w-56"
            />
          </div>

          <Button
            size="sm"
            variant="primary"
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            rightIcon={<Plus className="w-4 h-4" />}
          >
            Add Product
          </Button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="py-12 text-center text-xs text-brand-text-muted">
          <div className="w-8 h-8 border-2 border-brand-burgundy border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          Loading products from Supabase...
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="py-12 text-center text-xs text-brand-text-muted space-y-2">
          <Package className="w-8 h-8 mx-auto text-brand-text-muted/60 stroke-[1.5]" />
          <p>No products found matching your search.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-brand-cream/50 border-b border-brand-border text-xs uppercase text-brand-text-muted">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock Units</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/50">
              {filteredProducts.map((p) => {
                const isLowStock = (p.stock_quantity ?? 0) < 5;
                return (
                  <tr key={p.id} className="hover:bg-brand-cream/20 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.imageUrl}
                          alt={p.title}
                          className="w-11 h-11 rounded-xl object-cover border border-brand-border/60 bg-white"
                        />
                        <div>
                          <p className="font-bold text-xs text-brand-burgundy">{p.title}</p>
                          <p className="text-[10px] text-brand-text-muted font-mono">{p.slug}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3.5 text-xs text-brand-text-muted">
                      {p.categoryName}
                    </td>

                    <td className="px-4 py-3.5 font-semibold text-xs">
                      ₹{p.displayPrice}
                      {p.displayCompareAtPrice && (
                        <span className="text-[10px] text-brand-text-muted line-through ml-1.5 font-normal">
                          ₹{p.displayCompareAtPrice}
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="0"
                          value={p.stock_quantity ?? 0}
                          onChange={(e) =>
                            handleStockChange(p.id, parseInt(e.target.value) || 0)
                          }
                          className="w-16 px-2 py-1 text-xs rounded-lg border border-brand-border text-center font-bold focus:outline-none focus:border-brand-burgundy"
                        />
                        {isLowStock && (
                          <span className="text-[10px] font-semibold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded-full">
                            Low Stock
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <button
                        onClick={() => handleToggleActive(p.id, p.is_active)}
                        className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full transition-colors ${
                          p.is_active
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                        }`}
                      >
                        {p.is_active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        <span>{p.is_active ? 'Active' : 'Hidden'}</span>
                      </button>
                    </td>

                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={() => handleDelete(p.id, p.title)}
                        className="p-1.5 text-brand-text-muted hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-2xl rounded-3xl border border-brand-border p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full bg-brand-cream text-brand-text-muted hover:text-brand-burgundy transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-softPink text-brand-burgundy">
                New Creation
              </span>
              <h2 className="font-serif text-2xl font-bold text-brand-burgundy mt-1">
                Add Product to Boutique
              </h2>
              <p className="text-xs text-brand-text-muted">
                Images are automatically converted to tiny WebP (~60KB) to keep your Supabase Storage 100% free!
              </p>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {formSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{formSuccess}</span>
              </div>
            )}

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-brand-burgundy mb-1">
                  Product Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Crochet Lavender Keychain"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border focus:outline-none focus:border-brand-burgundy"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-brand-burgundy mb-1">
                    Category *
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border focus:outline-none focus:border-brand-burgundy bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-brand-burgundy mb-1">
                    Badge Tag (Optional)
                  </label>
                  <select
                    value={tag}
                    onChange={(e) => setTag(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border focus:outline-none focus:border-brand-burgundy bg-white"
                  >
                    <option value="">No Badge</option>
                    <option value="Bestseller">Bestseller</option>
                    <option value="Sale">Sale</option>
                    <option value="New">New</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-brand-burgundy mb-1">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={price}
                    onChange={(e) => setPrice(parseInt(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border focus:outline-none focus:border-brand-burgundy font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-brand-burgundy mb-1">
                    Original / Cut Price (₹)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={compareAtPrice || ''}
                    placeholder="e.g. 499"
                    onChange={(e) => setCompareAtPrice(e.target.value ? parseInt(e.target.value) : undefined)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border focus:outline-none focus:border-brand-burgundy"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-brand-burgundy mb-1">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(parseInt(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border focus:outline-none focus:border-brand-burgundy font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-brand-burgundy mb-1">
                  Short Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Handcrafted floral charm with premium milk cotton yarn."
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border focus:outline-none focus:border-brand-burgundy"
                />
              </div>

              {/* Photo Upload with Live WebP Optimization */}
              <div className="p-4 rounded-2xl border-2 border-dashed border-brand-border bg-brand-cream/20 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-brand-burgundy flex items-center gap-1.5">
                    <UploadCloud className="w-4 h-4 text-brand-burgundy" />
                    Product Photo (Auto-compressed to WebP)
                  </span>
                  {compressionResult && (
                    <Badge variant="bestseller" className="text-[10px]">
                      Saved {compressionResult.savingsPercent}% Space!
                    </Badge>
                  )}
                </div>

                <input
                  type="file"
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  onChange={handleImagePick}
                  className="w-full text-xs text-brand-text-muted file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-brand-burgundy file:text-white hover:file:bg-brand-burgundy-dark cursor-pointer"
                />

                {isCompressing && (
                  <p className="text-[11px] text-brand-text-muted animate-pulse">
                    Compressing image to WebP...
                  </p>
                )}

                {compressionResult && (
                  <div className="flex items-center gap-3 pt-2">
                    <img
                      src={compressionResult.previewUrl}
                      alt="Preview"
                      className="w-12 h-12 rounded-lg object-cover border border-brand-border"
                    />
                    <div className="text-[11px] text-brand-text-muted">
                      <p className="font-semibold text-brand-text-primary">
                        Raw: {compressionResult.originalSizeKb} KB ➔ Optimized:{' '}
                        <span className="text-emerald-700 font-bold">
                          {compressionResult.compressedSizeKb} KB WebP
                        </span>
                      </p>
                      <p className="text-[10px]">Ready to upload to Supabase Storage</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="rounded text-brand-burgundy focus:ring-brand-burgundy"
                />
                <label htmlFor="featured" className="font-medium text-brand-text-primary">
                  Feature this product on homepage
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={isSubmitting}
                  rightIcon={<Sparkles className="w-3.5 h-3.5" />}
                >
                  {isSubmitting ? 'Optimizing & Saving...' : 'Save Product to Supabase'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
