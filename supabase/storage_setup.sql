-- ==============================================================================
-- Crochie Tales - Supabase Storage Configuration (Free Tier Optimized)
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/rclxmrnzqpcdnojxahem/sql
-- ==============================================================================

-- 1. Create the 'product-images' public bucket if not already existing
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  true,
  5242880, -- 5 MB max raw upload limit before compression
  array['image/webp', 'image/jpeg', 'image/png', 'image/jpg']
)
on conflict (id) do update set
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = array['image/webp', 'image/jpeg', 'image/png', 'image/jpg'];

-- 2. Storage Policies (Row Level Security for Buckets)

-- Allow public read access to all images in 'product-images' bucket
drop policy if exists "Public Access to Product Images" on storage.objects;
create policy "Public Access to Product Images"
  on storage.objects for select
  using (bucket_id = 'product-images');

-- Allow authenticated store administrators to upload images
drop policy if exists "Admin Upload to Product Images" on storage.objects;
create policy "Admin Upload to Product Images"
  on storage.objects for insert
  with check (
    bucket_id = 'product-images'
    and (auth.role() = 'authenticated' or public.is_admin())
  );

-- Allow authenticated store administrators to update/overwrite images
drop policy if exists "Admin Update Product Images" on storage.objects;
create policy "Admin Update Product Images"
  on storage.objects for update
  using (
    bucket_id = 'product-images'
    and (auth.role() = 'authenticated' or public.is_admin())
  );

-- Allow authenticated store administrators to delete images
drop policy if exists "Admin Delete Product Images" on storage.objects;
create policy "Admin Delete Product Images"
  on storage.objects for delete
  using (
    bucket_id = 'product-images'
    and (auth.role() = 'authenticated' or public.is_admin())
  );
