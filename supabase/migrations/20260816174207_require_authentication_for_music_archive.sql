revoke select on table public.artists from anon;
revoke select on table public.persons from anon;
revoke select on table public.artist_members from anon;
revoke select on table public.records from anon;
revoke select on table public.songs from anon;

drop policy "Artists are publicly readable"
on public.artists;

drop policy "Persons are publicly readable"
on public.persons;

drop policy "Artist members are publicly readable"
on public.artist_members;

drop policy "Records are publicly readable"
on public.records;

drop policy "Songs are publicly readable"
on public.songs;

create policy "Authenticated users can read artists"
on public.artists
for select
                                        to authenticated
                                        using (true);

create policy "Authenticated users can read persons"
on public.persons
for select
               to authenticated
               using (true);

create policy "Authenticated users can read artist members"
on public.artist_members
for select
               to authenticated
               using (true);

create policy "Authenticated users can read records"
on public.records
for select
               to authenticated
               using (true);

create policy "Authenticated users can read songs"
on public.songs
for select
               to authenticated
               using (true);