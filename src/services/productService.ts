import { supabase, minorToMajor } from '../lib/supabase';
import type { Product } from '../components/shop/ProductCard';
import { asset } from '../utils/asset';

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
