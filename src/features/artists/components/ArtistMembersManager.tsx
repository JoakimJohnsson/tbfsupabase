import { useState, useEffect } from "react";
import type { SubmitEvent } from "react";
import { useTranslation } from "react-i18next";
import { faPenToSquare, faPlus, faTrashCan, faUserGroup } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { Person, SimpleMessage } from "../../../types";
import { getArtistMembers } from "../../persons/api/getArtistMembers";
import { addArtistMember } from "../../persons/api/addArtistMember";
import { removeArtistMember } from "../../persons/api/removeArtistMember";
import { createPerson } from "../../persons/api/createPerson";
import { updatePerson } from "../../persons/api/updatePerson";
import { uploadImage, deleteImageFromStorage } from "../../../lib/supabase/storage";
import { ToolButton } from "../../../components/buttons/ToolButton";
import { ListRowItem } from "../../../components/lists/ListRowItem";
import { Feedback } from "../../../components/feedback/Feedback";
import { SimpleSpinner } from "../../../components/spinners/SimpleSpinner";
import { ImageUploader } from "../../../components/form/ImageUploader";
import { isAbortError } from "../../../lib/asyncHelpers/withAbortSignal";

interface IArtistMembersManager {
    artistId: string;
    availablePersons: Person[];
    onPersonsUpdated: () => void;
}

