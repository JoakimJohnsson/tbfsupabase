import {useEffect, useState} from "react";
import {useParams} from "react-router";
import {useTranslation} from "react-i18next";
import {getArtist} from "../../artists/api/getArtist";
import {isAbortError} from "../../../lib/asyncHelpers/withAbortSignal";
import SimpleSpinner from "../../../components/spinners/SimpleSpinner";
import type {Artist, SimpleMessage} from "../../../types";
import Feedback from "../../../components/feedback/Feedback";

export const AdminArtistPage = () => {

    const {t} = useTranslation();

    const {artistSlug} = useParams();
    const [artist, setArtist] = useState<Artist | null>(null);
    const [loadError, setLoadError] = useState<SimpleMessage>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        // Reset view state
        setLoading(true);
        setLoadError(null);
        setArtist(null);

        const loadErrorMessage = t("features.admin.artist.error.loadError");

        if (!artistSlug) {
            setLoadError(loadErrorMessage);
            setLoading(false);
            return;
        }

        // Cancel in-flight request when slug changes or component unmounts
        const controller = new AbortController();

        const loadArtist = async () => {
            try {
                const data = await getArtist(artistSlug, controller.signal);
                setArtist(data);
            } catch (error) {
                // Ignore expected cancellation errors from AbortController
                if (!isAbortError(error)) {
                    console.error(error);
                    setLoadError(loadErrorMessage);
                }
            } finally {
                // Avoid state updates after cleanup has already aborted the request
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        void loadArtist();

        return () => {
            controller.abort();
        };

    }, [artistSlug, t]);

    // Error and state handling
    if (loadError) {
        return <Feedback errors={[loadError]}/>;
    }

    if (loading) {
        return <SimpleSpinner message={t("features.admin.artist.message.loading")}/>;
    }

    if (!artist) {
        return <Feedback warnings={[t("features.admin.artist.message.empty")]} />;
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