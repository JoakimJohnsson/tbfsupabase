import { supabase } from "../../../lib/supabase/client";
import type { Person, UpdatePersonInput } from "../../../types";

export const updatePerson = async ({ id, first_name, last_name, image_path }: UpdatePersonInput): Promise<Person> => {
    const { data, error } = await supabase
        .from("persons")
        .update({
            first_name,
            last_name,
            ...(image_path !== undefined ? { image_path: image_path ?? null } : {}),
        })
        .eq("id", id)
        .select()
        .single();

    if (error) {
        throw error;
    }

    return data;
};
