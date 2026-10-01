import { supabase } from "../../../lib/supabase/client";
import { CreateArtistInput } from "../../../types";
import { createArtistSlug } from "../createArtistSlug";

export const createArtist = async ({ name, description, image_path }: CreateArtistInput) => {
    const slug = createArtistSlug(name);

    if (!slug) {
        throw new Error("Slug missing!");
    }

    const { data, error } = await supabase
        .from("artists")
        .insert({
            name,
            slug,
            description: description || null,
            image_path: image_path || null,
        })
        .select()
        .single();

    if (error) {
        throw error;
    }

    return data;
};
