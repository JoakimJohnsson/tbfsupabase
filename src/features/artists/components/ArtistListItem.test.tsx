import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
import type { Artist } from "../../../types";
import { ArtistListItem } from "./ArtistListItem";

const artist: Artist = {
    id: "artist-1",
    created_at: "2026-10-12T00:00:00Z",
    name: "Example Artist",
    slug: "example-artist",
    description: "Artist biography",
    image_path: null,
};

describe("ArtistListItem", () => {
    it("keeps the default row free of card styling and padding", () => {
        const markup = renderToStaticMarkup(
            <MemoryRouter>
                <ArtistListItem artist={artist} to="/artists/example-artist" />
            </MemoryRouter>,
        );

        expect(markup).toContain('class="tbf-artist-list-item tbf-artist-list-item--row"');
        expect(markup).toContain('class="tbf-artist-list-item__body"');
        expect(markup).toContain("tbf-artist-list-item__name stretched-link");
        expect(markup).toContain('href="/artists/example-artist"');
        expect(markup).toContain("tbf-artist-list-item__description--row");
        expect(markup).not.toContain("card-body");
        expect(markup).not.toContain("bg-body-secondary");
    });

    it("uses the standard secondary card and padded body for tiles", () => {
        const markup = renderToStaticMarkup(
            <MemoryRouter>
                <ArtistListItem artist={artist} to="/artists/example-artist" variant="card" />
            </MemoryRouter>,
        );

        expect(markup).toContain(
            'class="card bg-body-secondary border-0 shadow-sm tbf-artist-list-item tbf-artist-list-item--card h-100"',
        );
        expect(markup).toContain('class="card-body p-3 tbf-artist-list-item__body d-flex flex-column"');
        expect(markup).toContain("tbf-artist-list-item__description--card");
        expect(markup).toContain('href="/artists/example-artist"');
        expect(markup).not.toContain("stretched-link");
        expect(markup.indexOf("tbf-artist-list-item__media")).toBeLessThan(markup.indexOf("card-body"));
    });

    it.each(["row", "card"] as const)("renders initials and an unlinked name in the %s variant", (variant) => {
        const markup = renderToStaticMarkup(
            <ArtistListItem artist={{ ...artist, description: null }} variant={variant} />,
        );

        expect(markup).toContain('<span class="tbf-artist-list-item__initial">E</span>');
        expect(markup).toContain('<span class="tbf-artist-list-item__name">Example Artist</span>');
        expect(markup).not.toContain("<a ");
        expect(markup).not.toContain("<p ");
    });

    it.each(["row", "card"] as const)("preserves image source and accessible text in the %s variant", (variant) => {
        const markup = renderToStaticMarkup(
            <ArtistListItem artist={{ ...artist, image_path: "/artist.jpg" }} variant={variant} />,
        );

        expect(markup).toContain('alt="Example Artist"');
        expect(markup).toContain('class="tbf-artist-list-item__image"');
        expect(markup).toContain('src="/artist.jpg"');
        expect(markup).not.toContain("tbf-artist-list-item__initial");
    });
});
