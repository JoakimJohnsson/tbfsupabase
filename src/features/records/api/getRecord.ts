import { supabase } from "../../../lib/supabase/client";
import { withAbortSignal } from "../../../lib/asyncHelpers/withAbortSignal";
import type { RecordWithArtistsAndSongs } from "../../../types";

// Fetch a single record by its ID including artists and full songs (with track_number, name, etc.)
export const getRecord = async (recordId: string, signal?: AbortSignal): Promise<RecordWithArtistsAndSongs> => {
    const query = supabase
        .from("records")
        .select(
            `
            *,
            record_artists (
                artist_id,
                is_primary,
                artists (
                    id,
                    name,
                    slug
                )
            ),
            songs (
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
            )
        `,
        )
        .eq("id", recordId)
        .single();

    const { data, error } = await withAbortSignal(query, signal);

    if (error) {
        throw error;
    }

    return data as unknown as RecordWithArtistsAndSongs;
};
