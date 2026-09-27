import { supabase } from "../../../lib/supabase/client";
import type { UpdateArtistInput } from "../../../types";

export const updateArtist = async ({ id, name, description, image_path }: UpdateArtistInput) => {
    const { data, error } = await supabase
        .from("artists")
        .update({
            name,
            description: description || null,
            ...(image_path !== undefined ? { image_path } : {}),
        })
        .eq("id", id)
        .select()
        .single();

    if (error) {
        throw error;
    }

    return data;
};
