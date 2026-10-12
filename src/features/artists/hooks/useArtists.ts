import { useEffect, useState } from "react";
import { getArtists } from "../api/getArtists";
import { isAbortError } from "../../../lib/asyncHelpers/withAbortSignal";
import type { Artist } from "../../../types";

type UseArtistsOptions = {
    loadErrorMessage: string;
};

export const useArtists = ({ loadErrorMessage }: UseArtistsOptions) => {
    const [artists, setArtists] = useState<Artist[]>([]);
    const [loading, setLoading] = useState(true);
    const [hasLoadError, setHasLoadError] = useState(false);

    useEffect(() => {
        const controller = new AbortController();

        const loadArtists = async () => {
            setLoading(true);
            setHasLoadError(false);

            try {
                const data = await getArtists(controller.signal);
                if (!controller.signal.aborted) {
                    setArtists(data);
                }
            } catch (error) {
                if (!controller.signal.aborted && !isAbortError(error)) {
                    console.error(error);
                    setHasLoadError(true);
                    setArtists([]);
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        void loadArtists();

        return () => {
            controller.abort();
        };
    }, []);

    return {
        artists,
        loading,
        loadError: hasLoadError ? loadErrorMessage : null,
        setArtists,
    };
};
