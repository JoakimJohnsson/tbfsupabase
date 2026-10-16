import { supabase } from "../../../lib/supabase/client";
import { withAbortSignal } from "../../../lib/asyncHelpers/withAbortSignal";
import type { SongWithRecordAndArtists } from "../../../types";

export const getSongs = async (signal?: AbortSignal): Promise<SongWithRecordAndArtists[]> => {
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
            song_artists (
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
        .order("name", { ascending: true });

    const { data, error } = await withAbortSignal(query, signal);

    if (error) {
        throw error;
    }

    return (data ?? []) as unknown as SongWithRecordAndArtists[];
};
