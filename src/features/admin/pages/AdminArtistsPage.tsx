import { type SubmitEvent, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { faPenToSquare, faPlus, faSearch } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router";
import { createArtist } from "../../artists/api/createArtist";
import { getArtists } from "../../artists/api/getArtists";
import { isAbortError } from "../../../lib/asyncHelpers/withAbortSignal";
import Feedback from "../../../components/feedback/Feedback";
import SimpleSpinner from "../../../components/spinners/SimpleSpinner";
import { ToolButton } from "../../../components/buttons/ToolButton";
import { FormInput, FormTextArea } from "../../../components/form";
import type { Artist, SimpleMessage } from "../../../types";

export const AdminArtistsPage = () => {
    const { t } = useTranslation();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [loadError, setLoadError] = useState<SimpleMessage>(null);
    const [submitError, setSubmitError] = useState<SimpleMessage>(null);
    const [submitSuccess, setSubmitSuccess] = useState<SimpleMessage>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [artists, setArtists] = useState<Artist[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        setLoadError(null);

        const loadErrorMessage = t("features.artists.error.loadError");
        const controller = new AbortController();

        const loadArtists = async () => {
            try {
                const data = await getArtists(controller.signal);
                setArtists(data);
            } catch (error) {
                if (!isAbortError(error)) {
                    console.error(error);
                    setLoadError(loadErrorMessage);
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
    }, [t]);

    const filteredArtists = useMemo(() => {
        const query = searchTerm.trim().toLowerCase();
        if (!query) return artists;
        return artists.filter((artist) => artist.name.toLowerCase().includes(query));
    }, [artists, searchTerm]);

    const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();

        setSubmitError(null);
        setSubmitSuccess(null);
        setIsSubmitting(true);

        try {
            const trimmedName = name.trim();

            if (!trimmedName) {
                setSubmitError(t("features.admin.artist.create.error.invalidNameError"));
                return;
            }

            const createdArtist = await createArtist({
                name: trimmedName,
                description,
            });

            setArtists((currentArtists) =>
                [...currentArtists, createdArtist].sort((a, b) => a.name.localeCompare(b.name)),
            );

            setName("");
            setDescription("");
            setSubmitSuccess(t("features.admin.artist.create.success.createSuccess"));
        } catch (err) {
            console.error(err);
            setSubmitError(t("features.admin.artist.create.error.createError"));
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return <SimpleSpinner />;
    }

    if (loadError) {
        return <Feedback errors={[loadError]} />;
    }

    return (
        <div className="container-fluid">
            <div className="mb-4">
                <h1 className="h2 fw-bold">{t("features.admin.artists.title")}</h1>
                <p className="text-secondary mb-0">{t("features.admin.artists.lead")}</p>
            </div>

            <Feedback errors={[submitError]} successes={[submitSuccess]} />

            <div className="row g-4">
                {/* Left column: Create artist card */}
                <aside className="col-12 col-lg-5 col-xl-4">
                    <div className="card shadow-sm border-0 bg-body-tertiary">
                        <div className="card-body">
                            <h2 className="h5 card-title fw-bold mb-3 d-flex align-items-center gap-2">
                                <FontAwesomeIcon icon={faPlus} className="text-primary" />
                                {t("features.admin.artist.create.title")}
                            </h2>

                            <form onSubmit={handleSubmit}>
                                <FormInput
                                    id="name"
                                    label={t("forms.name")}
                                    name="name"
                                    onChange={setName}
                                    required
                                    type="text"
                                    value={name}
                                />

                                <FormTextArea
                                    id="description"
                                    label={t("forms.description")}
                                    name="description"
                                    onChange={setDescription}
                                    rows={4}
                                    value={description}
                                />

                                <button
                                    className="btn btn-primary w-100"
                                    disabled={isSubmitting || loading}
                                    type="submit"
                                >
                                    {isSubmitting
                                        ? t("features.admin.artist.create.submitting")
                                        : t("features.admin.artist.create.submit")}
                                </button>
                            </form>
                        </div>
                    </div>
                </aside>

                {/* Right column: Search & Artist List */}
                <main className="col-12 col-lg-7 col-xl-8">
                    <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                        <h2 className="h4 fw-bold mb-0">{t("features.admin.artists.list.title")}</h2>

                        <div className="text-secondary small">
                            {filteredArtists.length} {filteredArtists.length === 1 ? t("features.admin.artist.title") : t("features.admin.artists.title")}
                        </div>

                        {artists.length > 5 && (
                            <div className="input-group input-group-sm w-auto">
                                <span className="input-group-text bg-body border-end-0">
                                    <FontAwesomeIcon icon={faSearch} className="text-muted" />
                                </span>
                                <input
                                    className="form-control border-start-0"
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder={t("features.admin.artists.search")}
                                    type="search"
                                    value={searchTerm}
                                />
                            </div>
                        )}
                    </div>

                    {filteredArtists.length === 0 ? (
                        <div className="card border-0 bg-body-tertiary p-4 text-center text-muted">
                            {t("features.artists.message.empty")}
                        </div>
                    ) : (
                        <div className="list-group shadow-sm">
                            {filteredArtists.map((artist) => (
                                <div
                                    key={artist.id}
                                    className="list-group-item list-group-item-action d-flex justify-content-between align-items-center p-3"
                                >
                                    <div className="me-3">
                                        <Link
                                            to={`/admin/artists/${artist.slug}`}
                                            className="fw-bold text-decoration-none text-reset stretched-link"
                                        >
                                            {artist.name}
                                        </Link>
                                        {artist.description && (
                                            <p
                                                className="mb-0 text-muted small text-truncate"
                                                style={{ maxWidth: "450px" }}
                                            >
                                                {artist.description}
                                            </p>
                                        )}
                                    </div>
                                    <ToolButton
                                        icon={faPenToSquare}
                                        text={t("common.edit")}
                                        to={`/admin/artists/${artist.slug}`}
                                        variant="outline-secondary"
                                        className="position-relative z-2"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};
