import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Card } from "./Card";
import { CardBody } from "./CardBody";

describe("Card", () => {
    it("defaults to a secondary background with a borderless shadow", () => {
        expect(renderToStaticMarkup(<Card>Content</Card>)).toBe(
            '<div class="card bg-body-secondary border-0 shadow-sm">Content</div>',
        );
    });

    it.each([
        ["default", "border-0 shadow-sm"],
        ["outlined", "border shadow-none"],
        ["flat", "border-0 shadow-none"],
    ] as const)("renders the %s variant", (variant, classes) => {
        expect(renderToStaticMarkup(<Card variant={variant} />)).toContain(classes);
    });

    it.each([
        ["body", "bg-body"],
        ["secondary", "bg-body-secondary"],
        ["tertiary", "bg-body-tertiary"],
    ] as const)("renders the %s background independently of the variant", (background, classes) => {
        expect(renderToStaticMarkup(<Card variant="outlined" background={background} />)).toBe(
            `<div class="card ${classes} border shadow-none"></div>`,
        );
    });

    it("preserves custom classes, HTML attributes, and children", () => {
        expect(
            renderToStaticMarkup(
                <Card className="mb-4" id="members" aria-label="Members">
                    Content
                </Card>,
            ),
        ).toBe(
            '<div id="members" aria-label="Members" class="card bg-body-secondary border-0 shadow-sm mb-4">Content</div>',
        );
    });
});

describe("CardBody", () => {
    it("defaults to normal padding", () => {
        expect(renderToStaticMarkup(<CardBody>Content</CardBody>)).toBe('<div class="card-body p-3">Content</div>');
    });

    it("supports comfortable padding and forwards HTML attributes", () => {
        expect(
            renderToStaticMarkup(
                <CardBody padding="comfortable" className="text-center" id="prompt">
                    Content
                </CardBody>,
            ),
        ).toBe('<div id="prompt" class="card-body p-4 text-center">Content</div>');
    });

    it("keeps images outside the padded body", () => {
        expect(
            renderToStaticMarkup(
                <Card>
                    <div className="card-img-top">Image</div>
                    <CardBody>Content</CardBody>
                </Card>,
            ),
        ).toBe(
            '<div class="card bg-body-secondary border-0 shadow-sm"><div class="card-img-top">Image</div><div class="card-body p-3">Content</div></div>',
        );
    });
});
