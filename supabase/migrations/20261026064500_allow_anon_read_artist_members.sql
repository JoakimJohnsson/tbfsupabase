-- 1. Grant SELECT permissions on the artist_members table to anonymous visitors
grant select on table public.artist_members to anon;

-- 2. Create an RLS policy allowing everyone (anon and authenticated) to read artist members
create policy "Artist members are publicly readable"
on public.artist_members
for select
               to anon, authenticated
               using (true);