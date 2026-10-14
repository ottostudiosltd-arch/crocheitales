import { supabase } from '../lib/supabase';
import { compressImageToWebP, type CompressionResult } from '../utils/imageOptimizer';

export const PRODUCT_STORAGE_BUCKET = 'product-images';

export interface UploadProductImageResult {
  success: boolean;
  publicUrl?: string;
  storagePath?: string;
  compressionStats?: CompressionResult;
  error?: string;
}

/**
 * Compresses an image client-side to WebP (<80 KB) and uploads it
 * to Supabase Storage bucket 'product-images'.
 */
export async function uploadOptimizedProductImage(
  rawFile: File,
  options: {
    folder?: string;
    productId?: string;
    altText?: string;
    isPrimary?: boolean;
    sortOrder?: number;
  } = {}
): Promise<UploadProductImageResult> {
  try {
    // 1. Client-side WebP compression (forces size to ~50-80 KB)
    const compressionStats = await compressImageToWebP(rawFile, {
      maxWidth: 1000,
      maxHeight: 1000,
      quality: 0.8,
      targetMaxKb: 85,
    });

    const folder = options.folder || 'catalog';
    const filePath = `${folder}/${compressionStats.file.name}`;

    // 2. Upload compressed WebP to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(PRODUCT_STORAGE_BUCKET)
      .upload(filePath, compressionStats.file, {
        contentType: 'image/webp',
        upsert: true,
      });

    if (uploadError) {
      console.error('Supabase storage upload error:', uploadError);
      return {
        success: false,
        error: uploadError.message,
        compressionStats,
      };
    }

    // 3. Get Public CDN URL
    const { data: publicData } = supabase.storage
      .from(PRODUCT_STORAGE_BUCKET)
      .getPublicUrl(uploadData.path);

    const publicUrl = publicData.publicUrl;

    // 4. Optionally register link in product_images table if productId provided
    if (options.productId && publicUrl) {
      const { error: dbError } = await (supabase.from('product_images') as any).insert({
        product_id: options.productId,
        image_url: publicUrl,
        alt_text: options.altText || rawFile.name,
        sort_order: options.sortOrder || 0,
        is_primary: options.isPrimary ?? false,
      });

      if (dbError) {
        console.warn('Failed to insert product image row in DB:', dbError);
      }
    }

    return {
      success: true,
      publicUrl,
      storagePath: uploadData.path,
      compressionStats,
    };
  } catch (err: any) {
    console.error('Error in uploadOptimizedProductImage:', err);
    return {
      success: false,
      error: err?.message || 'Failed to optimize and upload image',
    };
  }
}
