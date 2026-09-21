grant select on table public.artists to anon;

create policy "Artists are publicly readable"
on public.artists
for select
               to anon, authenticated
               using (true);