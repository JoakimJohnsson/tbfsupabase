import { useLocation, useNavigate, useParams } from "react-router";
import { useTranslation } from "react-i18next";
import Feedback from "../../../components/feedback";
import { SimpleSpinner } from "../../../components/spinners";
import { useArtist } from "../hooks/useArtist";
import { useArtistRecords } from "../../records/hooks/useArtistRecords";
import { useAuth } from "../../auth/hooks/useAuth";
import { RecordBadges } from "../../records/components/RecordBadges";

export const ArtistPage = () => {
    const { t } = useTranslation();
    const { artistSlug } = useParams();
    const { user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const loadErrorMessage = t("features.artist.error.loadError");
    const { artist, loadError, loading } = useArtist({
        artistSlug,
        loadErrorMessage,
    });

    // Only load records if user is logged in
    const { records, recordsLoadError, recordsLoading } = useArtistRecords({
        artistId: user ? artist?.id : undefined,
        recordsLoadErrorMessage: loadErrorMessage,
    });

    if (loadError) {
        return <Feedback errors={[loadError]} />;
    }

    if (loading) {
        return <SimpleSpinner message={t("features.artist.message.loading")} />;
    }

    if (!artist) {
        return <Feedback warnings={[t("features.artist.message.empty")]} />;
    }

    const handlePromptLogin = () => {
        navigate("/login", { state: { from: location } });
    };

    return (
        <div className="row g-4">
            {/* Left column: Artist info */}
            <aside className="col-12 col-lg-4 col-xl-3">
                <div className="card shadow-sm border-0 bg-body-tertiary">
                    {artist.image_path && (
                        <img
                            alt={artist.name}
                            className="card-img-top"
                            src={artist.image_path}
                        />
                    )}
                    <div className="card-body">
                        <h1 className="h3 card-title fw-bold mb-3">
                            {artist.name}
                        </h1>
                        {artist.description ? (
                            <p className="card-text text-secondary">
                                {artist.description}
                            </p>
                        ) : (
                            <p className="text-muted small fst-italic">
                                {t("features.artist.message.noBiography")}
                            </p>
                        )}
                    </div>
                </div>
            </aside>

            {/* Right column: Artist records */}
            <main className="col-12 col-lg-8 col-xl-9">
                <h2 className="h4 fw-bold mb-3">
                    {t("features.artist.recordsTitle")}
                </h2>

                {!user ? (
                    // Not logged in users are prompted to log in
                    <div className="card border p-4 text-center bg-body-tertiary">
                        <div className="card-body">
                            <h3 className="h5 fw-bold mb-2">
                                {t("features.artist.loginPrompt.title")}
                            </h3>
                            <p className="text-muted mb-4">
                                {t("features.artist.loginPrompt.description")}
                            </p>
                            <button
                                className="btn btn-primary"
                                onClick={handlePromptLogin}
                                type="button"
                            >
                                {t("features.artist.loginPrompt.submit")}
                            </button>
                        </div>
                    </div>
                ) : (
                    // Logged in users can see records
                    <>
                        {recordsLoadError && (
                            <Feedback errors={[recordsLoadError]} />
                        )}
                        {recordsLoading ? (
                            <SimpleSpinner />
                        ) : records.length === 0 ? (
                            <p className="text-muted">
                                {t("features.artist.message.recordsEmpty")}
                            </p>
                        ) : (
                            <div className="d-flex flex-column gap-3">
                                {records.map((record) => (
                                    <div
                                        className="card shadow-sm border"
                                        key={record.id}
                                    >
                                        <div className="card-body">
                                            <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
                                                <h3 className="h5 card-title fw-semibold mb-0">
                                                    {record.name}
                                                    {record.year && (
                                                        <span className="text-muted fs-6 fw-normal ms-2">
                                                            ({record.year})
                                                        </span>
                                                    )}
                                                </h3>

                                                {/* Format and Type badges */}
                                                <RecordBadges
                                                    format={record.format}
                                                    type={record.type}
                                                />
                                            </div>

                                            {record.description && (
                                                <p className="card-text text-muted small mb-0">
                                                    {record.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
};
