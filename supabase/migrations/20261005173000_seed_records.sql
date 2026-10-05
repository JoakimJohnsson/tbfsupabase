-- 1. Insert the exact 50 records from the Firebase export with normalized formats and types
insert into public.records (id, name, year, format, type, description, cover_path)
select
    gen_random_uuid(),
    t.name,
    t.year,
    t.format,
    t.type,
    t.description,
    null
from (
         values
             ('Songs for the gluesniffin'' bastards', 1997, 'cassette', 'ep', 'One copy released on cassette in July 1997. Recorded at home on the Sanningens Silverstudio 4-track porta, wich were borrowed from Fredrik. Witness the first awkward attempts at pretentious singer/songwriting.'),
             ('Money and electricity', 1998, 'cassette', 'ep', null),
             ('Demos', 2008, 'digital', 'ep', null),
             ('Platser där du aldrig varit', 1998, 'cassette', 'ep', null),
             ('Galaxmästarens hatt', 1996, 'cassette', 'ep', null),
             ('Causes', 1998, 'cdr', 'ep', 'A new record.'),
             ('The sound of...', 1998, 'cdr', 'ep', 'A new record.'),
             ('Ambient dub', 2008, 'cdr', 'ep', null),
             ('Shining through', 2009, 'cdr', 'ep', null),
             ('Promo 1', 2000, 'cdr', 'ep', 'Recorded on cassette in February of 2000. And then released on CD-R in a few copies. A Cop a Clown and a Handgun was played on Swedish national radio once. Karin Dreijer Andersson of The Knife liked the record.'),
             ('s/t', 2002, 'vinyl-7', 'ep', 'Recorded live (one channel / bandmember) in March 2002. The record was then mixed in Dual Mono for your optimal sound experience. Released in April of the same year on Strandad Sjöbuse Records (SSR-03).'),
             ('Essen sie punk?', 2003, 'vinyl-7', 'split', 'A split with the Local Oafs.'),
             ('The Omega demos', 2003, 'cdr', 'ep', 'This demo was recorded in December 2003 in Omega Studios. Produced by Tommie from The Manikins.'),
             ('Dear wilderness without punctuation', 2006, 'cdr', 'ep', null),
             ('Olle vs. monkeyman', 2006, 'cdr', 'ep', null),
             ('Winter passing', 2007, 'cdr', 'ep', null),
             ('Laszlo Gönzi', 1995, 'cassette', 'ep', null),
             ('World''s easiest listening', 2000, 'cdr', 'ep', null),
             ('Last weeks leftovers', 1999, 'cassette', 'ep', 'Originally released on tape in 1999. As sort of a "bonus disc" to Only Happiness Remains.'),
             ('Lets fuck ep', 1999, 'cdr', 'ep', null),
             ('Only happiness remains', 1999, 'cassette', 'ep', 'Released in 1999. Recorded at home and at Fredrik in Sanningens Silverstudio. Guest vocalist - Marcus Andersson. Contains a lot of samples from the exellent movie - Romy & Michelle''s High School Reunion.'),
             ('The animal girls ep', 2000, 'cdr', 'ep', null),
             ('The Jennifer mistakes', 2001, 'cdr', 'ep', null),
             ('The pink wrestler ep', 2001, 'cdr', 'ep', null),
             ('A thousand places ep', 2002, 'cdr', 'ep', 'Was released on CD-R in 2002. A couple of early versions of future songs.'),
             ('Talking heads ep', 2002, 'cdr', 'ep', null),
             ('The Baseball Field and Mary ep', 2002, 'cdr', 'ep', null),
             ('A little sound ep', 2003, 'vinyl-7', 'ep', 'Was originally released on 7" vinyl in August 2003 as the first part of a trilogy (quadrilogy?). Other parts include A Thousand Places Lp and A Moment Later Lp. This will maybe be followed up by a future release entitled A New Hope Lp.'),
             ('A moment later lp', 2003, 'cdr', 'album', 'Was released on CD-R in 2003. The Third album in the A Little Sound trilogy.'),
             ('A thousand places lp', 2003, 'cdr', 'album', 'Was released on CD-R in October 2003. The Second album in the A Little Sound trilogy.'),
             ('Julsingel ''05', 2005, 'digital', 'single', null),
             ('TBF and mary sings the blues ep', 2007, 'digital', 'ep', null),
             ('The there and back again ep', 2007, 'digital', 'ep', null),
             ('Bat ep', 2008, 'digital', 'ep', null),
             ('Julsingel ''08', 2008, 'digital', 'single', null),
             ('Swindie', 2008, 'cdr', 'ep', null),
             ('Julsingel ''09', 2009, 'digital', 'single', null),
             ('Live Cosy Den Southside Cavern 0900925', 2009, 'cdr', 'ep', null),
             ('Manuale typographico ep', 2005, 'cdr', 'ep', null),
             ('Le malade imaginaire lp', 2007, 'cdr', 'album', null),
             ('Ruhpolding lp', 2008, 'cdr', 'album', null),
             ('Cutting edge ep', 2009, 'cdr', 'ep', null),
             ('Post mortem - a symphony of the dead', 2009, 'cdr', 'ep', 'Written and recorded at Sanningens Silverstudio spring/summer 2009. Released digitally on july 8, 2009. Also available on CD-R.'),
             ('Weihnachtswaffe', 2011, 'digital', 'ep', null),
             ('s/t', 2007, 'cdr', 'ep', 'The first record.'),
             ('Get aboard this ride!', 2008, 'cdr', 'ep', 'Another great ep!'),
             ('Melting like snow', 2009, 'cdr', 'single', 'A new record.'),
             ('Obituary mambo', 2010, 'cdr', 'ep', 'A new record.'),
             ('Live in Sanningens Silverstudio', 2006, 'digital', 'ep', 'Includes songs from a live rehearsal in Sanningens Silverstudio. Probably recorded in 2006.'),
             ('Bara bra musik #2', 2008, 'cdr', 'compilation', 'A compilation CD-R with some, if not all, of the most interesting and influential artists in Sweden at the time.')
     ) as t(name, year, format, type, description)
