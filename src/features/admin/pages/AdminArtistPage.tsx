import { Link, useNavigate, useParams } from "react-router";
import { useTranslation } from "react-i18next";
import { Feedback } from "../../../components/feedback/Feedback";
import { SimpleSpinner } from "../../../components/spinners/SimpleSpinner";
import { useArtist } from "../../artists/hooks/useArtist";
import { useEffect, useState } from "react";
import { updateArtist } from "../../artists/api/updateArtist";
import type { SubmitEvent } from "react";
import type { SimpleMessage } from "../../../types";
import { deleteArtist } from "../../artists/api/deleteArtist";
import { useArtistRecords } from "../../records/hooks/useArtistRecords";
import { ToolButton } from "../../../components/buttons/ToolButton";
import { ListRowItem } from "../../../components/lists/ListRowItem";
import { faPenToSquare } from "@fortawesome/pro-solid-svg-icons";
import { FormInput } from "../../../components/form/FormInput";
import { FormTextArea } from "../../../components/form/FormTextArea";
import { ImageUploader } from "../../../components/form/ImageUploader";
import { RecordBadges } from "../../records/components/RecordBadges";
import { deleteImageFromStorage, uploadImage } from "../../../lib/supabase/storage";

export const AdminArtistPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [artistImageFile, setArtistImageFile] = useState<File | null>(null);
    const [currentArtistImageUrl, setCurrentArtistImageUrl] = useState<string | null>(null);

    const loadErrorMessage = t("features.admin.artist.error.loadError");
    const editErrorMessage = t("features.admin.artist.edit.error.editError");
    const editSuccessMessage = t("features.admin.artist.edit.success.editSuccess");
    const deleteErrorMessage = t("features.admin.artist.delete.error.deleteError");
    const recordsLoadErrorMessage = t("features.admin.artist.error.loadRecordsError");

    const { artistSlug } = useParams();
    const { artist, loadError, loading, setArtist } = useArtist({
        artistSlug,
        loadErrorMessage,
    });
    const { records, recordsLoadError, recordsLoading } = useArtistRecords({
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
        setCurrentArtistImageUrl(artist.image_path ?? null);
        setArtistImageFile(null);
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
            let imagePath: string | null | undefined = currentArtistImageUrl;

            if (artistImageFile) {
                if (artist.image_path) {
                    await deleteImageFromStorage(artist.image_path);
                }
                imagePath = await uploadImage(artistImageFile, "artists", name.trim());
            } else if (currentArtistImageUrl === null) {
                if (artist.image_path) {
                    await deleteImageFromStorage(artist.image_path);
                }
                imagePath = null;
            }

            const updatedArtist = await updateArtist({
                id: artist.id,
                name: name.trim(),
                description: description.trim(),
                image_path: imagePath,
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
            await deleteArtist(artist.id, artist.image_path);
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
        return <Feedback errors={[loadError]} />;
    }

    if (loading) {
        return <SimpleSpinner message={t("features.admin.artist.message.loading")} />;
    }

    if (!artist) {
        return <Feedback warnings={[t("features.admin.artist.message.empty")]} />;
    }

    return (
        <>
            <h1>{artist.name}</h1>

            <Feedback errors={[editError, deleteError]} successes={[editSuccess]} />

            {artist.description && <p>{artist.description}</p>}

            <h2>{t("features.admin.artist.edit.title")}</h2>

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
                    rows={5}
                    value={description}
                />

                <ImageUploader
                    currentImageUrl={currentArtistImageUrl}
                    disabled={isSubmitting}
                    id="artist-image"
                    label={t("forms.artistImage")}
                    onFileSelect={setArtistImageFile}
                    onRemoveCurrent={() => setCurrentArtistImageUrl(null)}
                    selectedFile={artistImageFile}
                />

                <button className="btn btn-primary" disabled={isSubmitting} type="submit">
                    {isSubmitting
                        ? t("features.admin.artist.edit.submitting")
                        : t("features.admin.artist.edit.submitEdit")}
                </button>
            </form>

            <div className="d-flex justify-content-between align-items-center mt-5 mb-3">
                <h2 className="mb-0">{t("features.admin.artist.recordsTitle")}</h2>
                <Link className="btn btn-outline-primary" to="/admin/records">
                    {t("navigation.adminRecords")}
                </Link>
            </div>

            {recordsLoadError && <Feedback errors={[recordsLoadError]} />}

            {recordsLoading && <SimpleSpinner />}

            {!recordsLoading && !recordsLoadError && records.length === 0 && (
                <p>{t("features.admin.artist.message.recordsEmpty")}</p>
            )}

            {records.length > 0 && (
                <ul className="list-group mb-4">
                    {records.map((record) => (
                        <ListRowItem
                            actions={
                                <ToolButton
                                    ariaLabel={`${t("common.edit")} ${record.name}`}
                                    icon={faPenToSquare}
                                    text={t("common.edit")}
                                    to={`/admin/records?edit=${record.id}`}
                                    variant="outline-secondary"
                                />
                            }
                            key={record.id}
                        >
                            <div className="d-flex align-items-center flex-wrap gap-2">
                                <strong>{record.name}</strong>
                                {record.year && ` (${record.year})`}
                                <RecordBadges format={record.format} type={record.type} />
                            </div>
                        </ListRowItem>
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
