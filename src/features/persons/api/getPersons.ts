import { supabase } from "../../../lib/supabase/client";
import { withAbortSignal } from "../../../lib/asyncHelpers/withAbortSignal";
import type { Person } from "../../../types";

export const getPersons = async (signal?: AbortSignal): Promise<Person[]> => {
    const query = supabase
        .from("persons")
        .select("*")
        .order("first_name", { ascending: true })
        .order("last_name", { ascending: true });

    const { data, error } = await withAbortSignal(query, signal);

    if (error) {
        throw error;
    }

    return data ?? [];
};
