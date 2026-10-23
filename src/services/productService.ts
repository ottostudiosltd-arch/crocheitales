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

// Memory Cache to protect Supabase from repeated query spam
interface CacheEntry {
  data: Product[];
  timestamp: number;
}
const productsCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 120000; // 2 minutes TTL

import { PRODUCTS, CATEGORIES } from '../data/catalog';

// Helper to filter static catalog products (exported for instant 0ms initial render)
export function filterCatalogProducts(options: FetchProductsOptions): Product[] {
  let list = [...PRODUCTS];

  if (options.categorySlug) {
    const slugLower = options.categorySlug.toLowerCase();
    list = list.filter(
      (p) =>
        p.categorySlug?.toLowerCase() === slugLower ||
        p.category?.toLowerCase() === slugLower ||
        (slugLower === 'winter-wear' && p.category?.toLowerCase().includes('winter'))
    );
  }

  if (options.tag) {
    list = list.filter((p) => p.tag?.toLowerCase() === options.tag?.toLowerCase());
  }

  if (options.limit && options.limit > 0) {
    list = list.slice(0, options.limit);
  }

  return list;
}

// Fast timeout helper to protect mobile users from slow or cold-start network calls
function withTimeout<T = any>(promise: PromiseLike<T>, ms = 1500): Promise<T> {
  return Promise.race([
    Promise.resolve(promise),
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Network query timed out')), ms)
    ),
  ]);
}

/**
 * Fetch products from Supabase with optional filters & memory cache (falls back to authentic catalog)
 */
export async function fetchProducts(options: FetchProductsOptions = {}): Promise<Product[]> {
  try {
    const cacheKey = JSON.stringify(options);
    const cached = productsCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return cached.data;
    }

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

    const result: any = await withTimeout(query, 1500).catch((err) => {
      return { data: null, error: err };
    });

    const data = result?.data;
    const error = result?.error;

    if (error || !data || data.length === 0) {
      const fallback = filterCatalogProducts(options);
      productsCache.set(cacheKey, { data: fallback, timestamp: Date.now() });
      return fallback;
    }

    let products = data.map(mapDatabaseProduct);

    if (options.categorySlug) {
      const slugLower = options.categorySlug.toLowerCase();
      products = products.filter(
        (p: Product) => p.category?.toLowerCase() === slugLower
      );
    }

    if (products.length === 0) {
      const fallback = filterCatalogProducts(options);
      productsCache.set(cacheKey, { data: fallback, timestamp: Date.now() });
      return fallback;
    }

    // Cache results for 2 minutes to protect free tier
    productsCache.set(cacheKey, { data: products, timestamp: Date.now() });
    return products;
  } catch (err) {
    console.error('Error fetching products:', err);
    return filterCatalogProducts(options);
  }
}

/**
 * Fetch a single product by its slug (with fallback to authentic catalog)
 */
