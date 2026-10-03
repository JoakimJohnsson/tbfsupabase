-- Seed existing artists into public.artists with normalized title casing, slugs, and curated bios
insert into public.artists (name, slug, description, image_path)
values
    ('15th 22', '15th-22', null, null),
    ('A Blueprint', 'a-blueprint', null, null),
    ('Boys on Heroin', 'boys-on-heroin', null, null),
    ('Duo Lubor', 'duo-lubor', null, null),
    ('Dyke Hard', 'dyke-hard', null, null),
    ('Electro Nic', 'electro-nic', null, null),
    ('Fangorn', 'fangorn', null, null),
    ('Farbror Farfar', 'farbror-farfar', null, null),
    ('Fred Swanson', 'fred-swanson', null, null),
    ('Fredrik Svensson', 'fredrik-svensson', null, null),
    ('Grisapan', 'grisapan', null, null),
    ('Gross', 'gross', null, null),
    ('H2O', 'h2o', null, null),
    ('Infact', 'infact', null, null),
    ('Las Peras', 'las-peras', null, null),
    ('Les Burlesques', 'les-burlesques', null, null),
    (
        'Local Oafs',
        'local-oafs',
        'Fast and melodic garage punk rock band from Oxelösund/Nyköping. Known for high-energy live shows and releases across Swedish underground labels.',
        null
    ),
    ('MC Bomb', 'mc-bomb', null, null),
    ('Models Inc.', 'models-inc', null, null),
    (
        'Music/Ninja',
        'music-ninja',
        'Indie punk outfit from Nyköping.',
        null
    ),
    (
        'Olle',
        'olle',
        'Solo acoustic indie-pop singer/songwriter project by Olle Stenbäck, featuring introspective songwriting, mini-albums, and idiosyncratic tributes.',
        null
    ),
    ('Satans Galjonsfigurer', 'satans-galjonsfigurer', null, null),
    ('Some Fuzz', 'some-fuzz', null, null),
    ('Spit Junction', 'spit-junction', null, null),
    ('The Alabama Alcoholics', 'the-alabama-alcoholics', null, null),
    ('The Baseball Field', 'the-baseball-field', null, null),
    ('The Bodonis', 'the-bodonis', null, null),
    ('The Catchers of the Westbound', 'the-catchers-of-the-westbound', null, null),
    ('The Cowboy Blues', 'the-cowboy-blues', null, null),
    ('The Creepy Insects', 'the-creepy-insects', null, null),
    ('The Dub-Liner', 'the-dub-liner', null, null),
    ('The Meca Hawk', 'the-meca-hawk', null, null),
    (
        'The Oxelösund',
        'the-oxelosund',
        'Short-lived project from Nyköping formed when the surviving members of The Bodonis joined vocalist Mattias Sköld. Rehearsed a handful of times, played live once, and captured only one studio rehearsal recording.',
        null
    ),
    ('Ulvbauge', 'ulvbauge', null, null),
    ('Various Artists', 'various-artists', null, null),
    ('What the Dead Man Said', 'what-the-dead-man-said', null, null),
    ('Ökenbröderna', 'okenbroderna', null, null)
    on conflict (slug) do update set
    name = excluded.name,
                              description = excluded.description;