import { supabase } from "../../../lib/supabase/client";

export const removeFavorite = async (userId: string, songId: string): Promise<void> => {
    const { error } = await supabase.from("song_favorites").delete().eq("user_id", userId).eq("song_id", songId);

    if (error) throw error;
};
