import {supabase} from "../../../lib/supabase/client";
import type {UpdateRecordInput} from "../../../types";

export const updateRecord = async ({
                                       id,
                                       name,
                                       description,
                                       format,
                                       type,
                                       year,
                                   }: UpdateRecordInput) => {
    const {data, error} = await supabase
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

    if (error) {
        throw error;
    }

    return data;
};
