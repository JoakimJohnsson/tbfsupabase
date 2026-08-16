create table public.profiles (
                                 id uuid primary key references auth.users(id) on delete cascade,
                                 first_name text,
                                 last_name text,
                                 is_admin boolean not null default false,
                                 created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

grant select on table public.profiles to authenticated;

create policy "Users can read their own profile"
on public.profiles
for select
               to authenticated
               using ((select auth.uid()) = id);

grant insert, update, delete
    on table public.artists
    to authenticated;

create policy "Admins can create artists"
on public.artists
for insert
to authenticated
with check (
    exists (
        select 1
        from public.profiles
        where profiles.id = (select auth.uid())
          and profiles.is_admin = true
    )
);

create policy "Admins can update artists"
on public.artists
for update
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

create policy "Admins can delete artists"
on public.artists
for delete
to authenticated
using (
    exists (
        select 1
        from public.profiles
        where profiles.id = (select auth.uid())
          and profiles.is_admin = true
    )
);