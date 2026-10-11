// src/features/records/api/getArtistRecords.ts
import { supabase } from "../../../lib/supabase/client";
import { withAbortSignal } from "../../../lib/asyncHelpers/withAbortSignal";
import type { Record } from "../../../types";

export const getArtistRecords = async (artistId: string, signal?: AbortSignal): Promise<Record[]> => {
    // 1. Records where the artist is credited on the record itself
    const directQuery = supabase
        .from("records")
        .select("*, record_artists!inner(artist_id)")
        .eq("record_artists.artist_id", artistId);

    // 2. Records where the artist has at least one track on the record (e.g. compilations)
    const compilationQuery = supabase
        .from("records")
        .select("*, songs!inner(song_artists!inner(artist_id))")
        .eq("songs.song_artists.artist_id", artistId);

    const [directResult, compilationResult] = await Promise.all([
        withAbortSignal(directQuery, signal),
        withAbortSignal(compilationQuery, signal),
    ]);

    if (directResult.error) {
        throw directResult.error;
    }
    if (compilationResult.error) {
        throw compilationResult.error;
    }

    // Strip nested join relation keys
    const directRecords = (directResult.data ?? []).map(({ record_artists: _ra, ...record }) => record as Record);
    const compilationRecords = (compilationResult.data ?? []).map(({ songs: _songs, ...record }) => record as Record);

    // Merge and deduplicate by record id
    const recordMap = new Map<string, Record>();
    for (const record of [...directRecords, ...compilationRecords]) {
        if (!recordMap.has(record.id)) {
            recordMap.set(record.id, record);
        }
    }

    // Sort: Year descending (nulls last), then Name ascending
    return Array.from(recordMap.values()).sort((a, b) => {
        if (a.year === null && b.year === null) return a.name.localeCompare(b.name);
        if (a.year === null) return 1;
        if (b.year === null) return -1;
        if (a.year !== b.year) return b.year - a.year;
        return a.name.localeCompare(b.name);
    });
};
