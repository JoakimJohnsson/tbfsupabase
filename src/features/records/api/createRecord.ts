import {supabase} from "../../../lib/supabase/client";
import type {CreateRecordInput} from "../../../types";

export const createRecord = async (record: CreateRecordInput) => {
    const {data, error} = await supabase
        .from("records")
        .insert({
            ...record,
            description: record.description || null,
            format: record.format || null,
            type: record.type || null,
            year: record.year ?? null,
        })
        .select()
        .single();

    if (error) {
        throw error;
    }

    return data;
};