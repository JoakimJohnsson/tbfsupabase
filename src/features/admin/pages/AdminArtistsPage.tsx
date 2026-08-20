import {type SubmitEvent, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {createArtist} from "../../artists/api/createArtist";
import {getArtists} from "../../artists/api/getArtists";
import {isAbortError} from "../../../lib/asyncHelpers/withAbortSignal";
import Feedback from "../../../components/feedback/Feedback";
import SimpleSpinner from "../../../components/spinners/SimpleSpinner";
import type {Artist, SimpleMessage} from "../../../types";
import {Link} from "react-router";

export const AdminArtistsPage = () => {

    const {t} = useTranslation();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [loadError, setLoadError] = useState<SimpleMessage>(null);
    const [submitError, setSubmitError] = useState<SimpleMessage>(null);
    const [submitSuccess, setSubmitSuccess] = useState<SimpleMessage>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [artists, setArtists] = useState<Artist[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        // Reset view state.
        setLoading(true);
        setLoadError(null);

        const loadErrorMessage = t("features.artists.error.loadError");

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
                    setLoadError(loadErrorMessage);
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

    }, [t]);

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

            // Add created artist to list
            setArtists((currentArtists) => [
                ...currentArtists,
                createdArtist,
            ].sort((a, b) => a.name.localeCompare(b.name)));

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
        return <SimpleSpinner/>;
    }

    if (loadError) {
        return <Feedback errors={[loadError]}/>;
    }

    return (
        <>
            <h1>{t("features.admin.artists.title")}</h1>

            <Feedback errors={[submitError]} successes={[submitSuccess]}/>

            <p className="lead">{t("features.admin.artists.lead")}</p>

            <ul>
                {artists.map((artist) => (
                    <li key={artist.id}>
                        <Link to={`/admin/artists/${artist.slug}`}>
                            {artist.name}
                        </Link>
                    </li>
                ))}
            </ul>

            <h2>{t("features.admin.artist.create.title")}</h2>

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label
                        className="form-label"
                        htmlFor="artist-name"
                    >
                        {t("forms.name")}
                    </label>

                    <input
                        className="form-control"
                        id="artist-name"
                        onChange={(event) => {
                            setName(event.target.value);
                        }}
                        required
                        type="text"
                        value={name}
                    />
                </div>

                <div className="mb-3">
                    <label
                        className="form-label"
                        htmlFor="artist-description"
                    >
                        {t("forms.description")}
                    </label>

                    <textarea
                        className="form-control"
                        id="artist-description"
                        onChange={(event) => {
                            setDescription(event.target.value);
                        }}
                        rows={5}
                        value={description}
                    />
                </div>

                <button
                    className="btn btn-primary"
                    disabled={isSubmitting || loading}
                    type="submit"
                >
                    {isSubmitting
                        ? t("features.admin.artist.create.submitting")
                        : t("features.admin.artist.create.submit")}
                </button>
            </form>
        </>
    );
};