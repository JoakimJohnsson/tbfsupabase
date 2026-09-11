import { supabase } from "../../../lib/supabase/client";
import type { CreateSongInput } from "../../../types";

export const createSong = async (input: CreateSongInput) => {
    const { artist_ids, ...songData } = input;

    // 1. Insert song
    const { data: song, error: songError } = await supabase
        .from("songs")
        .insert({
            name: songData.name,
            record_id: songData.record_id,
            track_number: songData.track_number ?? null,
            audio_path: songData.audio_path ?? "",
        })
        .select()
        .single();

    if (songError) {
        throw songError;
    }

    // 2. Link artists
    if (artist_ids.length > 0) {
        const songArtists = artist_ids.map((artistId, index) => ({
            song_id: song.id,
            artist_id: artistId,
            is_primary: index === 0,
        }));

        const { error: linkError } = await supabase
            .from("song_artists")
            .insert(songArtists);

        if (linkError) {
            throw linkError;
        }
    }

    return song;
};
