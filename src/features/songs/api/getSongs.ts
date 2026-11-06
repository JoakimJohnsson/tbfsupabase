import { supabase } from "../../../lib/supabase/client";
import { withAbortSignal } from "../../../lib/asyncHelpers/withAbortSignal";
import type { SongWithRecordAndArtists } from "../../../types";

export const getSongs = async (
    signal?: AbortSignal,
    { all = false }: { all?: boolean } = {},
): Promise<SongWithRecordAndArtists[]> => {
    const songs: SongWithRecordAndArtists[] = [];
    const pageSize = 500;
    do {
        const query = supabase
            .from("songs")
            .select(
                `
            *,
            records (
                id,
                name,
                year,
                cover_path
            ),
            song_artists (
                artist_id,
                is_primary,
                artists (
                    id,
                    name,
                    slug
                )
            )
        `,
            )
            .order("name", { ascending: true })
            .order("id", { ascending: true });

        const { data, error } = await withAbortSignal(
            all ? query.range(songs.length, songs.length + pageSize - 1) : query,
            signal,
        );

        if (error) {
            throw error;
        }

        const page = (data ?? []) as unknown as SongWithRecordAndArtists[];
        songs.push(...page);
        if (!all || page.length < pageSize) return songs;
    } while (!signal?.aborted);
    throw new DOMException("Song loading aborted", "AbortError");
};
