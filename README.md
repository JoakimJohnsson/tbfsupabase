# TBF Supabase project 2.0

* Prod - https://www.thebaseballfield.se/
* GitHub - https://github.com/JoakimJohnsson/tbfsupabase
* Supabase - https://app.supabase.com/projects

## TODO

- Prepare app for i18n
- I will have only en for now but be prepared for other languages
- Continue with app skeleton

## Page structure

`SiteLayout` owns the single `<main id="main-content">` around the route outlet.
Pages and nested layouts must not add another `<main>`. This keeps page headings,
forms, lists, and loading/error states inside the same main landmark.

`SiteLayout` also owns the shared fluid container and page gutters. Full-width
pages and nested layouts should use fragments rather than another container.
Place Bootstrap columns inside rows; rows can sit directly in the shared
container or in unpadded page sections. The login page intentionally uses a
centered, responsive `.container` to constrain its form width.

Page-specific breadcrumbs belong inside this landmark, before the page heading
and outside any multi-column row. When adding breadcrumbs to admin pages, render
them in `AdminPageLayout` before its `<h1>`; on the artist detail page, place them
before the two-column row. Keep breadcrumbs out of the global site header.

Use labelled `<section>` elements for primary-content groups such as admin
editors and artist details. Reserve `<aside>` for genuinely supplementary content,
not simply content displayed in a side column.

## Audio player

`PlayerProvider` wraps the router so playback survives page navigation.
`SiteLayout` renders `BottomPlayer` at the bottom of the viewport once a song is
selected, including while paused. It shares the song-list playback state and
provides play/pause, elapsed and total time, seeking, and volume controls.
The timeline is enabled after audio metadata loads; volume is retained across
song changes. Playback failures are shown in the player.

Starting a song in `SongList` captures that list's displayed order as the queue.
When a track ends, the next track with an audio path starts automatically.
Tracks without audio are skipped and playback stops at the end without looping.
`playNext()` and `playPrevious()` move to the next or previous playable track,
starting it from the beginning; at queue boundaries they leave playback unchanged.
Pausing, resuming from `BottomPlayer`, and page navigation retain the queue.
Starting a different song without a supplied list creates a single-song queue.
`BottomPlayer` includes previous/next buttons, disabled at queue boundaries.
Closing the player stops and unloads the audio, clears the queue and timing,
and hides the player until another song is selected. Volume is retained.

The Shuffle button toggles a randomized queue with the current track first,
without interrupting playback. Each other playable track follows once, without
looping; previous/next follow that same shuffled order. Turning shuffle off
restores the original list order while keeping the current track and position.
Shuffle stays enabled across pause, navigation, and new list selections, but
resets when the player is closed.

Repeat is a separate toggle that wraps the queue in both directions, including
a single-track queue. With shuffle enabled, repeat loops the same shuffled order.
Both toggles reset on close. Logged-in users can start TBF Radio from the home
page: it loads the full song catalogue in pages, skips tracks without audio,
and starts a random track with shuffle and repeat enabled.

## Local files - Git ignored

### Font Awesome

A Pro version of Font Awesome is used. Add a file called .npmrc in the root folder. It should have the following properties:

```
@fortawesome:registry=https://npm.fontawesome.com/
//npm.fontawesome.com/:_authToken=< Ask Admin for token >
```

Just add the correct token. Otherwise, you might get this error when doing `npm install`:

```
npm error Incorrect or missing password.
```
