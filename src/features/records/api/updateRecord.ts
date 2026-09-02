import {supabase} from "../../../lib/supabase/client";
import type {UpdateRecordInput} from "../../../types";

export const updateRecord = async ({
                                       id,
                                       artist_ids,
                                       name,
                                       description,
                                       format,
                                       type,
                                       year,
                                   }: UpdateRecordInput) => {
    // 1. Update record fields
    const {data: record, error: recordError} = await supabase
        .from("records")
        .update({
            name,
            description: description || null,
            format: format || null,
            type: type || null,
            year: year ?? null,
        })
        .eq("id", id)
        .select()
        .single();

    if (recordError) {
        throw recordError;
    }

    // 2. Remove existing artist relations for this record
    const {error: deleteError} = await supabase
        .from("record_artists")
        .delete()
        .eq("record_id", id);

    if (deleteError) {
        throw deleteError;
    }

    // 3. Insert updated artist relations
    if (artist_ids.length > 0) {
        const recordArtists = artist_ids.map((artistId, index) => ({
            record_id: id,
            artist_id: artistId,
            is_primary: index === 0,
        }));

        const {error: insertError} = await supabase
            .from("record_artists")
            .insert(recordArtists);

        if (insertError) {
            throw insertError;
        }
    }

    return record;
};
