import {supabase} from "../../../lib/supabase/client";
import type {UpdateArtistInput} from "../../../types";

export const updateArtist = async ({
                                       id,
                                       name,
                                       description,
                                   }: UpdateArtistInput) => {
    const {data, error} = await supabase
        .from("artists")
        .update({
            name,
            description: description || null,
        })
        .eq("id", id)
        .select()
        .single();

    if (error) {
        throw error;
    }

    return data;
};