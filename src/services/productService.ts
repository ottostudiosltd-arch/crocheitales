import { supabase, minorToMajor, majorToMinor } from '../lib/supabase';
import type { Product } from '../components/shop/ProductCard';
import { asset } from '../utils/asset';

export interface CreateProductInput {
  title: string;
  slug: string;
  sku?: string;
  price: number;
  compareAtPrice?: number;
  stockQuantity: number;
  categoryId?: string;
  tag?: 'Bestseller' | 'Sale' | 'New';
  isFeatured?: boolean;
  isActive?: boolean;
  shortDescription?: string;
  description?: string;
  imageUrl?: string;
}

export interface FetchProductsOptions {
  categorySlug?: string;
  isFeatured?: boolean;
  limit?: number;
  tag?: string;
}

/**
 * Maps database product row to frontend Product interface
 */
export function mapDatabaseProduct(row: any): Product {
  const rawImg = row.product_images?.find((img: any) => img.is_primary)?.image_url
    || row.product_images?.[0]?.image_url
    || '/images/products/daisy-keychain.webp';

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    price: minorToMajor(row.price_minor),
    originalPrice: row.compare_at_price_minor ? minorToMajor(row.compare_at_price_minor) : undefined,
    rating: row.rating ? Number(row.rating) : 5.0,
    reviewCount: row.review_count || 0,
    imageUrl: asset(rawImg),
    category: row.categories?.name,
    tag: row.tag as 'Bestseller' | 'Sale' | 'New' | undefined,
    inStock: (row.stock_quantity ?? 0) > 0,
  };
}

/**
 * Fetch products from Supabase with optional filters
 */
