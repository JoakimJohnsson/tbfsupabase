import {supabase} from "../../../lib/supabase/client";

export const deleteSong = async (id: string) => {
    const {error} = await supabase
        .from("songs")
        .delete()
        .eq("id", id);

    if (error) {
        throw error;
    }
};
