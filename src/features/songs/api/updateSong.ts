import { supabase } from "../../../lib/supabase/client";
import type { UpdateSongInput } from "../../../types";

export const updateSong = async ({
    id,
    artist_ids,
    name,
    track_number,
    audio_path,
}: UpdateSongInput) => {
    // 1. Update song row
    const { data: song, error: songError } = await supabase
        .from("songs")
        .update({
            name,
            track_number: track_number ?? null,
            ...(audio_path !== undefined ? { audio_path } : {}),
        })
        .eq("id", id)
        .select()
        .single();

    if (songError) {
        throw songError;
    }

    // 2. Clear old links
    const { error: deleteError } = await supabase
        .from("song_artists")
        .delete()
        .eq("song_id", id);

    if (deleteError) {
        throw deleteError;
    }

    // 3. Re-insert artist links
    if (artist_ids.length > 0) {
        const songArtists = artist_ids.map((artistId, index) => ({
            song_id: id,
            artist_id: artistId,
            is_primary: index === 0,
        }));

        const { error: insertError } = await supabase
            .from("song_artists")
            .insert(songArtists);

        if (insertError) {
            throw insertError;
        }
    }

    return song;
};
