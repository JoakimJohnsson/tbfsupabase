import {useParams} from "react-router";
import {useTranslation} from "react-i18next";
import SimpleSpinner from "../../../components/spinners/SimpleSpinner";
import Feedback from "../../../components/feedback/Feedback";
import {useArtist} from "../../artists/hooks/useArtist";
import {useEffect, useState} from "react";
import {updateArtist} from "../../artists/api/updateArtist";
import type {SubmitEvent} from "react";
import {SimpleMessage} from "../../../types";

export const AdminArtistPage = () => {

    const {t} = useTranslation();
    const loadErrorMessage = t("features.admin.artist.error.loadError");
    const editErrorMessage = t("features.admin.artist.edit.error.editError");
    const editSuccessMessage = t("features.admin.artist.edit.success.editSuccess");

    const {artistSlug} = useParams();
    const {artist, loadError, loading, setArtist} = useArtist({
        artistSlug,
        loadErrorMessage,
    });

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [editError, setEditError] = useState<SimpleMessage | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editSuccess, setEditSuccess] = useState<SimpleMessage | null>(null);

    // Initialize edit fields
    useEffect(() => {
        if (!artist) {
            return;
        }

        setName(artist.name);
        setDescription(artist.description ?? "");
    }, [artist]);

    const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!artist) {
            return;
        }

        setEditError(null);
        setEditSuccess(null);
        setIsSubmitting(true);

        try {
            const updatedArtist = await updateArtist({
                id: artist.id,
                name: name.trim(),
                description: description.trim(),
            });

            setEditSuccess(editSuccessMessage);
            setArtist(updatedArtist);
        } catch (err) {
            console.error(err);
            setEditError(editErrorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Error and state handling
    if (loadError) {
        return <Feedback errors={[loadError]}/>;
    }

    if (loading) {
        return <SimpleSpinner message={t("features.admin.artist.message.loading")}/>;
    }

    if (!artist) {
        return <Feedback warnings={[t("features.admin.artist.message.empty")]}/>;
    }

    return (
        <>
            <h1>{artist.name}</h1>

            <Feedback errors={[editError]} successes={[editSuccess]}/>

            {artist.description && (
                <p>{artist.description}</p>
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label" htmlFor="name">
                        {t("forms.name")}
                    </label>

                    <input className="form-control"
                           id="name"
                           name="name"
                           onChange={(event) => {
                               setName(event.target.value);
                           }}
                           required
                           type="text"
                           value={name}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label" htmlFor="description">
                        {t("forms.description")}
                    </label>

                    <textarea className="form-control"
                              id="description"
                              name="description"
                              onChange={(event) => {
                                  setDescription(event.target.value);
                              }}
                              rows={5}
                              value={description}
                    />
                </div>

                <button className="btn btn-primary" disabled={isSubmitting} type="submit">
                    {isSubmitting
                        ? t("features.admin.artist.edit.submitting")
                        : t("features.admin.artist.edit.submit")}
                </button>
            </form>
        </>
    );
};