export async function fetchProducts(options: FetchProductsOptions = {}): Promise<Product[]> {
  try {
    let query = supabase
      .from('products')
      .select(`
        id,
        title,
        slug,
        sku,
        price_minor,
        compare_at_price_minor,
        stock_quantity,
        is_featured,
        is_active,
        tag,
        short_description,
        rating,
        review_count,
        categories (
          id,
          name,
          slug
        ),
        product_images (
          image_url,
          alt_text,
          is_primary,
          sort_order
        )
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (options.isFeatured) {
      query = query.eq('is_featured', true);
    }

    if (options.tag) {
      query = query.eq('tag', options.tag);
    }

    if (options.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;

    if (error) {
      console.warn('Supabase products query failed, using empty array or fallback:', error.message);
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    let products = data.map(mapDatabaseProduct);

    if (options.categorySlug) {
      products = products.filter(
        (p) => p.category?.toLowerCase() === options.categorySlug?.toLowerCase()
      );
    }

    return products;
  } catch (err) {
    console.error('Error fetching products:', err);
    return [];
  }
}

/**
 * Fetch a single product by its slug
 */
export async function fetchProductBySlug(slug: string): Promise<any> {
  try {
    const targetSlug = slug === 'tulip-crochet-bouquet' ? 'tulip-bouquet' : slug;

    const initialQuery = await supabase
      .from('products')
      .select(`
        *,
        categories (
          id,
          name,
          slug
        ),
        product_images (
          id,
          image_url,
          alt_text,
          sort_order,
          is_primary
        )
      `)
      .or(`slug.eq.${slug},slug.eq.${targetSlug}`)
      .eq('is_active', true)
      .maybeSingle();

    let data: any = initialQuery.data;

    if (!data) {
      // Fallback matching first segment of slug
      const prefix = slug.split('-')[0];
      const fallbackQuery: any = await supabase
        .from('products')
        .select(`
          *,
          categories (
            id,
            name,
            slug
          ),
          product_images (
            id,
            image_url,
            alt_text,
            sort_order,
            is_primary
          )
        `)
        .ilike('slug', `%${prefix}%`)
        .eq('is_active', true)
        .limit(1)
        .maybeSingle();

      data = fallbackQuery.data;
    }

    if (!data) {
      return null;
    }

    // Map all product image URLs through asset()
    if (data.product_images && Array.isArray(data.product_images)) {
      data.product_images = data.product_images.map((img: any) => ({
        ...img,
        image_url: asset(img.image_url),
      }));
    }

    return data;
  } catch (err) {
    console.error('Error fetching product by slug:', err);
    return null;
  }
}

/**
 * Fetch all active categories
 */
export async function fetchCategories() {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) {
      console.warn('Error fetching categories:', error.message);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Error in fetchCategories:', err);
    return [];
  }
}

/**
 * Fetch all products (including active & inactive) for the admin portal
 */
export async function fetchAllAdminProducts() {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories (
          id,
          name,
          slug
        ),
        product_images (
          id,
          image_url,
          alt_text,
          sort_order,
          is_primary
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching admin products:', error);
      return [];
    }

    return (data || []).map((row: any) => {
      const primaryImg = row.product_images?.find((img: any) => img.is_primary)?.image_url
        || row.product_images?.[0]?.image_url
        || '/images/products/daisy-keychain.webp';

      return {
        ...row,
        displayPrice: minorToMajor(row.price_minor),
        displayCompareAtPrice: row.compare_at_price_minor ? minorToMajor(row.compare_at_price_minor) : null,
        imageUrl: asset(primaryImg),
        categoryName: row.categories?.name || 'Uncategorized',
      };
    });
  } catch (err) {
    console.error('Error in fetchAllAdminProducts:', err);
    return [];
  }
}

/**
 * Create a new product in Supabase and optionally associate image
 */
export async function createProduct(input: CreateProductInput): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    // Generate slug from title if not clean
    const cleanSlug = (input.slug || input.title)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const { data: product, error: productError } = await (supabase.from('products') as any)
      .insert({
        title: input.title,
        slug: cleanSlug,
        sku: input.sku || `CT-${Math.floor(1000 + Math.random() * 9000)}`,
        price_minor: majorToMinor(input.price),
        compare_at_price_minor: input.compareAtPrice ? majorToMinor(input.compareAtPrice) : null,
        stock_quantity: input.stockQuantity,
        category_id: input.categoryId || null,
        is_featured: input.isFeatured ?? false,
        is_active: input.isActive ?? true,
        tag: input.tag || null,
        short_description: input.shortDescription || null,
        description: input.description || null,
      })
      .select('id, title, slug')
      .single();

    if (productError || !product) {
      console.error('Failed to insert product:', productError);
      return { success: false, error: productError?.message || 'Failed to create product' };
    }

    // Insert image if supplied
    if (input.imageUrl) {
      const { error: imgError } = await (supabase.from('product_images') as any).insert({
        product_id: product.id,
        image_url: input.imageUrl,
        alt_text: input.title,
        sort_order: 0,
        is_primary: true,
      });

      if (imgError) {
        console.warn('Image insertion warning:', imgError);
      }
    }

    return { success: true, data: product };
  } catch (err: any) {
    console.error('Error in createProduct:', err);
    return { success: false, error: err?.message || 'Unexpected error creating product' };
  }
}

/**
 * Quick toggle or update of product fields (e.g. stock, active status)
 */
export async function updateProduct(
  id: string,
  updates: Partial<{
    title: string;
    price: number;
    compareAtPrice: number;
    stock_quantity: number;
    is_active: boolean;
    is_featured: boolean;
    tag: string | null;
  }>
): Promise<{ success: boolean; error?: string }> {
  try {
    const payload: any = { updated_at: new Date().toISOString() };
    if (updates.title !== undefined) payload.title = updates.title;
    if (updates.stock_quantity !== undefined) payload.stock_quantity = updates.stock_quantity;
    if (updates.is_active !== undefined) payload.is_active = updates.is_active;
    if (updates.is_featured !== undefined) payload.is_featured = updates.is_featured;
    if (updates.tag !== undefined) payload.tag = updates.tag;
    if (updates.price !== undefined) payload.price_minor = majorToMinor(updates.price);
    if (updates.compareAtPrice !== undefined) {
      payload.compare_at_price_minor = updates.compareAtPrice ? majorToMinor(updates.compareAtPrice) : null;
    }

    const { error } = await (supabase.from('products') as any)
      .update(payload)
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to update product' };
  }
}

/**
 * Delete a product from Supabase
 */
export async function deleteProduct(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await (supabase.from('products') as any)
      .delete()
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to delete product' };
  }
}
