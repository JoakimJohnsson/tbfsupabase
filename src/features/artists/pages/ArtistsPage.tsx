import { useTranslation } from "react-i18next";
import { useArtists } from "../hooks/useArtists";
import { ArtistListItem } from "../components/ArtistListItem";
import { Feedback } from "../../../components/feedback/Feedback";
import { SimpleSpinner } from "../../../components/spinners/SimpleSpinner";

export const ArtistsPage = () => {
    const { t } = useTranslation();

    const { artists, loading, loadError } = useArtists({
        loadErrorMessage: t("features.artists.error.loadError"),
    });
    const warning = !loading && !loadError && artists.length === 0 ? t("features.artists.message.empty") : null;

    if (loading) {
        return <SimpleSpinner message={t("features.artists.message.loading")} />;
    }

    if (loadError) {
        return <Feedback errors={[loadError]} />;
    }

    return (
        <>
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
        </>
    );
};
