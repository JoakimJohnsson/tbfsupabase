import {useEffect, useState} from "react";
import type {Database} from "../../../lib/supabase/database.types";
import {getArtists} from "../api/getArtists";
import {isAbortError} from "../../../lib/asyncHelpers/withAbortSignal";
import {Link} from "react-router";
import {useTranslation} from "react-i18next";

type Artist = Database["public"]["Tables"]["artists"]["Row"];

export const ArtistsPage = () => {

    const {t} = useTranslation();

    const [artists, setArtists] = useState<Artist[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    // Messages
    const loadError = t("features.artists.error.loadError");

    useEffect(() => {

        // Reset view state.
        setLoading(true);
        setError(null);

        // Cancel in-flight request when component unmounts.
        const controller = new AbortController();

        const loadArtists = async () => {
            try {
                const data = await getArtists(controller.signal);
                setArtists(data);
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

        void loadArtists();

        return () => {
            controller.abort();
        };

    }, [loadError]);

    // Error and state handling
    if (error) {
        return <p>{error}</p>;
    }

    if (loading) {
        return <p>{t("features.artists.message.loading")}</p>;
    }

    if (!artists.length) {
        return <p>{t("features.artists.message.empty")}</p>;
    }

    return (
        <>
            <h1>{t("features.artists.title")}</h1>

            <ul>
                {artists.map((artist) => (
                    <li key={artist.id}>
                        <Link to={`/artists/${artist.slug}`}>
                            {artist.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </>
    );
};
