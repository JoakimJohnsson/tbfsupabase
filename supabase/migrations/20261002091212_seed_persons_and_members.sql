-- 1. Ensure unique constraint on persons (first_name, last_name) for idempotent seeding
create unique index if not exists persons_first_name_last_name_idx
    on public.persons (first_name, last_name);

-- 2. Seed all 16 unique persons (musicians)
insert into public.persons (first_name, last_name, image_path)
values
    ('Curtis', 'Blowjob', null),
    ('Fredrik', 'Svensson', null),
    ('"Hellraiser"', 'McCrosky', null),
    ('Jens', 'Ullenius', null),
    ('Jerker', 'Hagman', null),
    ('Fredrik', 'Denninger', null),
    ('Wille', 'Åhlund', null),
    ('Joakim', 'Johnsson', null),
    ('Jorge', 'Gonzales', null),
    ('Kalle', 'Jansson', null),
    ('Leif', 'Bomb', null),
    ('Leif', 'Monty', null),
    ('Marcus', 'Andersson', null),
    ('Mattias', 'Sköld', null),
    ('Max', 'Thyrén', null),
    ('Monkey Man', 'Miller', null),
    ('Olle', 'Stenbäck', null),
    ('Sammy', 'Claptrap', null)
    on conflict (first_name, last_name) do nothing;

