import { supabase } from "../../../lib/supabase/client";
import { withAbortSignal } from "../../../lib/asyncHelpers/withAbortSignal";
import type { SongWithRecordAndArtists } from "../../../types";

export const getFavorites = async (userId: string, signal?: AbortSignal): Promise<SongWithRecordAndArtists[]> => {
    const query = supabase
        .from("song_favorites")
        .select(
            `
            created_at,
            songs (
                *,
                records (id, name, year, cover_path),
                song_artists (
                    artist_id,
                    is_primary,
                    artists (id, name, slug)
                )
            )
        `,
        )
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

    const { data, error } = await withAbortSignal(query, signal);
    if (error) throw error;

    return (data ?? []).flatMap((favorite) =>
        favorite.songs ? [favorite.songs as unknown as SongWithRecordAndArtists] : [],
    );
};
