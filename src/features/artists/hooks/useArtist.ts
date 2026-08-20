import {useEffect, useState} from "react";
import {getArtist} from "../api/getArtist";
import {isAbortError} from "../../../lib/asyncHelpers/withAbortSignal";
import type {Artist, SimpleMessage} from "../../../types";

type UseArtistOptions = {
    artistSlug: string;
    loadErrorMessage: string;
};

type UseArtistResult = {
    artist: Artist | null;
    loadError: SimpleMessage | null;
    loading: boolean;
};

export const useArtist = ({artistSlug, loadErrorMessage}: UseArtistOptions): UseArtistResult => {
    const [artist, setArtist] = useState<Artist | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [hasLoadError, setHasLoadError] = useState<boolean>(false);

    useEffect(() => {
        // Reset view state.
        setLoading(true);
        setHasLoadError(false);
        setArtist(null);

        if (!artistSlug) {
            setHasLoadError(true);
            setLoading(false);
            return;
        }

        // Cancel in-flight request when slug changes or component unmounts.
        const controller = new AbortController();

        const loadArtist = async () => {
            try {
                const data = await getArtist(artistSlug, controller.signal);
                if (!controller.signal.aborted) {
                    setArtist(data);
                }
            } catch (error) {
                // Ignore expected cancellation errors from AbortController.
                if (!isAbortError(error)) {
                    console.error(error);
                    if (!controller.signal.aborted) {
                        setHasLoadError(true);
                    }
                }
            } finally {
                // Avoid state updates after cleanup has already aborted the request.
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        void loadArtist();

        return () => {
            controller.abort();
        };
    }, [artistSlug]);

    return {
        artist,
        loadError: hasLoadError ? loadErrorMessage : null,
        loading,
    };
};