export async function fetchProductBySlug(slug: string): Promise<any> {
  try {
    const targetSlug = slug === 'tulip-crochet-bouquet' ? 'tulip-bouquet' : slug;

    const initialQuery = await withTimeout(
      supabase
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
        .maybeSingle(),
      1500
    ).catch(() => ({ data: null }));

    let data: any = initialQuery?.data;

    if (!data) {
      // Fallback matching first segment of slug
      const prefix = slug.split('-')[0];
      const fallbackQuery: any = await withTimeout(
        supabase
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
          .maybeSingle(),
        1000
      ).catch(() => ({ data: null }));

      data = fallbackQuery?.data;
    }

    if (data) {
      // Map all product image URLs through asset()
      if (data.product_images && Array.isArray(data.product_images)) {
        data.product_images = data.product_images.map((img: any) => ({
          ...img,
          image_url: asset(img.image_url),
        }));
      }
      return data;
    }

    // Fallback to local catalog
    const localMatch = PRODUCTS.find(
      (p) => p.slug === slug || p.slug === targetSlug || p.slug.includes(slug) || slug.includes(p.slug)
    );

    if (localMatch) {
      return {
        id: localMatch.id,
        slug: localMatch.slug,
        title: localMatch.title,
        price_minor: majorToMinor(localMatch.price),
        compare_at_price_minor: localMatch.originalPrice ? majorToMinor(localMatch.originalPrice) : null,
        rating: localMatch.rating,
        review_count: localMatch.reviewCount,
        stock_quantity: 15,
        is_active: true,
        short_description: localMatch.shortDescription,
        description: localMatch.description,
        materials: localMatch.materials,
        care: localMatch.care,
        categories: {
          name: localMatch.category,
          slug: localMatch.categorySlug,
        },
        product_images: (localMatch.images || [localMatch.imageUrl]).map((url, idx) => ({
          id: `img-${localMatch.id}-${idx}`,
          image_url: url,
          alt_text: localMatch.title,
          is_primary: idx === 0,
          sort_order: idx,
        })),
      };
    }

    return null;
  } catch (err) {
    console.error('Error fetching product by slug:', err);
    const localMatch = PRODUCTS.find((p) => p.slug === slug || slug.includes(p.slug));
    if (localMatch) {
      return {
        id: localMatch.id,
        slug: localMatch.slug,
        title: localMatch.title,
        price_minor: majorToMinor(localMatch.price),
        compare_at_price_minor: localMatch.originalPrice ? majorToMinor(localMatch.originalPrice) : null,
        rating: localMatch.rating,
        review_count: localMatch.reviewCount,
        stock_quantity: 15,
        short_description: localMatch.shortDescription,
        description: localMatch.description,
        materials: localMatch.materials,
        care: localMatch.care,
        categories: { name: localMatch.category, slug: localMatch.categorySlug },
        product_images: [{ id: '1', image_url: localMatch.imageUrl, is_primary: true, sort_order: 0 }],
      };
    }
    return null;
  }
}

/**
 * Fetch all active categories (with fallback to authentic catalog)
 */
export async function fetchCategories() {
  try {
    const result: any = await withTimeout(
      supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true }),
      1500
    ).catch((err) => ({ data: null, error: err }));

    const data = result?.data;
    const error = result?.error;

    if (!error && data && data.length > 0) {
      return data;
    }

    // Fallback to local catalog
    return CATEGORIES.map((c, i) => ({
      id: c.id,
      name: c.title,
      slug: c.slug,
      description: c.description,
      image_url: c.image,
      sort_order: i,
      is_active: true,
    }));
  } catch (err) {
    console.error('Error in fetchCategories:', err);
    return CATEGORIES.map((c, i) => ({
      id: c.id,
      name: c.title,
      slug: c.slug,
      description: c.description,
      image_url: c.image,
      sort_order: i,
      is_active: true,
    }));
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

    if (error || !data || data.length === 0) {
      return PRODUCTS.map((p) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        sku: p.id.toUpperCase(),
        displayPrice: p.price,
        displayCompareAtPrice: p.originalPrice || null,
        stock_quantity: 15,
        is_featured: p.tag === 'Bestseller',
        is_active: true,
        tag: p.tag || null,
        short_description: p.shortDescription || p.description,
        imageUrl: p.imageUrl,
        categoryName: p.category,
      }));
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
    return PRODUCTS.map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      sku: p.id.toUpperCase(),
      displayPrice: p.price,
      displayCompareAtPrice: p.originalPrice || null,
      stock_quantity: 15,
      is_featured: p.tag === 'Bestseller',
      is_active: true,
      tag: p.tag || null,
      short_description: p.shortDescription || p.description,
      imageUrl: p.imageUrl,
      categoryName: p.category,
    }));
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

    productsCache.clear();
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

    productsCache.clear();
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

    productsCache.clear();
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to delete product' };
  }
}
