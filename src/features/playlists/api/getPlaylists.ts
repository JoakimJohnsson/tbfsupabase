import { supabase } from "../../../lib/supabase/client";
import { withAbortSignal } from "../../../lib/asyncHelpers/withAbortSignal";
import type { Playlist } from "../../../types";

export type PlaylistSummary = Playlist & { song_count: number };

export const getPlaylists = async (userId: string, signal?: AbortSignal): Promise<PlaylistSummary[]> => {
    const query = supabase
        .from("playlists")
        .select("*, playlist_songs(count)")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

    const { data, error } = await withAbortSignal(query, signal);
    if (error) throw error;

    return (data ?? []).map(({ playlist_songs, ...playlist }) => ({
        ...playlist,
        song_count: playlist_songs[0]?.count ?? 0,
    }));
};
