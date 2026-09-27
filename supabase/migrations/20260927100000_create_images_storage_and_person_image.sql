-- 1. Add image support for archive members and musicians
alter table public.persons
    add column if not exists image_path text;

-- 2. Create the public 'images' bucket in Supabase Storage
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
           'images',
           'images',
           true,
           5242880, -- 5 MB max per image
           array['image/jpeg', 'image/png', 'image/webp']
       )
    on conflict (id) do update set
                            public = true,
                            file_size_limit = 5242880,
                            allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp'];

-- 3. RLS policy: Public read access for everyone (anonymous visitors and members)
create policy "Images are publicly accessible"
on storage.objects
for select
               to anon, authenticated
               using (bucket_id = 'images');

-- 4. RLS policy: Only administrators can upload images
create policy "Admins can upload images"
on storage.objects
for insert
to authenticated
with check (
    bucket_id = 'images'
    and exists (
        select 1
        from public.profiles
        where profiles.id = (select auth.uid())
          and profiles.is_admin = true
    )
);

-- 5. RLS policy: Only administrators can update or replace existing images
create policy "Admins can update images"
on storage.objects
for update
                      to authenticated
                      using (
                      bucket_id = 'images'
                      and exists (
                      select 1
                      from public.profiles
                      where profiles.id = (select auth.uid())
                      and profiles.is_admin = true
                      )
                      );

-- 6. RLS policy: Only administrators can delete images
create policy "Admins can delete images"
on storage.objects
for delete
to authenticated
using (
    bucket_id = 'images'
    and exists (
        select 1
        from public.profiles
        where profiles.id = (select auth.uid())
          and profiles.is_admin = true
    )
);