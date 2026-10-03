import { supabase } from "../../../lib/supabase/client";
import type { CreatePersonInput, Person } from "../../../types";

export const createPerson = async ({ first_name, last_name, image_path }: CreatePersonInput): Promise<Person> => {
    const { data, error } = await supabase
        .from("persons")
        .insert({
            first_name,
            last_name,
            image_path: image_path || null,
        })
        .select()
        .single();

    if (error) {
        throw error;
    }

    return data;
};
