// Examples:
// The Baseball Field
// → the-baseball-field
//
// Motörhead
// → motorhead

export const createArtistSlug = (name: string): string | null => {
    const slug = name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    if (!slug) {
        return null;
    }

    return slug;
};
