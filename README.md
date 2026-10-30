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

Page-specific breadcrumbs belong inside this landmark, before the page heading
and outside any multi-column row. When adding breadcrumbs to admin pages, render
them in `AdminPageLayout` before its `<h1>`; on the artist detail page, place them
before the two-column row. Keep breadcrumbs out of the global site header.

Use labelled `<section>` elements for primary-content groups such as admin
editors and artist details. Reserve `<aside>` for genuinely supplementary content,
not simply content displayed in a side column.

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
