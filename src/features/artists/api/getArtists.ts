import {supabase} from "../../../lib/supabase/client";
import {withAbortSignal} from "../../../lib/asyncHelpers/withAbortSignal.ts";

export const getArtists = async (signal?: AbortSignal) => {
    const queryPromise = supabase
        .from("artists")
        .select("*")
        .order("name");

    const {data, error} = await withAbortSignal(queryPromise, signal);

    if (error) {
        throw error;
    }

    return data;
};