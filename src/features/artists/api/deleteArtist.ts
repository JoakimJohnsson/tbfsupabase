import { supabase } from "../../../lib/supabase/client";
import { deleteImageFromStorage } from "../../../lib/supabase/storage";

export const deleteArtist = async (id: string, imagePath?: string | null) => {
    if (imagePath) {
        await deleteImageFromStorage(imagePath);
    }

    const { error } = await supabase.from("artists").delete().eq("id", id);

    if (error) {
        throw error;
    }
};
