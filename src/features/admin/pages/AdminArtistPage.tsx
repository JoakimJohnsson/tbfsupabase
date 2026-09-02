// src/features/admin/pages/AdminArtistPage.tsx
import {Link, useNavigate, useParams} from "react-router";
import {useTranslation} from "react-i18next";
import SimpleSpinner from "../../../components/spinners/SimpleSpinner";
import Feedback from "../../../components/feedback/Feedback";
import {useArtist} from "../../artists/hooks/useArtist";
import {useEffect, useState} from "react";
import {updateArtist} from "../../artists/api/updateArtist";
import type {SubmitEvent} from "react";
import type {SimpleMessage} from "../../../types";
import {deleteArtist} from "../../artists/api/deleteArtist";
import {useArtistRecords} from "../../records/hooks/useArtistRecords";

export const AdminArtistPage = () => {
    const {t} = useTranslation();
    const navigate = useNavigate();

    const loadErrorMessage = t("features.admin.artist.error.loadError");
    const editErrorMessage = t("features.admin.artist.edit.error.editError");
    const editSuccessMessage = t("features.admin.artist.edit.success.editSuccess");
    const deleteErrorMessage = t("features.admin.artist.delete.error.deleteError");
    const recordsLoadErrorMessage = t("features.admin.artist.error.loadRecordsError");

    const {artistSlug} = useParams();
    const {artist, loadError, loading, setArtist} = useArtist({
        artistSlug,
        loadErrorMessage,
    });
    const {records, recordsLoadError, recordsLoading} = useArtistRecords({
        artistId: artist?.id,
        recordsLoadErrorMessage,
    });

    // Artist edit state
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [editError, setEditError] = useState<SimpleMessage | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editSuccess, setEditSuccess] = useState<SimpleMessage | null>(null);
    const [deleteError, setDeleteError] = useState<SimpleMessage | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

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

    const handleDelete = async () => {
        if (!artist) {
            return;
        }

        const confirmed = window.confirm(
            t("features.admin.artist.delete.confirm", {
                name: artist.name,
            }),
        );

        if (!confirmed) {
            return;
        }

        setDeleteError(null);
        setIsDeleting(true);

        try {
            await deleteArtist(artist.id);
            navigate("/admin/artists", {
                replace: true,
            });
        } catch (err) {
            console.error(err);
            setDeleteError(deleteErrorMessage);
            setIsDeleting(false);
        }
    };

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

            <Feedback errors={[editError, deleteError]} successes={[editSuccess]}/>

            {artist.description && <p>{artist.description}</p>}

            <h2>{t("features.admin.artist.edit.title")}</h2>

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label" htmlFor="name">
                        {t("forms.name")}
                    </label>

                    <input
                        className="form-control"
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

                    <textarea
                        className="form-control"
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
                        : t("features.admin.artist.edit.submitEdit")}
                </button>
            </form>

            <div className="d-flex justify-content-between align-items-center mt-5 mb-3">
                <h2 className="mb-0">{t("features.admin.artist.recordsTitle")}</h2>
                <Link className="btn btn-outline-primary btn-sm" to="/admin/records">
                    {t("navigation.adminRecords")}
                </Link>
            </div>

            {recordsLoadError && <Feedback errors={[recordsLoadError]}/>}

            {recordsLoading && <SimpleSpinner/>}

            {!recordsLoading && !recordsLoadError && records.length === 0 && (
                <p>{t("features.admin.artist.message.recordsEmpty")}</p>
            )}

            {records.length > 0 && (
                <ul className="list-group mb-4">
                    {records.map((record) => (
                        <li
                            className="list-group-item d-flex justify-content-between align-items-center"
                            key={record.id}
                        >
                            <div>
                                <strong>{record.name}</strong>
                                {record.year && ` (${record.year})`}
                            </div>
                            <Link className="btn btn-sm btn-outline-secondary" to="/admin/records">
                                {t("common.edit")}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}

            <h2>{t("features.admin.artist.delete.title")}</h2>

            <button
                className="btn btn-danger"
                disabled={isDeleting || isSubmitting}
                onClick={() => {
                    void handleDelete();
                }}
                type="button"
            >
                {isDeleting
                    ? t("features.admin.artist.delete.deleting")
                    : t("features.admin.artist.delete.submitDelete")}
            </button>
        </>
    );
};