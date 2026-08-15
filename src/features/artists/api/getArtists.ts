import {supabase} from "../../../lib/supabase/client";

export const getArtists = async () => {
    const {data, error} = await supabase
        .from("artists")
        .select("*")
        .order("name");

    if (error) {
        throw error;
    }

    return data;
};