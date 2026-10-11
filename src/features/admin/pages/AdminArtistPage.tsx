import { useEffect, useState } from "react";
import type { SubmitEvent } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useTranslation } from "react-i18next";
import { faPenToSquare, faTrashCan, faUserPen } from "@fortawesome/pro-solid-svg-icons";
import { useArtist } from "../../artists/hooks/useArtist";
import { updateArtist } from "../../artists/api/updateArtist";
import { deleteArtist } from "../../artists/api/deleteArtist";
import { useArtistRecords } from "../../records/hooks/useArtistRecords";
import { deleteImageFromStorage, uploadImage } from "../../../lib/supabase/storage";
import { Feedback } from "../../../components/feedback/Feedback";
import { SimpleSpinner } from "../../../components/spinners/SimpleSpinner";
import { ToolButton } from "../../../components/buttons/ToolButton";
import { ListRowItem } from "../../../components/lists/ListRowItem";
import { FormInput } from "../../../components/form/FormInput";
import { FormTextArea } from "../../../components/form/FormTextArea";
import { ImageUploader } from "../../../components/form/ImageUploader";
import { AdminPageLayout } from "../../../components/layout/AdminPageLayout";
import { FormCard } from "../../../components/cards/FormCard";
import { EmptyStateCard } from "../../../components/cards/EmptyStateCard";
import { RecordBadges } from "../../records/components/RecordBadges";
import { getPersons } from "../../persons/api/getPersons";
import { ArtistMembersManager } from "../../artists/components/ArtistMembersManager";
import { isAbortError } from "../../../lib/asyncHelpers/withAbortSignal";
import type { Person, SimpleMessage } from "../../../types";

export const AdminArtistPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { artistSlug } = useParams();

    const loadErrorMessage = t("features.admin.artist.error.loadError");
    const editErrorMessage = t("features.admin.artist.edit.error.editError");
    const editSuccessMessage = t("features.admin.artist.edit.success.editSuccess");
    const deleteErrorMessage = t("features.admin.artist.delete.error.deleteError");
    const recordsLoadErrorMessage = t("features.admin.artist.error.loadRecordsError");

    const { artist, loadError, loading, setArtist } = useArtist({
        artistSlug,
        loadErrorMessage,
    });
    const { records, recordsLoadError, recordsLoading } = useArtistRecords({
        artistId: artist?.id,
        recordsLoadErrorMessage,
    });

    const [availablePersons, setAvailablePersons] = useState<Person[]>([]);

    // Form state
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [artistImageFile, setArtistImageFile] = useState<File | null>(null);
    const [currentArtistImageUrl, setCurrentArtistImageUrl] = useState<string | null>(null);

    // Feedback & submission state
    const [editError, setEditError] = useState<SimpleMessage>(null);
    const [editSuccess, setEditSuccess] = useState<SimpleMessage>(null);
    const [deleteError, setDeleteError] = useState<SimpleMessage>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Load available persons for member assignment
    useEffect(() => {
        const controller = new AbortController();

        const loadPersons = async () => {
            try {
                const data = await getPersons(controller.signal);
                setAvailablePersons(data);
            } catch (err) {
                if (!isAbortError(err)) {
                    console.error("Failed to load persons:", err);
                }
            }
        };

        void loadPersons();

        return () => {
            controller.abort();
        };
    }, []);

    const refreshPersons = async () => {
        try {
            const data = await getPersons();
            setAvailablePersons(data);
        } catch (err) {
            console.error("Failed to refresh persons:", err);
        }
    };

    // Initialize edit fields when artist loads
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

    if (loading) {
        return <SimpleSpinner message={t("features.admin.artist.message.loading")} />;
    }

    if (loadError) {
        return <Feedback errors={[loadError]} />;
    }

    if (!artist) {
        return <Feedback warnings={[t("features.admin.artist.message.empty")]} />;
    }

    return (
        <AdminPageLayout
            lead={artist.name}
            sidebar={
                <div className="sticky-top" style={{ top: "1rem" }}>
                    <FormCard icon={faUserPen} title={t("features.admin.artist.edit.title")}>
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

                            <ImageUploader
                                currentImageUrl={currentArtistImageUrl}
                                disabled={isSubmitting}
                                id="artist-image"
                                label={t("forms.artistImage")}
                                onFileSelect={setArtistImageFile}
                                onRemoveCurrent={() => setCurrentArtistImageUrl(null)}
                                selectedFile={artistImageFile}
                            />

                            <div className="d-flex flex-column gap-2 mt-4">
                                <button className="btn btn-primary w-100" disabled={isSubmitting} type="submit">
                                    {isSubmitting
                                        ? t("features.admin.artist.edit.submitting")
                                        : t("features.admin.artist.edit.submitEdit")}
                                </button>

                                <hr aria-hidden="true" className="my-2" />

                                <ToolButton
                                    className="w-100 justify-content-center"
                                    disabled={isDeleting || isSubmitting}
                                    icon={faTrashCan}
                                    onClick={() => {
                                        void handleDelete();
                                    }}
                                    text={
                                        isDeleting
                                            ? t("features.admin.artist.delete.deleting")
                                            : t("features.admin.artist.delete.submitDelete")
                                    }
                                    variant="outline-danger"
                                />
                            </div>
                        </form>
                    </FormCard>
                </div>
            }
            title={t("features.admin.artist.title")}
        >
            <Feedback errors={[editError, deleteError, recordsLoadError]} successes={[editSuccess]} />

            {/* Band Members Section */}
            <ArtistMembersManager
                artistId={artist.id}
                availablePersons={availablePersons}
                onPersonsUpdated={refreshPersons}
            />

            {/* Discography Header */}
            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                <div>
                    <h2 className="h4 fw-bold mb-0">{t("features.admin.artist.recordsTitle")}</h2>
                    <span className="text-secondary small">
                        {records.length}{" "}
                        {records.length === 1 ? t("features.admin.record.title") : t("features.admin.records.title")}
                    </span>
                </div>

                <Link className="btn btn-outline-primary btn-sm" to="/admin/records">
                    {t("navigation.adminRecords")}
                </Link>
            </div>

            {/* Records List */}
            {recordsLoading ? (
                <SimpleSpinner />
            ) : records.length === 0 ? (
                <EmptyStateCard message={t("features.admin.artist.message.recordsEmpty")} />
            ) : (
                <ul className="list-group shadow-sm">
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
                                {record.year && <span className="text-secondary">({record.year})</span>}
                                <RecordBadges format={record.format} type={record.type} />
                            </div>
                        </ListRowItem>
                    ))}
                </ul>
            )}
        </AdminPageLayout>
    );
};
