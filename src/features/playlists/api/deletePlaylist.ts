import { supabase } from "../../../lib/supabase/client";

export const deletePlaylist = async (playlistId: string): Promise<void> => {
    const { error } = await supabase.from("playlists").delete().eq("id", playlistId);
    if (error) throw error;
};
