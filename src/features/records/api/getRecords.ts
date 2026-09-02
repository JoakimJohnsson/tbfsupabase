import {supabase} from "../../../lib/supabase/client";
import {withAbortSignal} from "../../../lib/asyncHelpers/withAbortSignal";
import type {RecordWithArtists} from "../../../types";

export const getRecords = async (signal?: AbortSignal): Promise<RecordWithArtists[]> => {
    const query = supabase
        .from("records")
        .select(`
            *,
            record_artists (
                artist_id,
                is_primary,
                artists (
                    id,
                    name,
                    slug
                )
            )
        `)
        .order("year", {
            ascending: false,
            nullsFirst: false,
        })
        .order("name");

    const {data, error} = await withAbortSignal(query, signal);

    if (error) {
        throw error;
    }

    return (data ?? []) as unknown as RecordWithArtists[];
};
