import {supabase} from "../../../lib/supabase/client.ts";

export const getArtist = async (slug: string) => {
    const {data, error} = await supabase
        .from("artists")
        .select("*")
        .eq("slug", slug)
        .single();

    if (error) {
        throw error;
    }

    return data;
};
