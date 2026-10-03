import { supabase } from "../../../lib/supabase/client";

export const addArtistMember = async (artistId: string, personId: string): Promise<void> => {
    const { error } = await supabase.from("artist_members").insert({
        artist_id: artistId,
        person_id: personId,
    });

    if (error) {
        throw error;
    }
};
