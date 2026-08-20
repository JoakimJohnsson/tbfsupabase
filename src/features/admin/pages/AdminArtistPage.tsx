import {useParams} from "react-router";
import {useTranslation} from "react-i18next";
import SimpleSpinner from "../../../components/spinners/SimpleSpinner";
import Feedback from "../../../components/feedback/Feedback";
import {useArtist} from "../../artists/hooks/useArtist";

export const AdminArtistPage = () => {

    const {t} = useTranslation();

    const {artistSlug} = useParams();
    const loadErrorMessage = t("features.admin.artist.error.loadError");
    const {artist, loadError, loading} = useArtist({
        artistSlug,
        loadErrorMessage,
    });

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