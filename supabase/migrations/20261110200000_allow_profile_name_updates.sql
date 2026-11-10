grant update (display_name, first_name, last_name)
    on public.profiles to authenticated;

alter policy "Users can update their own profile image"
    on public.profiles
    rename to "Users can update their own profile";
