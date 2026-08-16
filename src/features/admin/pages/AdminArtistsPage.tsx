import type {SubmitEvent} from "react";
import {useState} from "react";
import {useTranslation} from "react-i18next";
import {createArtist} from "../../artists/api/createArtist";

export const AdminArtistsPage = () => {
    const {t} = useTranslation();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();

        setError(null);
        setSuccess(null);
        setIsSubmitting(true);

        try {
            const trimmedName = name.trim();

            if (!trimmedName) {
                setError(t("features.admin.artist.create.error.invalidNameError"));
                return;
            }

            await createArtist({
                name: trimmedName,
                description,
            });

            setName("");
            setDescription("");
            setSuccess(t("features.admin.artist.create.success.createSuccess"));
        } catch (err) {
            console.error(err);
            setError(t("features.admin.artist.create.error.createError"));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <h1>{t("features.admin.artists.title")}</h1>

            <p className="lead">{t("features.admin.artists.lead")}</p>

            <h2>{t("features.admin.artist.create.title")}</h2>

            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}

            {success && (
                <div className="alert alert-success" role="status">
                    {success}
                </div>
            )}

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
                    disabled={isSubmitting}
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