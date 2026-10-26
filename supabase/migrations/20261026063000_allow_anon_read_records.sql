-- 1. Grant SELECT permissions on the records table to anonymous visitors
grant select on table public.records to anon;

-- 2. Create an RLS policy allowing everyone (anon and authenticated) to read records
create policy "Records are publicly readable"
on public.records
for select
               to anon, authenticated
               using (true);