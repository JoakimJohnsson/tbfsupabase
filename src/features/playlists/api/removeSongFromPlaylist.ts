import { supabase } from "../../../lib/supabase/client";

export const removeSongFromPlaylist = async (playlistSongId: string): Promise<void> => {
    const { error } = await supabase.from("playlist_songs").delete().eq("id", playlistSongId);
    if (error) throw error;
};
