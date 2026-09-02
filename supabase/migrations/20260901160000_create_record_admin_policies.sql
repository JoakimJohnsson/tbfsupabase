grant insert, update, delete
    on table public.records
    to authenticated;

create policy "Admins can create records"
on public.records
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

create policy "Admins can update records"
on public.records
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

create policy "Admins can delete records"
on public.records
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