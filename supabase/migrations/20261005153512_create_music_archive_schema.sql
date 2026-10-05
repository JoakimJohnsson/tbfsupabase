-- 1. Create the public 'audio' bucket in Supabase Storage
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
           'audio',
           'audio',
           true,
           52428800, -- 50 MB max per audio file
           array[
               'audio/mpeg',
           'audio/mp3',
           'audio/ogg',
           'audio/wav',
           'audio/x-m4a',
           'audio/mp4'
               ]
       )
    on conflict (id) do update set
                            public = true,
                            file_size_limit = 52428800,
                            allowed_mime_types = array[
                            'audio/mpeg',
                            'audio/mp3',
                            'audio/ogg',
                            'audio/wav',
                            'audio/x-m4a',
                            'audio/mp4'
                            ];

-- 2. RLS policy: Public read access for audio playback (visitors and members)
create policy "Audio files are publicly accessible"
on storage.objects
for select
               to anon, authenticated
               using (bucket_id = 'audio');

-- 3. RLS policy: Only administrators can upload audio files
create policy "Admins can upload audio files"
on storage.objects
for insert
to authenticated
with check (
    bucket_id = 'audio'
    and exists (
        select 1
        from public.profiles
        where profiles.id = (select auth.uid())
          and profiles.is_admin = true
    )
);

-- 4. RLS policy: Only administrators can update or replace audio files
create policy "Admins can update audio files"
on storage.objects
for update
                      to authenticated
                      using (
                      bucket_id = 'audio'
                      and exists (
                      select 1
                      from public.profiles
                      where profiles.id = (select auth.uid())
                      and profiles.is_admin = true
                      )
                      );

-- 5. RLS policy: Only administrators can delete audio files
create policy "Admins can delete audio files"
on storage.objects
for delete
to authenticated
using (
    bucket_id = 'audio'
    and exists (
        select 1
        from public.profiles
        where profiles.id = (select auth.uid())
          and profiles.is_admin = true
    )
);