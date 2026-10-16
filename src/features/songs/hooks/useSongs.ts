import { useEffect, useState } from "react";
import { getSongs } from "../api/getSongs";
import { isAbortError } from "../../../lib/asyncHelpers/withAbortSignal";
import type { SongWithRecordAndArtists } from "../../../types";

type UseSongsOptions = {
    loadErrorMessage: string;
};

export const useSongs = ({ loadErrorMessage }: UseSongsOptions) => {
    const [songs, setSongs] = useState<SongWithRecordAndArtists[]>([]);
    const [loading, setLoading] = useState(true);
    const [hasLoadError, setHasLoadError] = useState(false);

    useEffect(() => {
        const controller = new AbortController();

        const load = async () => {
            setLoading(true);
            setHasLoadError(false);

            try {
                const data = await getSongs(controller.signal);
                if (!controller.signal.aborted) {
                    setSongs(data);
                }
            } catch (error) {
                if (!controller.signal.aborted && !isAbortError(error)) {
                    console.error(error);
                    setHasLoadError(true);
                    setSongs([]);
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
    }, []);

    return {
        songs,
        loading,
        loadError: hasLoadError ? loadErrorMessage : null,
        setSongs,
    };
};
