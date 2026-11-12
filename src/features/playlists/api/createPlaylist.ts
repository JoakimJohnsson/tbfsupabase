import { supabase } from "../../../lib/supabase/client";
import type { Playlist } from "../../../types";

export const createPlaylist = async (userId: string, name: string, description?: string): Promise<Playlist> => {
    const { data, error } = await supabase
        .from("playlists")
        .insert({ user_id: userId, name, description: description?.trim() || null })
        .select()
        .single();

    if (error) throw error;
    return data;
};
