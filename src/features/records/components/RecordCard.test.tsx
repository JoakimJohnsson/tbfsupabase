import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
import "../../../i18n/i18n";
import type { RecordWithArtists } from "../../../types";
import { RecordCard } from "./RecordCard";

const record: RecordWithArtists = {
    id: "record-1",
    name: "Example Record",
    description: null,
    cover_path: null,
    created_at: "2026-10-12T00:00:00Z",
    format: null,
    type: null,
    year: null,
    record_artists: [],
};

describe("RecordCard", () => {
    it("links the title to the record detail page with a card-wide click target", () => {
        const markup = renderToStaticMarkup(
            <MemoryRouter>
                <RecordCard record={record} to={`/records/${record.id}`} showTrackCount />
            </MemoryRouter>,
        );

        expect(markup).toContain('class="stretched-link d-block"');
        expect(markup).toContain('href="/records/record-1"');
        expect(markup).toContain('<span class="d-block text-truncate">Example Record</span></a>');
        expect(markup).toContain('<h3 class="h6 fw-bold mb-1"');
        expect(markup).not.toContain('class="h6 fw-bold mb-1 text-truncate"');
    });

    it("keeps cards without a destination unlinked", () => {
        const markup = renderToStaticMarkup(<RecordCard record={record} />);

        expect(markup).toContain('<span class="d-block text-truncate">Example Record</span>');
        expect(markup).not.toContain("<a ");
    });
});
