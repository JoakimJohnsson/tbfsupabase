import { useEffect, useState, type SubmitEvent } from "react";
import { useTranslation } from "react-i18next";
import { faUserGroup } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { Person, SimpleMessage } from "../../../../types";
import { getArtistMembers } from "../../../persons/api/getArtistMembers";
import { addArtistMember } from "../../../persons/api/addArtistMember";
import { removeArtistMember } from "../../../persons/api/removeArtistMember";
import { createPerson } from "../../../persons/api/createPerson";
import { updatePerson } from "../../../persons/api/updatePerson";
import { deleteImageFromStorage, uploadImage } from "../../../../lib/supabase/storage";
import { Card } from "../../../../components/cards/Card";
import { CardBody } from "../../../../components/cards/CardBody";
import { Feedback } from "../../../../components/feedback/Feedback";
import { ConfirmModal } from "../../../../components/feedback/ConfirmModal";
import { SimpleSpinner } from "../../../../components/spinners/SimpleSpinner";
import { isAbortError } from "../../../../lib/asyncHelpers/withAbortSignal";
import { ArtistMemberToolRow } from "./ArtistMemberToolRow";
import { ArtistMemberEdit } from "./ArtistMemberEdit";
import { ArtistMembersAdd } from "./ArtistMembersAdd";

interface IArtistMembersManager {
    artistId: string;
    availablePersons: Person[];
    onPersonsUpdated: () => void;
}

export const ArtistMembersManager = ({ artistId, availablePersons, onPersonsUpdated }: IArtistMembersManager) => {
    const { t } = useTranslation();

    const [members, setMembers] = useState<Person[]>([]);
    const [memberToRemove, setMemberToRemove] = useState<Person | null>(null);
    const [isRemovingMember, setIsRemovingMember] = useState(false);
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
            const addedPerson = availablePersons.find((person) => person.id === selectedPersonId);
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
        setIsRemovingMember(true);
        setFeedbackError(null);
        setFeedbackSuccess(null);

        try {
            await removeArtistMember(artistId, person.id);
            setMembers((cur) => cur.filter((member) => member.id !== person.id));
            setFeedbackSuccess(t("features.admin.members.removeSuccess"));
        } catch (err) {
            console.error(err);
            setFeedbackError(t("features.admin.members.removeError"));
        } finally {
            setIsRemovingMember(false);
            setMemberToRemove(null);
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
        if (editingPersonId === person.id) {
            handleCancelEditPerson();
            return;
        }

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
            const currentPerson = members.find((member) => member.id === editingPersonId);
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
                    .map((member) => (member.id === updated.id ? updated : member))
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
        <Card className="mb-4">
            <CardBody>
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
                        {members.map((member) => {
                            const isEditing = editingPersonId === member.id;

                            if (isEditing) {
                                return (
                                    <ArtistMemberEdit
                                        currentEditImageUrl={currentEditImageUrl}
                                        editFirstName={editFirstName}
                                        editImageFile={editImageFile}
                                        editLastName={editLastName}
                                        isSaving={isUpdatingPerson}
                                        key={member.id}
                                        member={member}
                                        onCancel={handleCancelEditPerson}
                                        onEditImageFileSelect={setEditImageFile}
                                        onFirstNameChange={setEditFirstName}
                                        onLastNameChange={setEditLastName}
                                        onRemoveCurrentEditImage={() => setCurrentEditImageUrl(null)}
                                        onSave={handleSaveEditPerson}
                                    />
                                );
                            }

                            return (
                                <ArtistMemberToolRow
                                    key={member.id}
                                    member={member}
                                    onDelete={setMemberToRemove}
                                    onStartEdit={handleStartEditPerson}
                                />
                            );
                        })}
                    </ul>
                )}

                <ArtistMembersAdd
                    availablePersons={nonMemberPersons}
                    isAdding={isAdding}
                    isCreatingPerson={isCreatingPerson}
                    newFirstName={newFirstName}
                    newLastName={newLastName}
                    newPersonImageFile={newPersonImageFile}
                    onAddExistingMember={handleAddExistingMember}
                    onCreateNewPerson={handleCreateNewPerson}
                    onNewFirstNameChange={setNewFirstName}
                    onNewLastNameChange={setNewLastName}
                    onNewPersonImageFileSelect={setNewPersonImageFile}
                    onSelectedPersonIdChange={setSelectedPersonId}
                    onToggleNewPersonForm={() => {
                        setShowNewPersonForm((prev) => !prev);
                        handleCancelEditPerson();
                    }}
                    selectedPersonId={selectedPersonId}
                    showNewPersonForm={showNewPersonForm}
                />

                <ConfirmModal
                    confirmText={t("common.remove")}
                    isOpen={memberToRemove !== null}
                    isPending={isRemovingMember}
                    message={
                        memberToRemove
                            ? t("features.admin.members.removeConfirm", {
                                  name: `${memberToRemove.first_name} ${memberToRemove.last_name}`,
                              })
                            : ""
                    }
                    onCancel={() => setMemberToRemove(null)}
                    onConfirm={() => {
                        if (memberToRemove) void handleRemoveMember(memberToRemove);
                    }}
                    title={t("common.remove")}
                />
            </CardBody>
        </Card>
    );
};
