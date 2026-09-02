import {supabase} from "../../../lib/supabase/client";

export const deleteRecord = async (id: string) => {
    const {error} = await supabase
        .from("records")
        .delete()
        .eq("id", id);

    if (error) {
        throw error;
    }
};
