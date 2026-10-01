import { supabase } from "../../../lib/supabase/client";
import { deleteImageFromStorage } from "../../../lib/supabase/storage";

export const deleteRecord = async (id: string, coverPath?: string | null) => {
    if (coverPath) {
        await deleteImageFromStorage(coverPath);
    }

    const { error } = await supabase.from("records").delete().eq("id", id);

    if (error) {
        throw error;
    }
};
