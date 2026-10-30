-- 1. Grant SELECT permissions on the persons table to anonymous visitors
grant select on table public.persons to anon;

-- 2. Create an RLS policy allowing everyone (anon and authenticated) to read persons
create policy "Persons are publicly readable"
on public.persons
for select
               to anon, authenticated
               using (true);