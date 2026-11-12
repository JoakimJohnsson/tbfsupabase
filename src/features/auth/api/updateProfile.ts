import { supabase } from "../../../lib/supabase/client";
import type { Profile } from "../../../types";

type UpdateProfileInput = Pick<Profile, "display_name" | "first_name" | "last_name"> &
    Partial<Pick<Profile, "image_path">>;

export const updateProfile = async (userId: string, input: UpdateProfileInput): Promise<Profile> => {
    const { data, error } = await supabase
        .from("profiles")
        .update({
            display_name: input.display_name,
            first_name: input.first_name,
            last_name: input.last_name,
            ...(input.image_path !== undefined ? { image_path: input.image_path } : {}),
        })
        .eq("id", userId)
        .select("*")
        .single();

    if (error) {
        throw error;
    }

    return data;
};
