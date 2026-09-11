import { supabase } from "../../../lib/supabase/client";
import { withAbortSignal } from "../../../lib/asyncHelpers/withAbortSignal";
import type { SongWithArtists } from "../../../types";

export const getRecordSongs = async (
    recordId: string,
    signal?: AbortSignal,
): Promise<SongWithArtists[]> => {
    const query = supabase
        .from("songs")
        .select(
            `
            *,
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
        .eq("record_id", recordId)
        .order("track_number", {
            ascending: true,
            nullsFirst: false,
        })
        .order("name");

    const { data, error } = await withAbortSignal(query, signal);

    if (error) {
        throw error;
    }

    return (data ?? []) as unknown as SongWithArtists[];
};
