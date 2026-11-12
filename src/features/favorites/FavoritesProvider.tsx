import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { useAuth } from "../auth/hooks/useAuth";
import { addFavorite } from "./api/addFavorite";
import { getFavoriteSongIds } from "./api/getFavoriteSongIds";
import { removeFavorite } from "./api/removeFavorite";
import { FavoritesContext } from "./hooks/FavoritesContext";

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
    const { user } = useAuth();
    const userId = user?.id;
    const [favoriteSongIds, setFavoriteSongIds] = useState<Set<string>>(() => new Set());
    const pendingSongIds = useRef(new Set<string>());

    useEffect(() => {
        let ignore = false;
        setFavoriteSongIds(new Set());

        if (userId) {
            void getFavoriteSongIds(userId)
                .then((songIds) => {
                    if (!ignore) setFavoriteSongIds(new Set(songIds));
                })
                .catch((error: unknown) => {
                    console.error(error);
                });
        }

        return () => {
            ignore = true;
        };
    }, [userId]);

    const toggleFavorite = useCallback(
        async (songId: string) => {
            if (!userId || pendingSongIds.current.has(songId)) return;
            pendingSongIds.current.add(songId);
            const wasFavorite = favoriteSongIds.has(songId);
            setFavoriteSongIds((current) => {
                const next = new Set(current);
                if (wasFavorite) next.delete(songId);
                else next.add(songId);
                return next;
            });

            try {
                if (wasFavorite) await removeFavorite(userId, songId);
                else await addFavorite(userId, songId);
            } catch (error) {
                setFavoriteSongIds((current) => {
                    const next = new Set(current);
                    if (wasFavorite) next.add(songId);
                    else next.delete(songId);
                    return next;
                });
                throw error;
            } finally {
                pendingSongIds.current.delete(songId);
            }
        },
        [favoriteSongIds, userId],
    );

    return (
        <FavoritesContext
            value={{
                favoriteSongIds,
                isFavorite: (songId) => favoriteSongIds.has(songId),
                toggleFavorite,
            }}
        >
            {children}
        </FavoritesContext>
    );
};
