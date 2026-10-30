import { useEffect, useState } from "react";
import { getArtistSongs } from "../api/getArtistSongs";
import { isAbortError } from "../../../lib/asyncHelpers/withAbortSignal";
import type { SimpleMessage, SongWithRecordAndArtists } from "../../../types";

type UseArtistSongsOptions = {
    artistId?: string;
    loadErrorMessage: string;
};

// Hook managing data loading for songs belonging to a specific artist
export const useArtistSongs = ({ artistId, loadErrorMessage }: UseArtistSongsOptions) => {
    const [songs, setSongs] = useState<SongWithRecordAndArtists[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState<SimpleMessage>(null);

    useEffect(() => {
        if (!artistId) {
            setSongs([]);
            setLoading(false);
            setLoadError(null);
            return;
        }

        const controller = new AbortController();

        const load = async () => {
            setLoading(true);
            setLoadError(null);

            try {
                const data = await getArtistSongs(artistId, controller.signal);
                if (!controller.signal.aborted) {
                    setSongs(data);
                }
            } catch (err) {
                if (!isAbortError(err)) {
                    console.error(err);
                    setLoadError(loadErrorMessage);
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        void load();

        return () => {
            controller.abort();
        };
    }, [artistId, loadErrorMessage]);

    return {
        songs,
        loading,
        loadError,
    };
};
