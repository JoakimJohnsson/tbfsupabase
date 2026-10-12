import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { EmptyStateCard } from "./EmptyStateCard";

describe("EmptyStateCard", () => {
    it("renders a flat tertiary card with comfortable body padding", () => {
        expect(renderToStaticMarkup(<EmptyStateCard message="No records" />)).toBe(
            '<div class="card bg-body-tertiary border-0 shadow-none text-center text-muted"><div class="card-body p-4">No records</div></div>',
        );
    });

    it("preserves custom classes and ReactNode messages", () => {
        expect(renderToStaticMarkup(<EmptyStateCard className="mb-4" message={<span>No artists</span>} />)).toBe(
            '<div class="card bg-body-tertiary border-0 shadow-none text-center text-muted mb-4"><div class="card-body p-4"><span>No artists</span></div></div>',
        );
    });
});
