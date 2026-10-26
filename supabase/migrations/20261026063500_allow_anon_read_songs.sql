-- 1. Grant SELECT permissions on the songs table to anonymous visitors
grant select on table public.songs to anon;

-- 2. Create an RLS policy allowing everyone (anon and authenticated) to read songs
create policy "Songs are publicly readable"
on public.songs
for select
               to anon, authenticated
               using (true);