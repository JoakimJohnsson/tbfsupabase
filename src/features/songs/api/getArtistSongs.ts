import { supabase } from "../../../lib/supabase/client";
import { withAbortSignal } from "../../../lib/asyncHelpers/withAbortSignal";
import type { SongWithRecordAndArtists } from "../../../types";

// Fetch all songs where a specific artist is credited as performing artist
export const getArtistSongs = async (artistId: string, signal?: AbortSignal): Promise<SongWithRecordAndArtists[]> => {
    const query = supabase
        .from("songs")
        .select(
            `
            *,
            records (
                id,
                name,
                year,
                cover_path
            ),
            song_artists!inner (
                artist_id,
                is_primary,
                artists (
                    id,
                    name,
                    slug
                )
            )
        `,
        )
        .eq("song_artists.artist_id", artistId)
        .order("name", { ascending: true });

    const { data, error } = await withAbortSignal(query, signal);

    if (error) {
        throw error;
    }

    return (data ?? []) as unknown as SongWithRecordAndArtists[];
};
