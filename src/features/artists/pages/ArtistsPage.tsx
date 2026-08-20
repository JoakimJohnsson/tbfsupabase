import {useEffect, useState} from "react";
import {getArtists} from "../api/getArtists";
import {isAbortError} from "../../../lib/asyncHelpers/withAbortSignal";
import {Link} from "react-router";
import {useTranslation} from "react-i18next";
import Feedback from "../../../components/feedback/Feedback";
import SimpleSpinner from "../../../components/spinners/SimpleSpinner";
import type {Artist, SimpleMessage} from "../../../types";

export const ArtistsPage = () => {

    const {t} = useTranslation();

    const [artists, setArtists] = useState<Artist[]>([]);
    const [error, setError] = useState<SimpleMessage>(null);
    const [warning, setWarning] = useState<SimpleMessage>(null);
    const [loading, setLoading] = useState<boolean>(true);

    // Messages
    const loadError = t("features.artists.error.loadError");
    const loadWarning = t("features.artists.message.empty");

    useEffect(() => {

        // Reset view state.
        setLoading(true);
        setError(null);
        setWarning(null);
        setArtists([]);

        // Cancel in-flight request when component unmounts.
        const controller = new AbortController();

        const loadArtists = async () => {
            try {
                const data = await getArtists(controller.signal);
                setArtists(data);
                if (!data?.length) {
                    setWarning(loadWarning);
                }
            } catch (error) {
                // Ignore expected cancellation errors from AbortController.
                if (!isAbortError(error)) {
                    console.error(error);
                    setError(loadError);
                    setArtists([]);
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

    }, [loadError, loadWarning]);

    if (loading) {
        return <SimpleSpinner message={t("features.artists.message.loading")}/>;
    }

    if (error) {
        return <Feedback errors={[error]}/>
    }

    return (
        <>
            <h1>{t("features.artists.title")}</h1>
            <Feedback warnings={[warning]}/>
            {
                !!artists.length &&
                <ul>
                    {artists.map((artist) => (
                        <li key={artist.id}>
                            <Link to={`/artists/${artist.slug}`}>
                                {artist.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            }
        </>
    );
};
