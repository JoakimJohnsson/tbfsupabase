import { supabase } from "../../../lib/supabase/client";

export const updateProfileImage = async (userId: string, imagePath: string | null) => {
    const { data, error } = await supabase
        .from("profiles")
        .update({ image_path: imagePath })
        .eq("id", userId)
        .select("*")
        .single();

    if (error) {
        throw error;
    }

    return data;
};
