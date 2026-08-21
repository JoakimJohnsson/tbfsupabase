import {supabase} from "../../../lib/supabase/client";

export const deleteArtist = async (id: string) => {
    const {error} = await supabase
        .from("artists")
        .delete()
        .eq("id", id);

    if (error) {
        throw error;
    }
};
