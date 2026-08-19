export const getMapKeyFromString = (key: string, index: number): string => {
    const normalized = key
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");

    return `${normalized || "item"}-${index}`;
};
