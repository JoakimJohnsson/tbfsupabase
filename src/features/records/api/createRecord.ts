import {supabase} from "../../../lib/supabase/client";
import type {CreateRecordInput} from "../../../types";

export const createRecord = async (input: CreateRecordInput) => {
    const {artist_ids, ...recordData} = input;

    // 1. Insert record
    const {data: record, error: recordError} = await supabase
        .from("records")
        .insert({
            name: recordData.name,
            description: recordData.description || null,
            format: recordData.format || null,
            type: recordData.type || null,
            year: recordData.year ?? null,
        })
        .select()
        .single();

    if (recordError) {
        throw recordError;
    }

    // 2. Link artists
    if (artist_ids.length > 0) {
        const recordArtists = artist_ids.map((artistId, index) => ({
            record_id: record.id,
            artist_id: artistId,
            is_primary: index === 0,
        }));

        const {error: linkError} = await supabase
            .from("record_artists")
            .insert(recordArtists);

        if (linkError) {
            throw linkError;
        }
    }

    return record;
};
