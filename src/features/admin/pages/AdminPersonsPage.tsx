import { type SubmitEvent, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { faPenToSquare, faPlus, faTrashCan, faUser, faUserPen } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { createPerson } from "../../persons/api/createPerson";
import { updatePerson } from "../../persons/api/updatePerson";
import { deletePerson } from "../../persons/api/deletePerson";
import { usePersons } from "../../persons/hooks/usePersons";
import { uploadImage, deleteImageFromStorage } from "../../../lib/supabase/storage";
import { AdminPageLayout } from "../../../components/layout/AdminPageLayout";
import { FormCard } from "../../../components/cards/FormCard";
import { EmptyStateCard } from "../../../components/cards/EmptyStateCard";
import { Feedback } from "../../../components/feedback/Feedback";
import { ConfirmModal } from "../../../components/feedback/ConfirmModal";
import { FormInput } from "../../../components/form/FormInput";
import { ImageUploader } from "../../../components/form/ImageUploader";
import { ListRowItem } from "../../../components/lists/ListRowItem";
import { SearchToolbar } from "../../../components/search/SearchToolbar";
import { SimpleSpinner } from "../../../components/spinners/SimpleSpinner";
import { ToolButton } from "../../../components/buttons/ToolButton";
import type { Person, SimpleMessage } from "../../../types";

export const AdminPersonsPage = () => {
    const { t } = useTranslation();

    const { persons, setPersons, loading, loadError } = usePersons({
        loadErrorMessage: t("features.admin.members.loadError"),
    });

    const [searchTerm, setSearchTerm] = useState("");
    const [submitError, setSubmitError] = useState<SimpleMessage>(null);
    const [submitSuccess, setSubmitSuccess] = useState<SimpleMessage>(null);

    // Form state (handles both create and edit)
    const [editingPersonId, setEditingPersonId] = useState<string | null>(null);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [personImageFile, setPersonImageFile] = useState<File | null>(null);
    const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
    const [originalImagePath, setOriginalImagePath] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Delete state
    const [personToDelete, setPersonToDelete] = useState<Person | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const filteredPersons = useMemo(() => {
        const query = searchTerm.trim().toLowerCase();
        if (!query) return persons;
        return persons.filter((p) => `${p.first_name} ${p.last_name}`.toLowerCase().includes(query));
    }, [persons, searchTerm]);

    const handleStartEdit = (person: Person) => {
        setSubmitError(null);
        setSubmitSuccess(null);
        setEditingPersonId(person.id);
        setFirstName(person.first_name);
        setLastName(person.last_name);
        setCurrentImageUrl(person.image_path ?? null);
        setOriginalImagePath(person.image_path ?? null);
        setPersonImageFile(null);
    };

    const handleCancelEdit = () => {
        setEditingPersonId(null);
        setFirstName("");
        setLastName("");
        setPersonImageFile(null);
        setCurrentImageUrl(null);
        setOriginalImagePath(null);
    };

    const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();

        const first = firstName.trim();
        const last = lastName.trim();

        if (!first || !last) {
            setSubmitError(t("features.admin.members.invalidNameError"));
            return;
        }

        setIsSubmitting(true);
        setSubmitError(null);
        setSubmitSuccess(null);

        try {
            let imagePath: string | null | undefined = currentImageUrl;
            const previousPath = originalImagePath;

            // Handle image replacement/upload
            if (personImageFile) {
                if (previousPath) {
                    await deleteImageFromStorage(previousPath);
                }
                imagePath = await uploadImage(personImageFile, "persons", `${first}-${last}`);
            } else if (currentImageUrl === null && previousPath) {
                await deleteImageFromStorage(previousPath);
                imagePath = null;
            }

            if (editingPersonId) {
                // Update existing person
                const updated = await updatePerson({
                    id: editingPersonId,
                    first_name: first,
                    last_name: last,
                    image_path: imagePath,
                });

                setPersons((cur) =>
                    cur
                        .map((p) => (p.id === updated.id ? updated : p))
                        .sort((a, b) => a.first_name.localeCompare(b.first_name)),
                );

                handleCancelEdit();
                setSubmitSuccess(t("features.admin.persons.edit.success"));
            } else {
                // Create new person
                const created = await createPerson({
                    first_name: first,
                    last_name: last,
                    image_path: imagePath || undefined,
                });

                setPersons((cur) => [...cur, created].sort((a, b) => a.first_name.localeCompare(b.first_name)));

                handleCancelEdit();
                setSubmitSuccess(t("features.admin.persons.create.success"));
            }
        } catch (err) {
            console.error(err);
            setSubmitError(
                editingPersonId ? t("features.admin.persons.edit.error") : t("features.admin.persons.create.error"),
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (person: Person) => {
        setIsDeleting(true);
        setSubmitError(null);
        setSubmitSuccess(null);

        try {
            await deletePerson(person.id, person.image_path);
            setPersons((cur) => cur.filter((p) => p.id !== person.id));
            if (editingPersonId === person.id) {
                handleCancelEdit();
            }
            setSubmitSuccess(t("features.admin.persons.delete.success"));
        } catch (err) {
            console.error(err);
            setSubmitError(t("features.admin.persons.delete.error"));
        } finally {
            setIsDeleting(false);
            setPersonToDelete(null);
        }
    };

    if (loading) return <SimpleSpinner />;
    if (loadError) return <Feedback errors={[loadError]} />;

    return (
        <AdminPageLayout
            lead={t("features.admin.persons.lead")}
            sidebar={
                <div className="sticky-top-offset">
                    <FormCard
                        icon={editingPersonId ? faUserPen : faPlus}
                        title={
                            editingPersonId
                                ? t("features.admin.persons.edit.title")
                                : t("features.admin.persons.create.title")
                        }
                    >
                        <form onSubmit={handleSubmit}>
                            <FormInput
                                id="first_name"
                                label={t("forms.firstName")}
                                name="first_name"
                                onChange={setFirstName}
                                required
                                value={firstName}
                            />

                            <FormInput
                                id="last_name"
                                label={t("forms.lastName")}
                                name="last_name"
                                onChange={setLastName}
                                required
                                value={lastName}
                            />

                            <ImageUploader
                                currentImageUrl={currentImageUrl}
                                disabled={isSubmitting}
                                id="person-image-upload"
                                label={t("forms.personImage")}
                                onFileSelect={setPersonImageFile}
                                onRemoveCurrent={() => setCurrentImageUrl(null)}
                                selectedFile={personImageFile}
                            />

                            <div className="d-flex gap-2 mt-4">
                                <button className="btn btn-primary flex-grow-1" disabled={isSubmitting} type="submit">
                                    {isSubmitting
                                        ? t("common.loading")
                                        : editingPersonId
                                          ? t("features.admin.persons.edit.submit")
                                          : t("features.admin.persons.create.submit")}
                                </button>
                                {editingPersonId && (
                                    <button
                                        className="btn btn-secondary"
                                        disabled={isSubmitting}
                                        onClick={handleCancelEdit}
                                        type="button"
                                    >
                                        {t("common.cancel")}
                                    </button>
                                )}
                            </div>
                        </form>
                    </FormCard>
                </div>
            }
            title={t("features.admin.persons.title")}
        >
            <Feedback errors={[submitError]} successes={[submitSuccess]} />

            <SearchToolbar
                countText={
                    <>
                        {filteredPersons.length}{" "}
                        {filteredPersons.length === 1
                            ? t("features.admin.members.member")
                            : t("features.admin.members.members")}
                    </>
                }
                onSearchChange={setSearchTerm}
                searchPlaceholder={t("features.admin.persons.search")}
                searchValue={searchTerm}
                showSearch={persons.length > 5}
                title={t("features.admin.persons.list.title")}
            />

            {filteredPersons.length === 0 ? (
                <EmptyStateCard message={t("features.admin.persons.message.empty")} />
            ) : (
                <ul className="list-group shadow-sm mb-4">
                    {filteredPersons.map((person) => {
                        const fullName = `${person.first_name} ${person.last_name}`;
                        const isBeingEdited = editingPersonId === person.id;

                        return (
                            <ListRowItem
                                actions={
                                    <>
                                        <ToolButton
                                            ariaLabel={`${t("common.edit")} ${fullName}`}
                                            icon={faPenToSquare}
                                            onClick={() => handleStartEdit(person)}
                                            size="sm"
                                            text={t("common.edit")}
                                            variant={isBeingEdited ? "primary" : "outline-secondary"}
                                        />
                                        <ToolButton
                                            ariaLabel={`${t("common.delete")} ${fullName}`}
                                            icon={faTrashCan}
                                            onClick={() => setPersonToDelete(person)}
                                            size="sm"
                                            text={t("common.delete")}
                                            variant="outline-danger"
                                        />
                                    </>
                                }
                                className={isBeingEdited ? "bg-primary-subtle" : undefined}
                                key={person.id}
                            >
                                <div className="d-flex align-items-center gap-3">
                                    <div className="tbf-member-avatar">
                                        {person.image_path ? (
                                            <img
                                                alt={fullName}
                                                className="w-100 h-100 object-fit-cover"
                                                src={person.image_path}
                                            />
                                        ) : (
                                            <FontAwesomeIcon icon={faUser} />
                                        )}
                                    </div>
                                    <span className="fw-semibold">{fullName}</span>
                                </div>
                            </ListRowItem>
                        );
                    })}
                </ul>
            )}

            <ConfirmModal
                isOpen={personToDelete !== null}
                isPending={isDeleting}
                message={
                    personToDelete
                        ? t("features.admin.persons.delete.confirm", {
                              name: `${personToDelete.first_name} ${personToDelete.last_name}`,
                          })
                        : ""
                }
                onCancel={() => setPersonToDelete(null)}
                onConfirm={() => {
                    if (personToDelete) void handleDelete(personToDelete);
                }}
                title={t("common.delete")}
            />
        </AdminPageLayout>
    );
};
