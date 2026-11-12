import { supabase } from "../../../lib/supabase/client";

export const getFavoriteSongIds = async (userId: string): Promise<string[]> => {
    const { data, error } = await supabase.from("song_favorites").select("song_id").eq("user_id", userId);

    if (error) throw error;
    return (data ?? []).map(({ song_id }) => song_id);
};
