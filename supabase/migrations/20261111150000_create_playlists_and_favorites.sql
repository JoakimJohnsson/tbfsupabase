-- 1. Favorites
create table public.song_favorites (
    user_id uuid not null references auth.users(id) on delete cascade,
    song_id uuid not null references public.songs(id) on delete cascade,
    created_at timestamptz not null default now(),
    primary key (user_id, song_id)
);

alter table public.song_favorites enable row level security;
grant select, insert, delete on table public.song_favorites to authenticated;

create policy "Users can view their own favorites"
    on public.song_favorites for select to authenticated
    using ((select auth.uid()) = user_id);

create policy "Users can add their own favorites"
    on public.song_favorites for insert to authenticated
    with check ((select auth.uid()) = user_id);

create policy "Users can delete their own favorites"
    on public.song_favorites for delete to authenticated
    using ((select auth.uid()) = user_id);

-- 2. Playlists
create table public.playlists (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    name text not null,
    description text,
    created_at timestamptz not null default now()
);

create index playlists_user_created_at_idx
    on public.playlists (user_id, created_at desc);

alter table public.playlists enable row level security;
grant select, insert, update, delete on table public.playlists to authenticated;

create policy "Users can view their own playlists"
    on public.playlists for select to authenticated
    using ((select auth.uid()) = user_id);

create policy "Users can create their own playlists"
    on public.playlists for insert to authenticated
    with check ((select auth.uid()) = user_id);

create policy "Users can update their own playlists"
    on public.playlists for update to authenticated
    using ((select auth.uid()) = user_id)
    with check ((select auth.uid()) = user_id);

create policy "Users can delete their own playlists"
    on public.playlists for delete to authenticated
    using ((select auth.uid()) = user_id);

-- 3. Songs in playlists
create table public.playlist_songs (
    id uuid primary key default gen_random_uuid(),
    playlist_id uuid not null references public.playlists(id) on delete cascade,
    song_id uuid not null references public.songs(id) on delete cascade,
    position integer not null default 0,
    created_at timestamptz not null default now(),
    unique (playlist_id, song_id)
);

create index playlist_songs_playlist_position_idx
    on public.playlist_songs (playlist_id, position);

alter table public.playlist_songs enable row level security;
grant select, insert, update, delete on table public.playlist_songs to authenticated;

create policy "Users can view songs in their playlists"
    on public.playlist_songs for select to authenticated
    using (
        exists (
            select 1 from public.playlists p
            where p.id = playlist_songs.playlist_id
            and p.user_id = (select auth.uid())
        )
    );

create policy "Users can manage songs in their playlists"
    on public.playlist_songs for all to authenticated
    using (
        exists (
            select 1 from public.playlists p
            where p.id = playlist_songs.playlist_id
            and p.user_id = (select auth.uid())
        )
    )
    with check (
        exists (
            select 1 from public.playlists p
            where p.id = playlist_songs.playlist_id
            and p.user_id = (select auth.uid())
        )
    );