export const ArtistMembersManager = ({ artistId, availablePersons, onPersonsUpdated }: IArtistMembersManager) => {
    const { t } = useTranslation();

    const [members, setMembers] = useState<Person[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPersonId, setSelectedPersonId] = useState("");
    const [isAdding, setIsAdding] = useState(false);
    const [feedbackError, setFeedbackError] = useState<SimpleMessage>(null);
    const [feedbackSuccess, setFeedbackSuccess] = useState<SimpleMessage>(null);

    // Create new person form state
    const [showNewPersonForm, setShowNewPersonForm] = useState(false);
    const [newFirstName, setNewFirstName] = useState("");
    const [newLastName, setNewLastName] = useState("");
    const [newPersonImageFile, setNewPersonImageFile] = useState<File | null>(null);
    const [isCreatingPerson, setIsCreatingPerson] = useState(false);

    // Edit person state
    const [editingPersonId, setEditingPersonId] = useState<string | null>(null);
    const [editFirstName, setEditFirstName] = useState("");
    const [editLastName, setEditLastName] = useState("");
    const [editImageFile, setEditImageFile] = useState<File | null>(null);
    const [currentEditImageUrl, setCurrentEditImageUrl] = useState<string | null>(null);
    const [isUpdatingPerson, setIsUpdatingPerson] = useState(false);

    useEffect(() => {
        const controller = new AbortController();
        setLoading(true);

        const load = async () => {
            try {
                const data = await getArtistMembers(artistId, controller.signal);
                setMembers(data);
            } catch (err) {
                if (!isAbortError(err)) {
                    console.error(err);
                    setFeedbackError(t("features.admin.members.loadError"));
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        void load();

        return () => {
            controller.abort();
        };
    }, [artistId, t]);

    const nonMemberPersons = availablePersons.filter((person) => !members.some((member) => member.id === person.id));

    const handleAddExistingMember = async () => {
        if (!selectedPersonId) return;

        setIsAdding(true);
        setFeedbackError(null);
        setFeedbackSuccess(null);

        try {
            await addArtistMember(artistId, selectedPersonId);
            const addedPerson = availablePersons.find((p) => p.id === selectedPersonId);
            if (addedPerson) {
                setMembers((cur) => [...cur, addedPerson].sort((a, b) => a.first_name.localeCompare(b.first_name)));
            }
            setSelectedPersonId("");
            setFeedbackSuccess(t("features.admin.members.addSuccess"));
        } catch (err) {
            console.error(err);
            setFeedbackError(t("features.admin.members.addError"));
        } finally {
            setIsAdding(false);
        }
    };

    const handleRemoveMember = async (person: Person) => {
        const fullName = `${person.first_name} ${person.last_name}`;
        if (!window.confirm(t("features.admin.members.removeConfirm", { name: fullName }))) {
            return;
        }

        try {
            await removeArtistMember(artistId, person.id);
            setMembers((cur) => cur.filter((m) => m.id !== person.id));
            setFeedbackSuccess(t("features.admin.members.removeSuccess"));
        } catch (err) {
            console.error(err);
            setFeedbackError(t("features.admin.members.removeError"));
        }
    };

    const handleCreateNewPerson = async (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();

        const first = newFirstName.trim();
        const last = newLastName.trim();

        if (!first || !last) {
            setFeedbackError(t("features.admin.members.invalidNameError"));
            return;
        }

        setIsCreatingPerson(true);
        setFeedbackError(null);
        setFeedbackSuccess(null);

        try {
            let imagePath: string | undefined;

            if (newPersonImageFile) {
                imagePath = await uploadImage(newPersonImageFile, "persons", `${first}-${last}`);
            }

            const created = await createPerson({
                first_name: first,
                last_name: last,
                image_path: imagePath,
            });

            await addArtistMember(artistId, created.id);

            setMembers((cur) => [...cur, created].sort((a, b) => a.first_name.localeCompare(b.first_name)));
            setNewFirstName("");
            setNewLastName("");
            setNewPersonImageFile(null);
            setShowNewPersonForm(false);
            onPersonsUpdated();
            setFeedbackSuccess(t("features.admin.members.createAndAddSuccess"));
        } catch (err) {
            console.error(err);
            setFeedbackError(t("features.admin.members.createError"));
        } finally {
            setIsCreatingPerson(false);
        }
    };

    const handleStartEditPerson = (person: Person) => {
        setEditingPersonId(person.id);
        setEditFirstName(person.first_name);
        setEditLastName(person.last_name);
        setCurrentEditImageUrl(person.image_path ?? null);
        setEditImageFile(null);
        setShowNewPersonForm(false);
    };

    const handleCancelEditPerson = () => {
        setEditingPersonId(null);
        setEditFirstName("");
        setEditLastName("");
        setEditImageFile(null);
        setCurrentEditImageUrl(null);
    };

    const handleSaveEditPerson = async (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!editingPersonId) return;

        const first = editFirstName.trim();
        const last = editLastName.trim();

        if (!first || !last) {
            setFeedbackError(t("features.admin.members.invalidNameError"));
            return;
        }

        setIsUpdatingPerson(true);
        setFeedbackError(null);
        setFeedbackSuccess(null);

        try {
            const currentPerson = members.find((m) => m.id === editingPersonId);
            let imagePath: string | null | undefined = currentEditImageUrl;

            if (editImageFile) {
                if (currentPerson?.image_path) {
                    await deleteImageFromStorage(currentPerson.image_path);
                }
                imagePath = await uploadImage(editImageFile, "persons", `${first}-${last}`);
            } else if (currentEditImageUrl === null && currentPerson?.image_path) {
                await deleteImageFromStorage(currentPerson.image_path);
                imagePath = null;
            }

            const updated = await updatePerson({
                id: editingPersonId,
                first_name: first,
                last_name: last,
                image_path: imagePath,
            });

            setMembers((cur) =>
                cur
                    .map((m) => (m.id === updated.id ? updated : m))
                    .sort((a, b) => a.first_name.localeCompare(b.first_name)),
            );

            handleCancelEditPerson();
            onPersonsUpdated();
            setFeedbackSuccess(t("features.admin.members.editSuccess"));
        } catch (err) {
            console.error(err);
            setFeedbackError(t("features.admin.members.editError"));
        } finally {
            setIsUpdatingPerson(false);
        }
    };

    return (
        <div className="card shadow-sm border-0 bg-body-tertiary mb-4">
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h2 className="h5 card-title fw-bold mb-0 d-flex align-items-center gap-2">
                        <FontAwesomeIcon className="text-primary" icon={faUserGroup} />
                        {t("features.admin.members.title")}
                    </h2>
                    <span className="text-secondary small">
                        {members.length}{" "}
                        {members.length === 1
                            ? t("features.admin.members.member")
                            : t("features.admin.members.members")}
                    </span>
                </div>

                <Feedback errors={[feedbackError]} successes={[feedbackSuccess]} />

                {loading ? (
                    <SimpleSpinner />
                ) : members.length === 0 ? (
                    <p className="text-muted small mb-3">{t("features.admin.members.noMembers")}</p>
                ) : (
                    <ul className="list-group shadow-sm mb-3">
                        {members.map((member) => (
                            <ListRowItem
                                actions={
                                    <>
                                        <ToolButton
                                            ariaLabel={`${t("common.edit")} ${member.first_name} ${member.last_name}`}
                                            text={t("common.edit")}
                                            icon={faPenToSquare}
                                            onClick={() => handleStartEditPerson(member)}
                                            size="sm"
                                            variant="outline-secondary"
                                        />
                                        <ToolButton
                                            ariaLabel={`${t("common.remove")} ${member.first_name} ${member.last_name}`}
                                            text={t("common.remove")}
                                            icon={faTrashCan}
                                            onClick={() => void handleRemoveMember(member)}
                                            size="sm"
                                            variant="outline-danger"
                                        />
                                    </>
                                }
                                className="py-2"
                                key={member.id}
                            >
                                <div className="d-flex align-items-center gap-2">
                                    <div
                                        className="bg-secondary-subtle text-muted rounded-circle d-flex align-items-center justify-content-center overflow-hidden flex-shrink-0 border"
                                        style={{ width: "32px", height: "32px" }}
                                    >
                                        {member.image_path ? (
                                            <img
                                                alt={`${member.first_name} ${member.last_name}`}
                                                className="w-100 h-100 object-fit-cover"
                                                src={member.image_path}
                                            />
                                        ) : (
                                            <span className="fw-bold small">{member.first_name.charAt(0)}</span>
                                        )}
                                    </div>
                                    <span className="fw-semibold">
                                        {member.first_name} {member.last_name}
                                    </span>
                                </div>
                            </ListRowItem>
                        ))}
                    </ul>
                )}

                {/* Edit Person Modal / Inline Form */}
                {editingPersonId && (
                    <form className="mb-3 p-3 border rounded bg-body" onSubmit={handleSaveEditPerson}>
                        <h6 className="fw-bold mb-3">{t("features.admin.members.editPersonTitle")}</h6>
                        <div className="row g-2 mb-3">
                            <div className="col-12 col-sm-6">
                                <input
                                    className="form-control"
                                    onChange={(e) => setEditFirstName(e.target.value)}
                                    placeholder={t("forms.firstName")}
                                    required
                                    type="text"
                                    value={editFirstName}
                                />
                            </div>
                            <div className="col-12 col-sm-6">
                                <input
                                    className="form-control"
                                    onChange={(e) => setEditLastName(e.target.value)}
                                    placeholder={t("forms.lastName")}
                                    required
                                    type="text"
                                    value={editLastName}
                                />
                            </div>
                        </div>

                        <ImageUploader
                            currentImageUrl={currentEditImageUrl}
                            disabled={isUpdatingPerson}
                            id="edit-person-image"
                            label={t("forms.personImage")}
                            onFileSelect={setEditImageFile}
                            onRemoveCurrent={() => setCurrentEditImageUrl(null)}
                            selectedFile={editImageFile}
                        />

                        <div className="d-flex gap-2">
                            <button className="btn btn-sm btn-primary" disabled={isUpdatingPerson} type="submit">
                                {isUpdatingPerson ? t("common.loading") : t("common.save")}
                            </button>
                            <button
                                className="btn btn-sm btn-secondary"
                                disabled={isUpdatingPerson}
                                onClick={handleCancelEditPerson}
                                type="button"
                            >
                                {t("common.cancel")}
                            </button>
                        </div>
                    </form>
                )}

                {/* Add existing musician */}
                <div className="d-flex gap-2 flex-wrap mb-2">
                    <select
                        className="form-select flex-grow-1"
                        disabled={isAdding || loading || nonMemberPersons.length === 0}
                        onChange={(e) => setSelectedPersonId(e.target.value)}
                        value={selectedPersonId}
                    >
                        <option value="">
                            {nonMemberPersons.length === 0
                                ? t("features.admin.members.allAssigned")
                                : t("features.admin.members.selectPerson")}
                        </option>
                        {nonMemberPersons.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.first_name} {p.last_name}
                            </option>
                        ))}
                    </select>

                    <button
                        className="btn btn-primary"
                        disabled={!selectedPersonId || isAdding}
                        onClick={() => void handleAddExistingMember()}
                        type="button"
                    >
                        <FontAwesomeIcon className="me-1" icon={faPlus} />
                        {t("features.admin.members.addMember")}
                    </button>
                </div>

                {/* Toggle Quick Person Creation */}
                <div>
                    <button
                        className="btn btn-link btn-sm text-decoration-none px-0"
                        onClick={() => {
                            setShowNewPersonForm((prev) => !prev);
                            handleCancelEditPerson();
                        }}
                        type="button"
                    >
                        {showNewPersonForm ? t("common.cancel") : t("features.admin.members.createNewPrompt")}
                    </button>

                    {showNewPersonForm && (
                        <form className="mt-2 p-3 border rounded bg-body" onSubmit={handleCreateNewPerson}>
                            <h6 className="fw-bold mb-3">{t("features.admin.members.createPersonTitle")}</h6>
                            <div className="row g-2 mb-3">
                                <div className="col-12 col-sm-6">
                                    <input
                                        className="form-control"
                                        onChange={(e) => setNewFirstName(e.target.value)}
                                        placeholder={t("forms.firstName")}
                                        required
                                        type="text"
                                        value={newFirstName}
                                    />
                                </div>
                                <div className="col-12 col-sm-6">
                                    <input
                                        className="form-control"
                                        onChange={(e) => setNewLastName(e.target.value)}
                                        placeholder={t("forms.lastName")}
                                        required
                                        type="text"
                                        value={newLastName}
                                    />
                                </div>
                            </div>

                            <ImageUploader
                                disabled={isCreatingPerson}
                                id="new-person-image"
                                label={t("forms.personImage")}
                                onFileSelect={setNewPersonImageFile}
                                selectedFile={newPersonImageFile}
                            />

                            <button className="btn btn-sm btn-primary" disabled={isCreatingPerson} type="submit">
                                {isCreatingPerson ? t("common.loading") : t("features.admin.members.createAndAdd")}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};
