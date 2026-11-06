export const shuffle = <T>(items: readonly T[]): T[] => {
    const shuffled = [...items];

    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
};

export const CATALOGUE_SORTS = ["year-desc", "year-asc", "title"] as const;
export type CatalogueSort = (typeof CATALOGUE_SORTS)[number];

export const sortCatalogue = <T extends { name: string }>(
    items: readonly T[],
    sort: CatalogueSort,
    getYear: (item: T) => number | null | undefined,
    language: string,
): T[] => {
    return [...items].sort((a, b) => {
        if (sort !== "title") {
            const yearA = getYear(a);
            const yearB = getYear(b);
            if (yearA == null && yearB != null) return 1;
            if (yearA != null && yearB == null) return -1;
            if (yearA != null && yearB != null && yearA !== yearB) {
                return sort === "year-asc" ? yearA - yearB : yearB - yearA;
            }
        }
        return a.name.localeCompare(b.name, language);
    });
};

export const sortSongsByTrackNumber = <T extends { track_number: number | null; name: string }>(songs: T[]): T[] => {
    return [...songs].sort((a, b) => {
        if (a.track_number === null && b.track_number === null) return a.name.localeCompare(b.name, "sv");
        if (a.track_number === null) return 1;
        if (b.track_number === null) return -1;
        if (a.track_number !== b.track_number) return a.track_number - b.track_number;
        return a.name.localeCompare(b.name, "sv");
    });
};
