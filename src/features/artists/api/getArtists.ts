import { supabase } from "../../../lib/supabase/client";
import { withAbortSignal } from "../../../lib/asyncHelpers/withAbortSignal";

// Fetch all artists and sort according to Swedish alphabetical collation (Å, Ä, Ö)
export const getArtists = async (signal?: AbortSignal) => {
    const queryPromise = supabase.from("artists").select("*").order("name");

    const { data, error } = await withAbortSignal(queryPromise, signal);

    if (error) {
        throw error;
    }

    return (data ?? []).sort((a, b) => a.name.localeCompare(b.name, "sv"));
};
