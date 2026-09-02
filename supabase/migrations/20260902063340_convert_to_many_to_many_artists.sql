create table public.record_artists (
                                       record_id uuid not null references public.records(id) on delete cascade,
                                       artist_id uuid not null references public.artists(id) on delete cascade,
                                       is_primary boolean not null default true,
                                       primary key (record_id, artist_id)
);

create table public.song_artists (
                                     song_id uuid not null references public.songs(id) on delete cascade,
                                     artist_id uuid not null references public.artists(id) on delete cascade,
                                     is_primary boolean not null default true,
                                     primary key (song_id, artist_id)
);

alter table public.record_artists enable row level security;
alter table public.song_artists enable row level security;

create policy "Authenticated users can read record artists"
on public.record_artists for select to authenticated using (true);

create policy "Authenticated users can read song artists"
on public.song_artists for select to authenticated using (true);

grant insert, update, delete on table public.record_artists to authenticated;
grant insert, update, delete on table public.song_artists to authenticated;

create policy "Admins can manage record artists"
on public.record_artists for all to authenticated
using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));

create policy "Admins can manage song artists"
on public.song_artists for all to authenticated
using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));

alter table public.records drop column artist_id;
alter table public.songs drop column artist_id;