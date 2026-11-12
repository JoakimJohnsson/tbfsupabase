import { supabase } from "../../../lib/supabase/client";

export const addFavorite = async (userId: string, songId: string): Promise<void> => {
    const { error } = await supabase.from("song_favorites").insert({ user_id: userId, song_id: songId });
    if (error) throw error;
};
