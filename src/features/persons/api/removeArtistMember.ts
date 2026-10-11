import { supabase } from "../../../lib/supabase/client";

export const removeArtistMember = async (artistId: string, personId: string): Promise<void> => {
    const { error } = await supabase
        .from("artist_members")
        .delete()
        .eq("artist_id", artistId)
        .eq("person_id", personId);

    if (error) {
        throw error;
    }
};
