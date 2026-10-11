-- 1. Helper temporary table containing all 274 songs with capitalized names
create temp table temp_seed_songs (
    record_name text not null,
    record_year integer not null,
    track_number integer not null,
    name text not null,
    artist_slug text not null
) on commit drop;

insert into temp_seed_songs (record_name, record_year, track_number, name, artist_slug)
values
    -- 15th 22 - Songs for the gluesniffin' bastards (1997)
    ('Songs for the gluesniffin'' bastards', 1997, 1, 'Song for the mentally impaired', '15th-22'),
    ('Songs for the gluesniffin'' bastards', 1997, 2, 'War of the cybernauts', '15th-22'),
    ('Songs for the gluesniffin'' bastards', 1997, 3, 'Minute 18', '15th-22'),
    ('Songs for the gluesniffin'' bastards', 1997, 4, 'Needful things (Latino version)', '15th-22'),
    ('Songs for the gluesniffin'' bastards', 1997, 5, 'Minimum carnage', '15th-22'),
    ('Songs for the gluesniffin'' bastards', 1997, 6, 'Faces the pig forgot', '15th-22'),
    ('Songs for the gluesniffin'' bastards', 1997, 7, 'Disarm (Smashing pumpkins cover)', '15th-22'),
    ('Songs for the gluesniffin'' bastards', 1997, 8, 'Needful things (Noise version)', '15th-22'),

    -- A blueprint - Money and electricity (1998)
    ('Money and electricity', 1998, 1, 'Money and Electricity', 'a-blueprint'),
    ('Money and electricity', 1998, 2, 'Money and Electricity part 2', 'a-blueprint'),
    ('Money and electricity', 1998, 3, 'A glorious day', 'a-blueprint'),
    ('Money and electricity', 1998, 4, 'Little pink books', 'a-blueprint'),

    -- Boys on heroin - Demos (2008)
    ('Demos', 2008, 1, 'Boh 1', 'boys-on-heroin'),
    ('Demos', 2008, 2, 'Boh 2', 'boys-on-heroin'),
    ('Demos', 2008, 3, 'Boh 3', 'boys-on-heroin'),
    ('Demos', 2008, 4, 'Boh 4', 'boys-on-heroin'),

    -- Fangorn - Platser där du aldrig varit (1998)
    ('Platser där du aldrig varit', 1998, 1, 'The stars', 'fangorn'),
    ('Platser där du aldrig varit', 1998, 2, 'In the house', 'fangorn'),
    ('Platser där du aldrig varit', 1998, 3, 'In the forest', 'fangorn'),

    -- H2O - Galaxmästarens hatt (1996)
    ('Galaxmästarens hatt', 1996, 1, 'Det osynliga pianot', 'h2o'),
    ('Galaxmästarens hatt', 1996, 2, 'Jag tror inte', 'h2o'),
    ('Galaxmästarens hatt', 1996, 3, 'Galaxmästarens hatt', 'h2o'),
    ('Galaxmästarens hatt', 1996, 4, 'Hallå dåren, Shut upp!', 'h2o'),
    ('Galaxmästarens hatt', 1996, 5, 'Sc fair / City blues highway', 'h2o'),
    ('Galaxmästarens hatt', 1996, 6, 'Barnvisa från helvetet', 'h2o'),
    ('Galaxmästarens hatt', 1996, 7, 'Små träd, stora män', 'h2o'),
    ('Galaxmästarens hatt', 1996, 8, 'UHC', 'h2o'),

    -- Infact - Causes (1998)
    ('Causes', 1998, 1, 'Things', 'infact'),
    ('Causes', 1998, 2, 'Asylum', 'infact'),
    ('Causes', 1998, 3, 'Where we walked', 'infact'),
    ('Causes', 1998, 4, 'Angel eyes', 'infact'),

    -- Infact - The sound of... (1998)
    ('The sound of...', 1998, 1, 'Superstar', 'infact'),
    ('The sound of...', 1998, 2, 'The great persuader', 'infact'),
    ('The sound of...', 1998, 3, 'Senseless song', 'infact'),

    -- MC Bomb - Ambient dub (2008)
    ('Ambient dub', 2008, 1, 'Slow stomp', 'mc-bomb'),
    ('Ambient dub', 2008, 2, 'Ambient dance', 'mc-bomb'),
    ('Ambient dub', 2008, 3, 'Weirdo', 'mc-bomb'),

    -- MC Bomb - Shining through (2009)
    ('Shining through', 2009, 1, 'My dreams are filled with longing', 'mc-bomb'),
    ('Shining through', 2009, 2, 'In a sea of unknown faces', 'mc-bomb'),
    ('Shining through', 2009, 3, 'At the end of the rainbow', 'mc-bomb'),
    ('Shining through', 2009, 4, 'Late night at the diner', 'mc-bomb'),
    ('Shining through', 2009, 5, 'Dark souls I', 'mc-bomb'),
    ('Shining through', 2009, 6, 'Dark souls II', 'mc-bomb'),
    ('Shining through', 2009, 7, 'In the Shadows', 'mc-bomb'),
    ('Shining through', 2009, 8, 'The black suite', 'mc-bomb'),

    -- Music / ninja - Promo 1 (2000)
    ('Promo 1', 2000, 1, 'Throw me to the raptors', 'music-ninja'),
    ('Promo 1', 2000, 2, 'Underground child', 'music-ninja'),
    ('Promo 1', 2000, 3, 'I wanna die (and it ain''t a lie)', 'music-ninja'),
    ('Promo 1', 2000, 4, 'A cop, a clown and a handgun', 'music-ninja'),
    ('Promo 1', 2000, 5, 'You lose', 'music-ninja'),

    -- Music / ninja - s/t (2002)
    ('s/t', 2002, 1, 'The record player and me', 'music-ninja'),
    ('s/t', 2002, 2, 'Donny donny', 'music-ninja'),
    ('s/t', 2002, 3, 'Underground child', 'music-ninja'),
    ('s/t', 2002, 4, 'My tv', 'music-ninja'),
    ('s/t', 2002, 5, 'A cop, a clown and a handgun', 'music-ninja'),
    ('s/t', 2002, 6, 'You can''t kill a ninja', 'music-ninja'),
    ('s/t', 2002, 7, 'Chika chika', 'music-ninja'),
    ('s/t', 2002, 8, 'Policeman', 'music-ninja'),

    -- Music / ninja - Essen sie punk? (2003)
    ('Essen sie punk?', 2003, 1, 'Just killing time', 'music-ninja'),
    ('Essen sie punk?', 2003, 2, 'Suburban flesh monkeys', 'music-ninja'),
    ('Essen sie punk?', 2003, 3, 'I make money', 'music-ninja'),

    -- Music / ninja - The Omega demos (2003)
    ('The Omega demos', 2003, 1, 'Throw me to the raptors', 'music-ninja'),
    ('The Omega demos', 2003, 2, 'Treble vs. bass', 'music-ninja'),
    ('The Omega demos', 2003, 3, '666 (baby baby)', 'music-ninja'),
    ('The Omega demos', 2003, 4, 'Underground child', 'music-ninja'),
    ('The Omega demos', 2003, 5, 'I wanna die (and it ain''t a lie)', 'music-ninja'),
    ('The Omega demos', 2003, 6, 'Saturday security', 'music-ninja'),
    ('The Omega demos', 2003, 7, 'A cop, a clown and a handgun', 'music-ninja'),
    ('The Omega demos', 2003, 8, 'Your music (sounds worse than your father''s)', 'music-ninja'),
    ('The Omega demos', 2003, 9, 'Hey baby (do you wanna get it on, maybe?)', 'music-ninja'),
    ('The Omega demos', 2003, 10, 'You lose', 'music-ninja'),
    ('The Omega demos', 2003, 11, 'I keep burning', 'music-ninja'),

    -- Olle - Dear wilderness without punctuation (2006)
    ('Dear wilderness without punctuation', 2006, 1, 'That you do', 'olle'),
    ('Dear wilderness without punctuation', 2006, 2, 'Mollys lips', 'olle'),
    ('Dear wilderness without punctuation', 2006, 3, 'Dear wilderness without punctuation', 'olle'),

    -- Olle - Olle vs. monkeyman (2006)
    ('Olle vs. monkeyman', 2006, 1, 'Ain''t the one', 'olle'),
    ('Olle vs. monkeyman', 2006, 2, 'Monkeyman', 'olle'),
    ('Olle vs. monkeyman', 2006, 3, 'Lights out', 'olle'),
    ('Olle vs. monkeyman', 2006, 4, 'Grant McLennan', 'olle'),
    ('Olle vs. monkeyman', 2006, 5, 'On a string', 'olle'),

    -- Olle - Winter passing (2007)
    ('Winter passing', 2007, 1, 'I could do', 'olle'),
    ('Winter passing', 2007, 2, 'I want out', 'olle'),
    ('Winter passing', 2007, 3, 'Winter passing', 'olle'),
    ('Winter passing', 2007, 4, 'My slow descent into chronic loneliness', 'olle'),
    ('Winter passing', 2007, 5, 'Old luck', 'olle'),
    ('Winter passing', 2007, 6, 'In between', 'olle'),
    ('Winter passing', 2007, 7, 'Poison of questions', 'olle'),
    ('Winter passing', 2007, 8, 'Saucy sailor', 'olle'),

    -- Satans galjonsfigurer - Laszlo Gönzi (1995)
    ('Laszlo Gönzi', 1995, 1, 'Hopak', 'satans-galjonsfigurer'),
    ('Laszlo Gönzi', 1995, 2, 'Häst', 'satans-galjonsfigurer'),
    ('Laszlo Gönzi', 1995, 3, 'Försäkringskassan', 'satans-galjonsfigurer'),
    ('Laszlo Gönzi', 1995, 4, 'Tusen år på månen', 'satans-galjonsfigurer'),
    ('Laszlo Gönzi', 1995, 5, 'Onsdagsvisan', 'satans-galjonsfigurer'),
    ('Laszlo Gönzi', 1995, 6, 'Emån', 'satans-galjonsfigurer'),
    ('Laszlo Gönzi', 1995, 7, 'När en glödlampa går sönder', 'satans-galjonsfigurer'),
    ('Laszlo Gönzi', 1995, 8, 'Sången om Gunnar', 'satans-galjonsfigurer'),

    -- The alabama alcoholics - World's easiest listening (2000)
    ('World''s easiest listening', 2000, 1, 'This is unacceptable', 'the-alabama-alcoholics'),
    ('World''s easiest listening', 2000, 2, 'Same old blues shit', 'the-alabama-alcoholics'),
    ('World''s easiest listening', 2000, 3, 'Coming here to fuck you up', 'the-alabama-alcoholics'),
    ('World''s easiest listening', 2000, 4, 'A delusion', 'the-alabama-alcoholics'),

    -- The baseball field - Last weeks leftovers (1999)
    ('Last weeks leftovers', 1999, 1, '30', 'the-baseball-field'),
    ('Last weeks leftovers', 1999, 2, 'Melancholy cataphasia song', 'the-baseball-field'),
    ('Last weeks leftovers', 1999, 3, 'Repulsion', 'the-baseball-field'),
    ('Last weeks leftovers', 1999, 4, 'One of them will fall', 'the-baseball-field'),
    ('Last weeks leftovers', 1999, 5, 'Planet', 'the-baseball-field'),
    ('Last weeks leftovers', 1999, 6, 'D''apres Loeuvre De Monsieur Leblanc', 'the-baseball-field'),
    ('Last weeks leftovers', 1999, 7, 'Dancing in the pit of carcoon', 'the-baseball-field'),
    ('Last weeks leftovers', 1999, 8, 'Ned needs help', 'the-baseball-field'),
    ('Last weeks leftovers', 1999, 9, 'The chisel', 'the-baseball-field'),
    ('Last weeks leftovers', 1999, 10, 'The bad inhalator', 'the-baseball-field'),

    -- The baseball field - Lets fuck ep (1999)
    ('Lets fuck ep', 1999, 1, 'Let''s fuck', 'the-baseball-field'),
    ('Lets fuck ep', 1999, 2, 'Instrumental injury No. 2', 'the-baseball-field'),
    ('Lets fuck ep', 1999, 3, 'Delete when done', 'the-baseball-field'),
    ('Lets fuck ep', 1999, 4, 'Seppuku', 'the-baseball-field'),
    ('Lets fuck ep', 1999, 5, 'The situation (Let''s fuck version)', 'the-baseball-field'),

    -- The baseball field - Only happiness remains (1999)
    ('Only happiness remains', 1999, 1, 'A strange day (The cure cover)', 'the-baseball-field'),
    ('Only happiness remains', 1999, 2, 'Verbal', 'the-baseball-field'),
    ('Only happiness remains', 1999, 3, 'I''d rather put this put in my ass', 'the-baseball-field'),
    ('Only happiness remains', 1999, 4, 'This is abatoir', 'the-baseball-field'),
    ('Only happiness remains', 1999, 5, 'Breakbeat / Fuzz', 'the-baseball-field'),
    ('Only happiness remains', 1999, 6, 'Publique', 'the-baseball-field'),

    -- The baseball field - The animal girls ep (2000)
    ('The animal girls ep', 2000, 1, 'Animal girl', 'the-baseball-field'),
    ('The animal girls ep', 2000, 2, 'The lemon 50cl', 'the-baseball-field'),
    ('The animal girls ep', 2000, 3, 'Kennedy', 'the-baseball-field'),
    ('The animal girls ep', 2000, 4, 'Pulse', 'the-baseball-field'),
    ('The animal girls ep', 2000, 5, 'Surf Cowboy', 'the-baseball-field'),

    -- The baseball field - The Jennifer mistakes (2001)
    ('The Jennifer mistakes', 2001, 1, 'A minute before the crash', 'the-baseball-field'),
    ('The Jennifer mistakes', 2001, 2, 'Make use of wish', 'the-baseball-field'),
    ('The Jennifer mistakes', 2001, 3, 'The Jennifer mistakes', 'the-baseball-field'),

    -- The baseball field - The pink wrestler ep (2001)
    ('The pink wrestler ep', 2001, 1, 'Baseball star', 'the-baseball-field'),
    ('The pink wrestler ep', 2001, 2, 'Christina', 'the-baseball-field'),
    ('The pink wrestler ep', 2001, 3, 'Make use of wish', 'the-baseball-field'),
    ('The pink wrestler ep', 2001, 4, 'Pink wrestler', 'the-baseball-field'),
    ('The pink wrestler ep', 2001, 5, 'Slide show', 'the-baseball-field'),
    ('The pink wrestler ep', 2001, 6, 'The ring', 'the-baseball-field'),

    -- The baseball field - A thousand places ep (2002)
    ('A thousand places ep', 2002, 1, 'A thousand places and from nowhere at all - demo version', 'the-baseball-field'),
    ('A thousand places ep', 2002, 2, 'Cheerio cheerio', 'the-baseball-field'),
    ('A thousand places ep', 2002, 3, 'Every day can''t be sunshine', 'the-baseball-field'),
    ('A thousand places ep', 2002, 4, 'Flowers and wine', 'the-baseball-field'),
    ('A thousand places ep', 2002, 5, 'Pass time', 'the-baseball-field'),
    ('A thousand places ep', 2002, 6, 'Uninteresting people talking about uninteresting things', 'the-baseball-field'),

    -- The baseball field - Talking heads ep (2002)
    ('Talking heads ep', 2002, 1, 'Mr punch', 'the-baseball-field'),
    ('Talking heads ep', 2002, 2, 'Unknown pt 1', 'the-baseball-field'),
    ('Talking heads ep', 2002, 3, 'Unknown pt 2', 'the-baseball-field'),
    ('Talking heads ep', 2002, 4, 'Unknown pt 3', 'the-baseball-field'),
    ('Talking heads ep', 2002, 5, 'Good times', 'the-baseball-field'),
    ('Talking heads ep', 2002, 6, 'The terry funk', 'the-baseball-field'),

    -- The baseball field - The Baseball Field and Mary ep (2002)
    ('The Baseball Field and Mary ep', 2002, 1, 'Bad fur day', 'the-baseball-field'),
    ('The Baseball Field and Mary ep', 2002, 2, 'Come back better', 'the-baseball-field'),
    ('The Baseball Field and Mary ep', 2002, 3, 'Friends for life', 'the-baseball-field'),
    ('The Baseball Field and Mary ep', 2002, 4, 'Fun fun fun', 'the-baseball-field'),
    ('The Baseball Field and Mary ep', 2002, 5, 'Kill lies all', 'the-baseball-field'),
    ('The Baseball Field and Mary ep', 2002, 6, 'The Baseball Field and Mary', 'the-baseball-field'),
    ('The Baseball Field and Mary ep', 2002, 7, 'Two seconds before the crash', 'the-baseball-field'),

    -- The baseball field - A little sound ep (2003)
    ('A little sound ep', 2003, 1, 'A minute before the crash', 'the-baseball-field'),
    ('A little sound ep', 2003, 2, 'Flowers and wine - vinyl version', 'the-baseball-field'),
    ('A little sound ep', 2003, 3, 'I''ll burn tomorrow', 'the-baseball-field'),
    ('A little sound ep', 2003, 4, 'The Jennifer mistakes', 'the-baseball-field'),
    ('A little sound ep', 2003, 5, 'All amusement parks are closed', 'the-baseball-field'),
    ('A little sound ep', 2003, 6, 'Come back better', 'the-baseball-field'),
    ('A little sound ep', 2003, 7, 'Ghost story', 'the-baseball-field'),
    ('A little sound ep', 2003, 8, 'Happiness', 'the-baseball-field'),
    ('A little sound ep', 2003, 9, 'I just made a little sound', 'the-baseball-field'),

    -- The baseball field - A moment later lp (2003)
    ('A moment later lp', 2003, 1, 'We Are the Baseball Field', 'the-baseball-field'),
    ('A moment later lp', 2003, 2, 'When was the last time you did something for the first time', 'the-baseball-field'),
    ('A moment later lp', 2003, 3, 'Hearts', 'the-baseball-field'),
    ('A moment later lp', 2003, 4, 'The birds sang of love', 'the-baseball-field'),
    ('A moment later lp', 2003, 5, 'A moment later', 'the-baseball-field'),
    ('A moment later lp', 2003, 6, 'Always on my mind', 'the-baseball-field'),
    ('A moment later lp', 2003, 7, 'Ten bells', 'the-baseball-field'),
    ('A moment later lp', 2003, 8, 'You made me realise', 'the-baseball-field'),
    ('A moment later lp', 2003, 9, 'Winter trees', 'the-baseball-field'),
    ('A moment later lp', 2003, 10, 'Some days sundays make me sad', 'the-baseball-field'),
    ('A moment later lp', 2003, 11, 'This is where our story ends', 'the-baseball-field'),

    -- The baseball field - A thousand places lp (2003)
    ('A thousand places lp', 2003, 1, 'Last night', 'the-baseball-field'),
    ('A thousand places lp', 2003, 2, 'The bad dream', 'the-baseball-field'),
    ('A thousand places lp', 2003, 3, 'Everyone I''ve ever known', 'the-baseball-field'),
    ('A thousand places lp', 2003, 4, 'Mark evans', 'the-baseball-field'),
    ('A thousand places lp', 2003, 5, 'The situation', 'the-baseball-field'),
    ('A thousand places lp', 2003, 6, 'Every day can''t be sunshine', 'the-baseball-field'),
    ('A thousand places lp', 2003, 7, 'Rogue', 'the-baseball-field'),
    ('A thousand places lp', 2003, 8, 'A thousand places and from nowhere at all', 'the-baseball-field'),
    ('A thousand places lp', 2003, 9, 'Tambourines', 'the-baseball-field'),
    ('A thousand places lp', 2003, 10, 'Monday morning picnic', 'the-baseball-field'),
    ('A thousand places lp', 2003, 11, 'Too happy to say goodbye', 'the-baseball-field'),

    -- The baseball field - Julsingel '05 (2005)
    ('Julsingel ''05', 2005, 1, 'In a lonely place', 'the-baseball-field'),
    ('Julsingel ''05', 2005, 2, 'There is no such thing as a sun', 'the-baseball-field'),

    -- The baseball field - TBF and mary sings the blues ep (2007)
    ('TBF and mary sings the blues ep', 2007, 1, 'Avenues', 'the-baseball-field'),
    ('TBF and mary sings the blues ep', 2007, 2, 'Baroqueing at the moon', 'the-baseball-field'),
    ('TBF and mary sings the blues ep', 2007, 3, 'Blankets', 'the-baseball-field'),
    ('TBF and mary sings the blues ep', 2007, 4, 'Britta', 'the-baseball-field'),
    ('TBF and mary sings the blues ep', 2007, 5, 'Bubbles', 'the-baseball-field'),
    ('TBF and mary sings the blues ep', 2007, 6, 'Here he comes (He''s all dressed in black)', 'the-baseball-field'),
    ('TBF and mary sings the blues ep', 2007, 7, 'I will probably never see you again', 'the-baseball-field'),

    -- The baseball field - The there and back again ep (2007)
    ('The there and back again ep', 2007, 1, 'But there was no snow', 'the-baseball-field'),
    ('The there and back again ep', 2007, 2, 'Idaho', 'the-baseball-field'),
    ('The there and back again ep', 2007, 3, 'The art of making ice', 'the-baseball-field'),
    ('The there and back again ep', 2007, 4, 'The ghosts of men', 'the-baseball-field'),
    ('The there and back again ep', 2007, 5, 'There and back again', 'the-baseball-field'),
    ('The there and back again ep', 2007, 6, 'There are wolves around us', 'the-baseball-field'),

    -- The baseball field - Bat ep (2008)
    ('Bat ep', 2008, 1, 'Ash', 'the-baseball-field'),
    ('Bat ep', 2008, 2, 'Bats', 'the-baseball-field'),
    ('Bat ep', 2008, 3, 'Happy times', 'the-baseball-field'),
    ('Bat ep', 2008, 4, 'New waves', 'the-baseball-field'),
    ('Bat ep', 2008, 5, 'Supercemetery', 'the-baseball-field'),

    -- The baseball field - Julsingel '08 (2008)
    ('Julsingel ''08', 2008, 1, 'It''s boxing day again Helena', 'the-baseball-field'),
    ('Julsingel ''08', 2008, 2, 'Happy holidays', 'the-baseball-field'),

    -- The baseball field - Swindie (2008)
    ('Swindie', 2008, 1, 'Comicon ''09', 'the-baseball-field'),
    ('Swindie', 2008, 2, 'It''s time', 'the-baseball-field'),
    ('Swindie', 2008, 3, 'Numbers', 'the-baseball-field'),
    ('Swindie', 2008, 4, '1986', 'the-baseball-field'),
    ('Swindie', 2008, 5, 'Twenty four hours', 'the-baseball-field'),
    ('Swindie', 2008, 6, '15 Minutes', 'the-baseball-field'),
    ('Swindie', 2008, 7, '4:50 To the moon', 'the-baseball-field'),

    -- The baseball field - Julsingel '09 (2009)
    ('Julsingel ''09', 2009, 1, 'I wonder what christmas feels like', 'the-baseball-field'),

    -- The baseball field - Live Cosy Den Southside Cavern 0900925 (2009)
    ('Live Cosy Den Southside Cavern 0900925', 2009, 1, '1986 - Live Cosy Den', 'the-baseball-field'),
    ('Live Cosy Den Southside Cavern 0900925', 2009, 2, 'A Thousand Places - Live Cosy Den', 'the-baseball-field'),
    ('Live Cosy Den Southside Cavern 0900925', 2009, 3, 'Bats - Live Cosy Den', 'the-baseball-field'),
    ('Live Cosy Den Southside Cavern 0900925', 2009, 4, 'Comicon - Live Cosy Den', 'the-baseball-field'),
    ('Live Cosy Den Southside Cavern 0900925', 2009, 5, 'Girl from mars - Live Cosy Den', 'the-baseball-field'),
    ('Live Cosy Den Southside Cavern 0900925', 2009, 6, 'Supercemetery - Live Cosy Den', 'the-baseball-field'),
    ('Live Cosy Den Southside Cavern 0900925', 2009, 7, 'There is no such thing as a sun - Live Cosy Den', 'the-baseball-field'),

    -- The bodonis - Manuale typographico ep (2005)
    ('Manuale typographico ep', 2005, 1, 'Ornaments', 'the-bodonis'),
    ('Manuale typographico ep', 2005, 2, 'The duke of parma theme', 'the-bodonis'),
    ('Manuale typographico ep', 2005, 3, 'Silent typographer', 'the-bodonis'),
    ('Manuale typographico ep', 2005, 4, 'Exit / No exit (Where is John Baskerville now?)', 'the-bodonis'),

    -- The bodonis - Le malade imaginaire lp (2007)
    ('Le malade imaginaire lp', 2007, 1, 'Ian McDiarmid', 'the-bodonis'),
    ('Le malade imaginaire lp', 2007, 2, 'Pelosi', 'the-bodonis'),
    ('Le malade imaginaire lp', 2007, 3, 'First Take Second Base', 'the-bodonis'),
    ('Le malade imaginaire lp', 2007, 4, 'Laos Baboon', 'the-bodonis'),
    ('Le malade imaginaire lp', 2007, 5, 'Instant coffee', 'the-bodonis'),
    ('Le malade imaginaire lp', 2007, 6, 'Kati', 'the-bodonis'),
    ('Le malade imaginaire lp', 2007, 7, 'Världens starkaste man', 'the-bodonis'),
    ('Le malade imaginaire lp', 2007, 8, 'Boy Division', 'the-bodonis'),
    ('Le malade imaginaire lp', 2007, 9, 'Dagi dagi dagis', 'the-bodonis'),
    ('Le malade imaginaire lp', 2007, 10, 'Frode', 'the-bodonis'),

    -- The bodonis - Ruhpolding lp (2008)
    ('Ruhpolding lp', 2008, 1, 'Jämtland', 'the-bodonis'),
    ('Ruhpolding lp', 2008, 2, 'Mullet guitar', 'the-bodonis'),
    ('Ruhpolding lp', 2008, 3, 'Hyper func system', 'the-bodonis'),
    ('Ruhpolding lp', 2008, 4, 'Antikrundan', 'the-bodonis'),
    ('Ruhpolding lp', 2008, 5, 'Björn Ferry sexy music', 'the-bodonis'),
    ('Ruhpolding lp', 2008, 6, 'Easter punk day', 'the-bodonis'),
    ('Ruhpolding lp', 2008, 7, 'French threat day', 'the-bodonis'),
    ('Ruhpolding lp', 2008, 8, 'Axe wielding terror horrors of the apocalypse', 'the-bodonis'),
    ('Ruhpolding lp', 2008, 9, 'Dürch für gegen ohne um', 'the-bodonis'),
    ('Ruhpolding lp', 2008, 10, 'My special little guy', 'the-bodonis'),
    ('Ruhpolding lp', 2008, 11, 'Smells like middle-aged men', 'the-bodonis'),
    ('Ruhpolding lp', 2008, 12, 'At the incest', 'the-bodonis'),

    -- The bodonis - Cutting edge ep (2009)
    ('Cutting edge ep', 2009, 1, 'Cutting edge', 'the-bodonis'),
    ('Cutting edge ep', 2009, 2, 'Fight the fight (with clubs)', 'the-bodonis'),
    ('Cutting edge ep', 2009, 3, 'Aus Bei Mit Nach Von Zu', 'the-bodonis'),
    ('Cutting edge ep', 2009, 4, 'All the past robotics', 'the-bodonis'),

    -- The bodonis - Post mortem - a symphony of the dead (2009)
    ('Post mortem - a symphony of the dead', 2009, 1, 'Death', 'the-bodonis'),
    ('Post mortem - a symphony of the dead', 2009, 2, 'Autopsy', 'the-bodonis'),
    ('Post mortem - a symphony of the dead', 2009, 3, 'Funeral', 'the-bodonis'),
    ('Post mortem - a symphony of the dead', 2009, 4, 'Afterlife', 'the-bodonis'),

    -- The bodonis - Weihnachtswaffe (2011)
    ('Weihnachtswaffe', 2011, 1, 'Fikapaus', 'the-bodonis'),
    ('Weihnachtswaffe', 2011, 2, 'Prancer', 'the-bodonis'),
    ('Weihnachtswaffe', 2011, 3, 'Spacemas shuffle', 'the-bodonis'),
    ('Weihnachtswaffe', 2011, 4, 'Sekelskiftet', 'the-bodonis'),

    -- The catchers of the westbound - s/t (2007)
    ('s/t', 2007, 1, 'When you listen to this I am dead', 'the-catchers-of-the-westbound'),
    ('s/t', 2007, 2, 'Endless winters, sleepless nights', 'the-catchers-of-the-westbound'),
    ('s/t', 2007, 3, 'Replace these hands with knives', 'the-catchers-of-the-westbound'),
    ('s/t', 2007, 4, 'Let''s stay out in the cold', 'the-catchers-of-the-westbound'),

    -- The catchers of the westbound - Get aboard this ride! (2008)
    ('Get aboard this ride!', 2008, 1, 'Lets end this', 'the-catchers-of-the-westbound'),
    ('Get aboard this ride!', 2008, 2, 'Cage match', 'the-catchers-of-the-westbound'),
    ('Get aboard this ride!', 2008, 3, 'Lie down in the gutter', 'the-catchers-of-the-westbound'),
    ('Get aboard this ride!', 2008, 4, 'Food for thought', 'the-catchers-of-the-westbound'),

    -- The catchers of the westbound - Melting like snow (2009)
    ('Melting like snow', 2009, 1, 'Melting like snow', 'the-catchers-of-the-westbound'),
    ('Melting like snow', 2009, 2, 'I bear a grudge', 'the-catchers-of-the-westbound'),

    -- The catchers of the westbound - Obituary mambo (2010)
    ('Obituary mambo', 2010, 1, 'Hi!', 'the-catchers-of-the-westbound'),
    ('Obituary mambo', 2010, 2, 'The Dead', 'the-catchers-of-the-westbound'),
    ('Obituary mambo', 2010, 3, 'Planes in the sky', 'the-catchers-of-the-westbound'),
    ('Obituary mambo', 2010, 4, 'The evil empire', 'the-catchers-of-the-westbound'),

    -- The Oxelösund - Live in Sanningens Silverstudio (2006)
    ('Live in Sanningens Silverstudio', 2006, 1, 'Absinthe', 'the-oxelosund'),
    ('Live in Sanningens Silverstudio', 2006, 2, 'Blankets', 'the-oxelosund'),
    ('Live in Sanningens Silverstudio', 2006, 3, 'Empty suits', 'the-oxelosund'),
    ('Live in Sanningens Silverstudio', 2006, 4, 'Geek Oxelösund', 'the-oxelosund'),
    ('Live in Sanningens Silverstudio', 2006, 5, 'Hearts', 'the-oxelosund'),
    ('Live in Sanningens Silverstudio', 2006, 6, 'Holes or horses', 'the-oxelosund'),
    ('Live in Sanningens Silverstudio', 2006, 7, 'Where have you gone?', 'the-oxelosund'),

    -- Various artists - Bara bra musik #2 (2008)
    ('Bara bra musik #2', 2008, 1, 'Avenues (Lined with trees)', 'the-baseball-field'),
    ('Bara bra musik #2', 2008, 2, 'The javelin Karnebjer', 'the-bodonis'),
    ('Bara bra musik #2', 2008, 3, 'Grandpa', 'les-burlesques'),
    ('Bara bra musik #2', 2008, 4, 'Hold on to your hate', 'the-catchers-of-the-westbound'),
    ('Bara bra musik #2', 2008, 5, 'Dread eye', 'the-dub-liner'),
    ('Bara bra musik #2', 2008, 6, 'Free flying fantasy for fifteen filthy fingers', 'duo-lubor'),
    ('Bara bra musik #2', 2008, 7, 'The code', 'mc-bomb'),
    ('Bara bra musik #2', 2008, 8, 'A rock in the woods', 'models-inc'),
    ('Bara bra musik #2', 2008, 9, 'Cheese on bread', 'models-inc'),
    ('Bara bra musik #2', 2008, 10, 'You can''t kill a ninja (pig ape mix)', 'music-ninja'),
    ('Bara bra musik #2', 2008, 11, 'I could do', 'olle'),
    ('Bara bra musik #2', 2008, 12, 'Goodfellow hayride', 'olle'),
    ('Bara bra musik #2', 2008, 13, 'Cherry pie', 'some-fuzz'),
    ('Bara bra musik #2', 2008, 14, 'Likewise', 'spit-junction'),
    ('Bara bra musik #2', 2008, 15, 'Fox in a hurry to cross the ice', 'fred-swanson'),
    ('Bara bra musik #2', 2008, 16, 'Hattarna', 'okenbroderna');

-- 2. Insert into public.songs with empty audio_path
insert into public.songs (id, record_id, track_number, name, audio_path)
select
    gen_random_uuid(),
    r.id,
    s.track_number,
    s.name,
    ''
from temp_seed_songs s
         join public.records r
              on r.name = s.record_name
                  and r.year = s.record_year
where not exists (
    select 1
    from public.songs existing
    where existing.record_id = r.id
      and existing.name = s.name
      and existing.track_number = s.track_number
);

-- 3. Link each song to its performing artist in public.song_artists
insert into public.song_artists (song_id, artist_id, is_primary)
select
    song.id,
    art.id,
    true
from temp_seed_songs s
         join public.records r
              on r.name = s.record_name
                  and r.year = s.record_year
         join public.songs song
              on song.record_id = r.id
                  and song.name = s.name
                  and song.track_number = s.track_number
         join public.artists art
              on art.slug = s.artist_slug
    on conflict (song_id, artist_id) do nothing;