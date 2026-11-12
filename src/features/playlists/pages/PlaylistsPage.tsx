import { useEffect, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router";
import { Breadcrumbs } from "../../../components/navs/Breadcrumbs";
import { EmptyStateCard } from "../../../components/cards/EmptyStateCard";
import { Feedback } from "../../../components/feedback/Feedback";
import { FormInput } from "../../../components/form/FormInput";
import { FormTextArea } from "../../../components/form/FormTextArea";
import { SimpleSpinner } from "../../../components/spinners/SimpleSpinner";
import { isAbortError } from "../../../lib/asyncHelpers/withAbortSignal";
import { useAuth } from "../../auth/hooks/useAuth";
import { createPlaylist } from "../api/createPlaylist";
import { getPlaylists, type PlaylistSummary } from "../api/getPlaylists";

export const PlaylistsPage = () => {
    const { t, i18n } = useTranslation();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [playlists, setPlaylists] = useState<PlaylistSummary[]>([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [loadError, setLoadError] = useState(false);
    const [formError, setFormError] = useState(false);

    useEffect(() => {
        const controller = new AbortController();
        setLoading(true);
        setLoadError(false);

        if (!user) {
            setPlaylists([]);
            setLoading(false);
            return () => controller.abort();
        }

        void getPlaylists(user.id, controller.signal)
            .then((data) => setPlaylists(data))
            .catch((error: unknown) => {
                if (!isAbortError(error)) {
                    console.error(error);
                    setLoadError(true);
                }
            })
            .finally(() => {
                if (!controller.signal.aborted) setLoading(false);
            });

        return () => controller.abort();
    }, [user]);

    const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!user || !name.trim()) return;

        setSubmitting(true);
        setFormError(false);
        try {
            const playlist = await createPlaylist(user.id, name.trim(), description);
            navigate(`/playlists/${playlist.id}`);
        } catch (error) {
            console.error(error);
            setFormError(true);
        } finally {
            setSubmitting(false);
        }
    };

    const breadcrumbs = [{ label: t("navigation.home"), to: "/" }, { label: t("navigation.myPlaylists") }];

    if (loading) return <SimpleSpinner message={t("common.loading")} />;
    if (loadError) return <Feedback errors={[t("features.playlists.loadError")]} />;

    return (
        <>
            <Breadcrumbs items={breadcrumbs} />
            <h1 className="h2 fw-bold mb-4">{t("features.playlists.title")}</h1>
            {formError && <Feedback errors={[t("features.playlists.createError")]} />}

            <section aria-labelledby="create-playlist-heading" className="card mb-4">
                <div className="card-body">
                    <h2 className="h5 fw-bold mb-3" id="create-playlist-heading">
                        {t("features.playlists.createTitle")}
                    </h2>
                    <form onSubmit={handleCreate}>
                        <FormInput
                            id="playlist-name"
                            label={t("features.playlists.playlistName")}
                            onChange={setName}
                            placeholder={t("features.playlists.namePlaceholder")}
                            required
                            value={name}
                        />
                        <FormTextArea
                            id="playlist-description"
                            label={t("features.playlists.playlistDescription")}
                            onChange={setDescription}
                            placeholder={t("features.playlists.descriptionPlaceholder")}
                            value={description}
                        />
                        <button className="btn btn-primary" disabled={submitting || !name.trim()} type="submit">
                            {submitting ? t("common.loading") : t("features.playlists.create")}
                        </button>
                    </form>
                </div>
            </section>

            <section aria-labelledby="playlists-heading">
                <h2 className="h4 fw-bold mb-3" id="playlists-heading">
                    {t("features.playlists.title")}
                </h2>
                {playlists.length === 0 ? (
                    <EmptyStateCard message={t("features.playlists.empty")} />
                ) : (
                    <div className="list-group shadow-sm">
                        {playlists.map((playlist) => (
                            <Link
                                className="list-group-item list-group-item-action d-flex justify-content-between align-items-center gap-3"
                                key={playlist.id}
                                to={`/playlists/${playlist.id}`}
                            >
                                <span className="min-w-0">
                                    <span className="d-block fw-semibold text-truncate">{playlist.name}</span>
                                    {playlist.description && (
                                        <span className="d-block small text-secondary text-truncate">
                                            {playlist.description}
                                        </span>
                                    )}
                                    <span className="d-block small text-secondary">
                                        {t("features.playlists.createdAt", {
                                            date: new Intl.DateTimeFormat(i18n.language, {
                                                dateStyle: "medium",
                                            }).format(new Date(playlist.created_at)),
                                        })}
                                    </span>
                                </span>
                                <span className="badge text-bg-secondary flex-shrink-0">
                                    {t("features.playlists.songCount", { count: playlist.song_count })}
                                </span>
                            </Link>
                        ))}
                    </div>
                )}
            </section>
        </>
    );
};
