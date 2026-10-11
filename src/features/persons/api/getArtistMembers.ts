import { supabase } from "../../../lib/supabase/client";
import { withAbortSignal } from "../../../lib/asyncHelpers/withAbortSignal";
import type { Person } from "../../../types";

export const getArtistMembers = async (artistId: string, signal?: AbortSignal): Promise<Person[]> => {
    const query = supabase
        .from("artist_members")
        .select(
            `
            persons (
                id,
                first_name,
                last_name,
                image_path,
                created_at
            )
        `,
        )
        .eq("artist_id", artistId);

    const { data, error } = await withAbortSignal(query, signal);

    if (error) {
        throw error;
    }

    return (data ?? [])
        .map((entry) => entry.persons)
        .filter((person): person is Person => person !== null)
        .sort((a, b) => a.first_name.localeCompare(b.first_name));
};
