import { supabase } from "../../../lib/supabase/client";
import type { Playlist } from "../../../types";

export const updatePlaylist = async (playlistId: string, name: string, description?: string): Promise<Playlist> => {
    const { data, error } = await supabase
        .from("playlists")
        .update({ name, description: description?.trim() || null })
        .eq("id", playlistId)
        .select()
        .single();

    if (error) throw error;
    return data;
};
