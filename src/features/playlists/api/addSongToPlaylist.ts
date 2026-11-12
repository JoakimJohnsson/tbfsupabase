import { supabase } from "../../../lib/supabase/client";

export const addSongToPlaylist = async (playlistId: string, songId: string): Promise<void> => {
    const { data: lastEntry, error: positionError } = await supabase
        .from("playlist_songs")
        .select("position")
        .eq("playlist_id", playlistId)
        .order("position", { ascending: false })
        .limit(1)
        .maybeSingle();

    if (positionError) throw positionError;

    const { error } = await supabase
        .from("playlist_songs")
        .insert({ playlist_id: playlistId, song_id: songId, position: (lastEntry?.position ?? -1) + 1 });
    if (error) throw error;
};