-- 3. Seed artist memberships
insert into public.artist_members (artist_id, person_id)
values
    -- 15th 22
    (
        (select id from public.artists where slug = '15th-22'),
        (select id from public.persons where first_name = 'Joakim' and last_name = 'Johnsson')
    ),
    -- A Blueprint
    (
        (select id from public.artists where slug = 'a-blueprint'),
        (select id from public.persons where first_name = 'Marcus' and last_name = 'Andersson')
    ),
    -- Electro Nic
    (
        (select id from public.artists where slug = 'electro-nic'),
        (select id from public.persons where first_name = 'Marcus' and last_name = 'Andersson')
    ),
    -- Fangorn
    (
        (select id from public.artists where slug = 'fangorn'),
        (select id from public.persons where first_name = 'Marcus' and last_name = 'Andersson')
    ),
    -- Farbror Farfar
    (
        (select id from public.artists where slug = 'farbror-farfar'),
        (select id from public.persons where first_name = 'Joakim' and last_name = 'Johnsson')
    ),
    (
        (select id from public.artists where slug = 'farbror-farfar'),
        (select id from public.persons where first_name = 'Mattias' and last_name = 'Sköld')
    ),
    (
        (select id from public.artists where slug = 'farbror-farfar'),
        (select id from public.persons where first_name = 'Fredrik' and last_name = 'Svensson')
    ),
    -- Fredrik Svensson (Solo project)
    (
        (select id from public.artists where slug = 'fredrik-svensson'),
        (select id from public.persons where first_name = 'Fredrik' and last_name = 'Svensson')
    ),
    -- H2O
    (
        (select id from public.artists where slug = 'h2o'),
        (select id from public.persons where first_name = 'Marcus' and last_name = 'Andersson')
    ),
    (
        (select id from public.artists where slug = 'h2o'),
        (select id from public.persons where first_name = 'Fredrik' and last_name = 'Svensson')
    ),
    -- Local Oafs
    (
        (select id from public.artists where slug = 'local-oafs'),
        (select id from public.persons where first_name = 'Kalle' and last_name = 'Jansson')
    ),
    (
        (select id from public.artists where slug = 'local-oafs'),
        (select id from public.persons where first_name = 'Max' and last_name = 'Thyrén')
    ),
    (
        (select id from public.artists where slug = 'local-oafs'),
        (select id from public.persons where first_name = 'Fredrik' and last_name = 'Denninger')
    ),
    (
        (select id from public.artists where slug = 'local-oafs'),
        (select id from public.persons where first_name = 'Wille' and last_name = 'Åhlund')
    ),
    -- MC Bomb
    (
        (select id from public.artists where slug = 'mc-bomb'),
        (select id from public.persons where first_name = 'Marcus' and last_name = 'Andersson')
    ),
    (
        (select id from public.artists where slug = 'mc-bomb'),
        (select id from public.persons where first_name = 'Leif' and last_name = 'Bomb')
    ),
    -- Models Inc.
    (
        (select id from public.artists where slug = 'models-inc'),
        (select id from public.persons where first_name = 'Jorge' and last_name = 'Gonzales')
    ),
    (
        (select id from public.artists where slug = 'models-inc'),
        (select id from public.persons where first_name = 'Jerker' and last_name = 'Hagman')
    ),
    (
        (select id from public.artists where slug = 'models-inc'),
        (select id from public.persons where first_name = 'Jens' and last_name = 'Ullenius')
    ),
    -- Music/Ninja
    (
        (select id from public.artists where slug = 'music-ninja'),
        (select id from public.persons where first_name = 'Marcus' and last_name = 'Andersson')
    ),
    (
        (select id from public.artists where slug = 'music-ninja'),
        (select id from public.persons where first_name = 'Joakim' and last_name = 'Johnsson')
    ),
    (
        (select id from public.artists where slug = 'music-ninja'),
        (select id from public.persons where first_name = 'Mattias' and last_name = 'Sköld')
    ),
    (
        (select id from public.artists where slug = 'music-ninja'),
        (select id from public.persons where first_name = 'Fredrik' and last_name = 'Svensson')
    ),
    -- Olle (Solo project)
    (
        (select id from public.artists where slug = 'olle'),
        (select id from public.persons where first_name = 'Olle' and last_name = 'Stenbäck')
    ),
    -- Satans Galjonsfigurer
    (
        (select id from public.artists where slug = 'satans-galjonsfigurer'),
        (select id from public.persons where first_name = 'Mattias' and last_name = 'Sköld')
    ),
    (
        (select id from public.artists where slug = 'satans-galjonsfigurer'),
        (select id from public.persons where first_name = 'Fredrik' and last_name = 'Svensson')
    ),
    -- Some Fuzz
    (
        (select id from public.artists where slug = 'some-fuzz'),
        (select id from public.persons where first_name = 'Sammy' and last_name = 'Claptrap')
    ),
    (
        (select id from public.artists where slug = 'some-fuzz'),
        (select id from public.persons where first_name = 'Leif' and last_name = 'Monty')
    ),
    -- The Alabama Alcoholics
    (
        (select id from public.artists where slug = 'the-alabama-alcoholics'),
        (select id from public.persons where first_name = 'Curtis' and last_name = 'Blowjob')
    ),
    (
        (select id from public.artists where slug = 'the-alabama-alcoholics'),
        (select id from public.persons where first_name = '"Hellraiser"' and last_name = 'McCrosky')
    ),
    (
        (select id from public.artists where slug = 'the-alabama-alcoholics'),
        (select id from public.persons where first_name = 'Monkey Man' and last_name = 'Miller')
    ),
    -- The Baseball Field
    (
        (select id from public.artists where slug = 'the-baseball-field'),
        (select id from public.persons where first_name = 'Joakim' and last_name = 'Johnsson')
    ),
    -- The Bodonis
    (
        (select id from public.artists where slug = 'the-bodonis'),
        (select id from public.persons where first_name = 'Joakim' and last_name = 'Johnsson')
    ),
    (
        (select id from public.artists where slug = 'the-bodonis'),
        (select id from public.persons where first_name = 'Fredrik' and last_name = 'Svensson')
    ),
    -- The Catchers of the Westbound
    (
        (select id from public.artists where slug = 'the-catchers-of-the-westbound'),
        (select id from public.persons where first_name = 'Mattias' and last_name = 'Sköld')
    ),
    (
        (select id from public.artists where slug = 'the-catchers-of-the-westbound'),
        (select id from public.persons where first_name = 'Fredrik' and last_name = 'Svensson')
    ),
    -- The Oxelösund
    (
        (select id from public.artists where slug = 'the-oxelosund'),
        (select id from public.persons where first_name = 'Joakim' and last_name = 'Johnsson')
    ),
    (
        (select id from public.artists where slug = 'the-oxelosund'),
        (select id from public.persons where first_name = 'Mattias' and last_name = 'Sköld')
    ),
    (
        (select id from public.artists where slug = 'the-oxelosund'),
        (select id from public.persons where first_name = 'Fredrik' and last_name = 'Svensson')
    )
    on conflict do nothing;