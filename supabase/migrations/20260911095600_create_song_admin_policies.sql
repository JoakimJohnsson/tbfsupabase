grant insert, update, delete
    on table public.songs
    to authenticated;

create policy "Admins can create songs"
on public.songs
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

create policy "Admins can update songs"
on public.songs
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

create policy "Admins can delete songs"
on public.songs
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
