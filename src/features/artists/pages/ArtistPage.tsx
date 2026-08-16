import {useEffect, useState} from "react";
import {useParams} from "react-router";
import {getArtist} from "../api/getArtist";
import {isAbortError} from "../../../lib/asyncHelpers/withAbortSignal";
import {useTranslation} from "react-i18next";
import {Artist} from "../../../types.ts";

export const ArtistPage = () => {

    const {t} = useTranslation();

    const {artistSlug} = useParams();
    const [artist, setArtist] = useState<Artist | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    // Messages
    const loadError = t("features.artist.error.loadError");

    useEffect(() => {

        // Reset view state.
        setLoading(true);
        setError(null);
        setArtist(null);

        if (!artistSlug) {
            setLoading(false);
            return;
        }

        // Cancel in-flight request when slug changes or component unmounts.
        const controller = new AbortController();

        const loadArtist = async () => {
            try {
                const data = await getArtist(artistSlug, controller.signal);
                setArtist(data);
            } catch (error) {
                // Ignore expected cancellation errors from AbortController.
                if (!isAbortError(error)) {
                    console.error(error);
                    setError(loadError);
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

    }, [artistSlug, loadError]);

    // Error and state handling
    if (error) {
        return <p>{error}</p>;
    }

    if (loading) {
        return <p>{t("features.artist.message.loading")}</p>;
    }

    if (!artist) {
        return <p>{t("features.artist.message.empty")}</p>;
    }

    return (
        <>
            <h1>{artist.name}</h1>

            {artist.description && (
                <p>{artist.description}</p>
            )}
        </>
    );
};