where not exists (
    select 1 from public.records r where r.name = t.name and r.year = t.year
);

-- 2. Link each record to its artist
insert into public.record_artists (record_id, artist_id, is_primary)
select r.id, a.id, true
from public.records r
         cross join lateral (
    select id from public.artists where slug = case
                                                   when r.name = 'Songs for the gluesniffin'' bastards' then '15th-22'
                                                   when r.name = 'Money and electricity' then 'a-blueprint'
                                                   when r.name = 'Demos' then 'boys-on-heroin'
                                                   when r.name = 'Platser där du aldrig varit' then 'fangorn'
                                                   when r.name = 'Galaxmästarens hatt' then 'h2o'
                                                   when r.name in ('Causes', 'The sound of...') then 'infact'
                                                   when r.name in ('Ambient dub', 'Shining through') then 'mc-bomb'
                                                   when r.name = 's/t' and r.year = 2002 then 'music-ninja'
                                                   when r.name in ('Promo 1', 'Essen sie punk?', 'The Omega demos') then 'music-ninja'
                                                   when r.name in ('Dear wilderness without punctuation', 'Olle vs. monkeyman', 'Winter passing') then 'olle'
                                                   when r.name = 'Laszlo Gönzi' then 'satans-galjonsfigurer'
                                                   when r.name = 'World''s easiest listening' then 'the-alabama-alcoholics'
                                                   when r.name in (
                                                                   'Last weeks leftovers',
                                                                   'Lets fuck ep',
                                                                   'Only happiness remains',
                                                                   'The animal girls ep',
                                                                   'The Jennifer mistakes',
                                                                   'The pink wrestler ep',
                                                                   'A thousand places ep',
                                                                   'Talking heads ep',
                                                                   'The Baseball Field and Mary ep',
                                                                   'A little sound ep',
                                                                   'A moment later lp',
                                                                   'A thousand places lp',
                                                                   'Julsingel ''05',
                                                                   'TBF and mary sings the blues ep',
                                                                   'The there and back again ep',
                                                                   'Bat ep',
                                                                   'Julsingel ''08',
                                                                   'Swindie',
                                                                   'Julsingel ''09',
                                                                   'Live Cosy Den Southside Cavern 0900925'
                                                       ) then 'the-baseball-field'
                                                   when r.name in (
                                                                   'Manuale typographico ep',
                                                                   'Le malade imaginaire lp',
                                                                   'Ruhpolding lp',
                                                                   'Cutting edge ep',
                                                                   'Post mortem - a symphony of the dead',
                                                                   'Weihnachtswaffe'
                                                       ) then 'the-bodonis'
                                                   when r.name = 's/t' and r.year = 2007 then 'the-catchers-of-the-westbound'
                                                   when r.name in (
                                                                   'Get aboard this ride!',
                                                                   'Melting like snow',
                                                                   'Obituary mambo'
                                                       ) then 'the-catchers-of-the-westbound'
                                                   when r.name = 'Live in Sanningens Silverstudio' then 'the-oxelosund'
                                                   when r.name = 'Bara bra musik #2' then 'various-artists'
        end
        ) a
    on conflict (record_id, artist_id) do nothing;

-- 3. Link secondary artist on the split release ('Essen sie punk?' -> Local Oafs)
insert into public.record_artists (record_id, artist_id, is_primary)
select r.id, a.id, false
from public.records r
         join public.artists a on a.slug = 'local-oafs'
where r.name = 'Essen sie punk?'
    on conflict (record_id, artist_id) do nothing;