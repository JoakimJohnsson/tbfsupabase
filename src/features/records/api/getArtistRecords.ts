import {supabase} from "../../../lib/supabase/client";
import {withAbortSignal} from "../../../lib/asyncHelpers/withAbortSignal";
import type {Record} from "../../../types";

export const getArtistRecords = async (
    artistId: string,
    signal?: AbortSignal,
): Promise<Record[]> => {
    const query = supabase
        .from("records")
        .select("*, record_artists!inner(artist_id)")
        .eq("record_artists.artist_id", artistId)
        .order("year", {
            ascending: false,
            nullsFirst: false,
        })
        .order("name");

    const {data, error} = await withAbortSignal(query, signal);

    if (error) {
        throw error;
    }

    // Strip nested join relation before returning Record[]
    return (data ?? []).map(({record_artists: _ra, ...record}) => record);
};