import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getArtists } from "../api/getArtists";
import { ArtistListItem } from "../components";
import { isAbortError } from "../../../lib/asyncHelpers/withAbortSignal";
import Feedback from "../../../components/feedback";
import { SimpleSpinner } from "../../../components/spinners";
import type { Artist, SimpleMessage } from "../../../types";

export const ArtistsPage = () => {
    const { t } = useTranslation();

    const [artists, setArtists] = useState<Artist[]>([]);
    const [error, setError] = useState<SimpleMessage>(null);
    const [warning, setWarning] = useState<SimpleMessage>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const loadError = t("features.artists.error.loadError");
    const loadWarning = t("features.artists.message.empty");

    useEffect(() => {
        setLoading(true);
        setError(null);
        setWarning(null);
        setArtists([]);

        const controller = new AbortController();

        const loadArtists = async () => {
            try {
                const data = await getArtists(controller.signal);
                setArtists(data);
                if (!data?.length) {
                    setWarning(loadWarning);
                }
            } catch (err) {
                if (!isAbortError(err)) {
                    console.error(err);
                    setError(loadError);
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
    }, [loadError, loadWarning]);

    if (loading) {
        return (
            <SimpleSpinner message={t("features.artists.message.loading")} />
        );
    }

    if (error) {
        return <Feedback errors={[error]} />;
    }

    return (
        <div className="container-fluid">
            <h1 className="mb-4">{t("features.artists.title")}</h1>
            <Feedback warnings={[warning]} />

            {!!artists.length && (
                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
                    {artists.map((artist) => (
                        <div className="col" key={artist.id}>
                            <ArtistListItem artist={artist} to={`/artists/${artist.slug}`} variant="card" />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
