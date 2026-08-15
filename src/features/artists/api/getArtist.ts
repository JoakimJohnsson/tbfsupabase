import {supabase} from "../../../lib/supabase/client.ts";
import {withAbortSignal} from "../../../lib/asyncHelpers/withAbortSignal.ts";

export const getArtist = async (slug: string, signal?: AbortSignal) => {
    const queryPromise = supabase
        .from("artists")
        .select("*")
        .eq("slug", slug)
        .single();

    const {data, error} = await withAbortSignal(queryPromise, signal);

    if (error) {
        throw error;
    }

    return data;
};
