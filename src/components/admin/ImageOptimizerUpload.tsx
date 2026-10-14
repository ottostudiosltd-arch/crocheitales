import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  CheckCircle2,
  Sparkles,
  Copy,
  Check,
  AlertCircle,
  FileImage,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { compressImageToWebP, type CompressionResult } from '../../utils/imageOptimizer';
import { uploadOptimizedProductImage, PRODUCT_STORAGE_BUCKET } from '../../services/storageService';

export const ImageOptimizerUpload: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [compressionResult, setCompressionResult] = useState<CompressionResult | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccessUrl, setUploadSuccessUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setUploadSuccessUrl(null);
    setErrorMessage(null);
    setIsCompressing(true);

    try {
      const result = await compressImageToWebP(file, {
        maxWidth: 1000,
        maxHeight: 1000,
        quality: 0.8,
        targetMaxKb: 85,
      });
      setCompressionResult(result);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to compress image');
    } finally {
      setIsCompressing(false);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setErrorMessage(null);

    try {
      const res = await uploadOptimizedProductImage(selectedFile, {
        folder: 'products',
      });

      if (res.success && res.publicUrl) {
        setUploadSuccessUrl(res.publicUrl);
      } else {
        setErrorMessage(
          res.error ||
            'Could not upload to Supabase Storage. Ensure bucket "product-images" is created.'
        );
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Upload error');
    } finally {
      setIsUploading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-3xl border border-brand-border/70 p-6 sm:p-8 shadow-soft space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-brand-border/50">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              Free Tier Shield
            </span>
            <span className="text-xs text-brand-text-muted">
              1 GB Storage &bull; 500 MB Database
            </span>
          </div>
          <h2 className="font-serif text-xl font-bold text-brand-burgundy mt-1">
            Smart Image Compression & Storage Pipeline
          </h2>
          <p className="text-xs text-brand-text-muted mt-0.5">
            Auto-converts heavy camera photos (4-10MB) to lightweight WebP (50-80KB) before uploading to Supabase.
          </p>
        </div>

        <div className="text-right">
          <Badge variant="bestseller" className="text-xs">
            ~17,400+ Photos Capacity in Free 1 GB
          </Badge>
        </div>
      </div>

      {/* Upload & Dropzone */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5 space-y-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg, image/jpg, image/webp"
            className="hidden"
            onChange={handleFileChange}
          />

          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-brand-border rounded-2xl p-6 text-center cursor-pointer hover:border-brand-burgundy/60 hover:bg-brand-cream/30 transition-all group"
          >
            <div className="w-12 h-12 rounded-full bg-brand-cream flex items-center justify-center mx-auto text-brand-burgundy group-hover:scale-105 transition-transform">
              <UploadCloud className="w-6 h-6 stroke-[1.8]" />
            </div>
            <p className="font-serif font-bold text-sm text-brand-burgundy mt-3">
              Click to select product photo
            </p>
            <p className="text-[11px] text-brand-text-muted mt-1">
              Supports JPEG, PNG, WEBP (Any size: 2MB - 15MB)
            </p>
          </div>

          {/* Efficiency Metric Card */}
          <div className="bg-brand-cream/30 rounded-2xl p-4 border border-brand-border/40 space-y-2 text-xs">
            <div className="flex items-center gap-1.5 font-semibold text-brand-burgundy">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Free Tier Math & Protection</span>
            </div>
            <ul className="space-y-1 text-brand-text-muted text-[11px]">
              <li>&bull; <strong className="text-brand-text-primary">1 GB Storage:</strong> Stores ~17,400 WebP images.</li>
              <li>&bull; <strong className="text-brand-text-primary">500 MB Database:</strong> Only stores URL links (~60 bytes each), leaves 99.9% DB free for orders!</li>
              <li>&bull; <strong className="text-brand-text-primary">Fast Loading:</strong> Instant page speeds on Indian 4G/5G mobile networks.</li>
            </ul>
          </div>
        </div>

        {/* Compression Inspection Panel */}
        <div className="lg:col-span-7 bg-[#FAF7F2] rounded-2xl border border-brand-border/60 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-text-muted flex items-center gap-1.5">
              <FileImage className="w-4 h-4 text-brand-burgundy" />
              Compression & Optimization Engine
            </span>
            {compressionResult && (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                Saved {compressionResult.savingsPercent}% Space!
              </span>
            )}
          </div>

          {isCompressing && (
            <div className="py-10 text-center space-y-2">
              <div className="w-8 h-8 border-2 border-brand-burgundy border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-brand-text-muted">Compressing with HTML5 WebP canvas...</p>
            </div>
          )}

          {!isCompressing && !compressionResult && (
            <div className="py-12 text-center text-xs text-brand-text-muted">
              Select or drop any raw image to see live WebP compression and size reduction.
            </div>
          )}

          {!isCompressing && compressionResult && (
            <div className="space-y-4">
              {/* Comparison row */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
                <div className="bg-white p-3 rounded-xl border border-brand-border/50">
                  <span className="text-[10px] text-brand-text-muted uppercase font-semibold">Raw Original</span>
                  <p className="text-base font-bold text-red-600 mt-0.5 font-sans">
                    {compressionResult.originalSizeKb} KB
                  </p>
                  <span className="text-[10px] text-brand-text-muted">Camera photo</span>
                </div>

                <div className="bg-white p-3 rounded-xl border border-brand-border/50">
                  <span className="text-[10px] text-brand-text-muted uppercase font-semibold">Optimized WebP</span>
                  <p className="text-base font-bold text-emerald-600 mt-0.5 font-sans">
                    {compressionResult.compressedSizeKb} KB
                  </p>
                  <span className="text-[10px] text-emerald-600 font-semibold">{compressionResult.width}×{compressionResult.height}px</span>
                </div>

                <div className="col-span-2 sm:col-span-1 bg-white p-3 rounded-xl border border-brand-border/50 flex flex-col justify-center">
                  <span className="text-[10px] text-brand-text-muted uppercase font-semibold">Savings</span>
                  <p className="text-base font-bold text-brand-burgundy mt-0.5">
                    {compressionResult.savingsPercent}% Less
                  </p>
                  <span className="text-[10px] text-emerald-600 font-medium">Free Tier Safe</span>
                </div>
              </div>

              {/* Preview */}
              <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-brand-border/50">
                <img
                  src={compressionResult.previewUrl}
                  alt="Optimized preview"
                  className="w-16 h-16 rounded-lg object-cover border border-brand-border flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-brand-text-primary truncate">
                    {compressionResult.file.name}
                  </p>
                  <p className="text-[10px] text-brand-text-muted">
                    Format: image/webp &bull; Target bucket: {PRODUCT_STORAGE_BUCKET}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={handleUpload}
                  disabled={isUploading}
                >
                  {isUploading ? 'Uploading...' : 'Upload to Supabase'}
                </Button>
              </div>

              {/* Error State */}
              {errorMessage && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Upload notice:</p>
                    <p className="text-[11px] mt-0.5">{errorMessage}</p>
                    <p className="text-[10px] text-red-600/80 mt-1">
                      Tip: Run `storage_setup.sql` in your Supabase SQL Editor if the bucket hasn't been created yet.
                    </p>
                  </div>
                </div>
              )}

              {/* Success State */}
              {uploadSuccessUrl && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Uploaded to Supabase Storage Successfully!</span>
                  </div>
                  <p className="text-[11px] text-emerald-800 break-all font-mono bg-white/70 p-2 rounded-lg border border-emerald-200">
                    {uploadSuccessUrl}
                  </p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-emerald-700 font-medium">
                      Public CDN URL ready to use in product catalog
                    </span>
                    <button
                      onClick={() => copyToClipboard(uploadSuccessUrl)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-200/60 px-2.5 py-1 rounded-full transition-colors"
                    >
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied Link' : 'Copy CDN URL'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
