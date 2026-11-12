import { createContext } from "react";

export type FavoritesContextValue = {
    favoriteSongIds: Set<string>;
    isFavorite: (songId: string) => boolean;
    toggleFavorite: (songId: string) => Promise<void>;
};

export const FavoritesContext = createContext<FavoritesContextValue | null>(null);
