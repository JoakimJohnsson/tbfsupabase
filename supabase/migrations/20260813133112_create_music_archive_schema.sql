create table public.artists (
                                id uuid primary key default gen_random_uuid(),
                                slug text not null unique,
                                name text not null,
                                description text,
                                image_path text,
                                created_at timestamptz not null default now()
);

create table public.persons (
                                id uuid primary key default gen_random_uuid(),
                                first_name text not null,
                                last_name text not null,
                                created_at timestamptz not null default now()
);

create table public.artist_members (
                                       artist_id uuid not null references public.artists(id) on delete cascade,
                                       person_id uuid not null references public.persons(id) on delete cascade,

                                       primary key (artist_id, person_id)
);

create table public.records (
                                id uuid primary key default gen_random_uuid(),
                                artist_id uuid not null references public.artists(id) on delete cascade,
                                name text not null,
                                description text,
                                cover_path text,
                                format text,
                                type text,
                                year integer,
                                created_at timestamptz not null default now()
);

create table public.songs (
                              id uuid primary key default gen_random_uuid(),
                              artist_id uuid not null references public.artists(id) on delete cascade,
                              record_id uuid references public.records(id) on delete set null,
                              track_number integer,
                              name text not null,
                              audio_path text not null,
                              created_at timestamptz not null default now()
);

alter table public.artists enable row level security;
alter table public.persons enable row level security;
alter table public.artist_members enable row level security;
alter table public.records enable row level security;
alter table public.songs enable row level security;

grant select on table public.artists to anon, authenticated;
grant select on table public.persons to anon, authenticated;
grant select on table public.artist_members to anon, authenticated;
grant select on table public.records to anon, authenticated;
grant select on table public.songs to anon, authenticated;

create policy "Artists are publicly readable"
on public.artists
for select
               to anon, authenticated
               using (true);

create policy "Persons are publicly readable"
on public.persons
for select
               to anon, authenticated
               using (true);

create policy "Artist members are publicly readable"
on public.artist_members
for select
               to anon, authenticated
               using (true);

create policy "Records are publicly readable"
on public.records
for select
               to anon, authenticated
               using (true);

create policy "Songs are publicly readable"
on public.songs
for select
               to anon, authenticated
               using (true);