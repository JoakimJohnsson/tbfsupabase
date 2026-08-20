import {useParams} from "react-router";
import {useTranslation} from "react-i18next";
import Feedback from "../../../components/feedback/Feedback";
import SimpleSpinner from "../../../components/spinners/SimpleSpinner";
import {useArtist} from "../hooks/useArtist";

export const ArtistPage = () => {

    const {t} = useTranslation();

    const {artistSlug} = useParams();
    const loadErrorMessage = t("features.artist.error.loadError");
    const {artist, loadError, loading} = useArtist({
        artistSlug,
        loadErrorMessage,
    });

    // Error and state handling
    if (loadError) {
        return <Feedback errors={[loadError]}/>;
    }

    if (loading) {
        return <SimpleSpinner message={t("features.artist.message.loading")}/>;
    }

    if (!artist) {
        return <Feedback warnings={[t("features.artist.message.empty")]} />;
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
