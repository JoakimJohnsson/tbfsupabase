import {supabase} from "../../../lib/supabase/client";
import {withAbortSignal} from "../../../lib/asyncHelpers/withAbortSignal";

export const getArtistRecords = async (
    artistId: string,
    signal?: AbortSignal,
) => {
    const query = supabase
        .from("records")
        .select("*")
        .eq("artist_id", artistId)
        .order("year", {
            ascending: false,
            nullsFirst: false,
        })
        .order("name");

    const {data, error} = await withAbortSignal(query, signal);

    if (error) {
        throw error;
    }

    return data;
};