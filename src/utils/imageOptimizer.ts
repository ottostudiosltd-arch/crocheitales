/**
 * Client-side Image Optimization Pipeline for Crochie Tales
 * 
 * Ensures all product photos are compressed to modern WebP format
 * with max dimensions of 1000px and target size of 50-80 KB.
 * 
 * Free Tier Math:
 * - 1 GB Supabase Storage = 1,048,576 KB
 * - At ~60 KB per image = 17,400+ product images fit in 1 GB free tier!
 */

export interface CompressionResult {
  file: File;
  originalSizeKb: number;
  compressedSizeKb: number;
  savingsPercent: number;
  previewUrl: string;
  width: number;
  height: number;
}

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  targetMaxKb?: number;
}

export async function compressImageToWebP(
  inputFile: File,
  options: CompressionOptions = {}
): Promise<CompressionResult> {
  const {
    maxWidth = 1000,
    maxHeight = 1000,
    quality = 0.8,
    targetMaxKb = 85,
  } = options;

  const originalSizeKb = Math.round(inputFile.size / 1024);

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.onload = async () => {
        try {
          // Calculate target dimensions keeping aspect ratio
          let { width, height } = img;
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
          }

          // Draw onto canvas
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            throw new Error('Canvas context could not be created');
          }

          // Use high quality image smoothing
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);

          // Progressive compression to meet target size
          let currentQuality = quality;
          let compressedBlob: Blob | null = null;

          // Attempt WebP encoding with fallback quality
          for (let attempt = 0; attempt < 3; attempt++) {
            compressedBlob = await new Promise<Blob | null>((res) => {
              canvas.toBlob(
                (b) => res(b),
                'image/webp',
                currentQuality
              );
            });

            if (!compressedBlob) break;

            const sizeKb = compressedBlob.size / 1024;
            if (sizeKb <= targetMaxKb || currentQuality <= 0.5) {
              break;
            }
            // Step down quality if still too large
            currentQuality -= 0.12;
          }

          if (!compressedBlob) {
            throw new Error('WebP compression failed');
          }

          const compressedSizeKb = Math.round(compressedBlob.size / 1024);
          const savingsPercent = Math.max(
            0,
            Math.round(((originalSizeKb - compressedSizeKb) / originalSizeKb) * 100)
          );

          // Generate clean WebP filename
          const cleanName = inputFile.name
            .replace(/\.[^/.]+$/, '')
            .toLowerCase()
            .replace(/[^a-z0-9_-]/g, '-');
          const webpFileName = `${cleanName}-${Date.now()}.webp`;

          const optimizedFile = new File([compressedBlob], webpFileName, {
            type: 'image/webp',
            lastModified: Date.now(),
          });

          const previewUrl = URL.createObjectURL(compressedBlob);

          resolve({
            file: optimizedFile,
            originalSizeKb,
            compressedSizeKb,
            savingsPercent,
            previewUrl,
            width,
            height,
          });
        } catch (err) {
          reject(err);
        }
      };

      img.onerror = () => reject(new Error('Failed to load image file for compression'));
      img.src = event.target?.result as string;
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(inputFile);
  });
}
