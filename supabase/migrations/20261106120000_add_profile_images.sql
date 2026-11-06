alter table public.profiles
    add column if not exists image_path text;

revoke update on public.profiles from authenticated;
grant update (image_path) on public.profiles to authenticated;

create policy "Users can update their own profile image"
on public.profiles
for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create policy "Users can upload their own profile images"
on storage.objects
for insert
to authenticated
with check (
    bucket_id = 'images'
    and name like 'profiles/' || (select auth.uid())::text || '-%'
);

create policy "Users can update their own profile images"
on storage.objects
for update
to authenticated
using (
    bucket_id = 'images'
    and name like 'profiles/' || (select auth.uid())::text || '-%'
)
with check (
    bucket_id = 'images'
    and name like 'profiles/' || (select auth.uid())::text || '-%'
);

create policy "Users can delete their own profile images"
on storage.objects
for delete
to authenticated
using (
    bucket_id = 'images'
    and name like 'profiles/' || (select auth.uid())::text || '-%'
);
