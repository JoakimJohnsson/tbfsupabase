-- Grant table write permissions to authenticated users
grant insert, update, delete
    on table public.artist_members
    to authenticated;

-- Allow administrators to manage all operations on artist_members
create policy "Admins can manage artist members"
on public.artist_members
for all
to authenticated
using (
    exists (
        select 1
        from public.profiles
        where profiles.id = (select auth.uid())
          and profiles.is_admin = true
    )
)
with check (
    exists (
        select 1
        from public.profiles
        where profiles.id = (select auth.uid())
          and profiles.is_admin = true
    )
);

-- Also ensure admins can insert, update, and delete persons if not already granted
grant insert, update, delete
    on table public.persons
    to authenticated;

create policy "Admins can manage persons"
on public.persons
for all
to authenticated
using (
    exists (
        select 1
        from public.profiles
        where profiles.id = (select auth.uid())
          and profiles.is_admin = true
    )
)
with check (
    exists (
        select 1
        from public.profiles
        where profiles.id = (select auth.uid())
          and profiles.is_admin = true
    )
);