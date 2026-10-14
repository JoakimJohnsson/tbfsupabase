import { supabase } from "../../../lib/supabase/client";
import { deleteImageFromStorage } from "../../../lib/supabase/storage";

export const deletePerson = async (id: string, imagePath?: string | null): Promise<void> => {
    // Remove portrait from storage if present
    if (imagePath) {
        await deleteImageFromStorage(imagePath);
    }

    const { error } = await supabase.from("persons").delete().eq("id", id);

    if (error) {
        throw error;
    }
};
