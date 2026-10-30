import { supabase } from "../../../lib/supabase/client";
import { withAbortSignal } from "../../../lib/asyncHelpers/withAbortSignal";
import type { Person } from "../../../types";

export const getPersons = async (signal?: AbortSignal): Promise<Person[]> => {
    const query = supabase.from("persons").select("*");

    const { data, error } = await withAbortSignal(query, signal);

    if (error) {
        throw error;
    }

    return (data ?? []).sort((a, b) => {
        const firstNameCompare = a.first_name.localeCompare(b.first_name, "sv");
        if (firstNameCompare !== 0) return firstNameCompare;
        return a.last_name.localeCompare(b.last_name, "sv");
    });
};
