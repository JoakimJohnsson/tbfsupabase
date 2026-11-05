export const shuffle = <T>(items: readonly T[]): T[] => {
    const shuffled = [...items];

    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
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
