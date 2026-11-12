import { supabase } from "../../../lib/supabase/client";
import { withAbortSignal } from "../../../lib/asyncHelpers/withAbortSignal";
import type { Playlist, SongWithRecordAndArtists } from "../../../types";

export type PlaylistDetails = Playlist & {
    songs: SongWithRecordAndArtists[];
    playlistSongIds: Record<string, string>;
};

export const getPlaylist = async (playlistId: string, signal?: AbortSignal): Promise<PlaylistDetails> => {
    const query = supabase
        .from("playlists")
        .select(
            `
            *,
            playlist_songs (
                id,
                song_id,
                position,
                songs (
                    *,
                    records (id, name, year, cover_path),
                    song_artists (
                        artist_id,
                        is_primary,
                        artists (id, name, slug)
                    )
                )
            )
        `,
        )
        .eq("id", playlistId)
        .order("position", { referencedTable: "playlist_songs", ascending: true })
        .single();

    const { data, error } = await withAbortSignal(query, signal);
    if (error) throw error;

    const { playlist_songs, ...playlist } = data;
    const orderedEntries = [...playlist_songs].sort((a, b) => a.position - b.position);

    return {
        ...playlist,
        songs: orderedEntries.flatMap((entry) =>
            entry.songs ? [entry.songs as unknown as SongWithRecordAndArtists] : [],
        ),
        playlistSongIds: Object.fromEntries(orderedEntries.map((entry) => [entry.song_id, entry.id])),
    };
};
