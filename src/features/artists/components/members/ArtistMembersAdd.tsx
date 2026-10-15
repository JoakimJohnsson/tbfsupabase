import type { SubmitEvent } from "react";
import { useTranslation } from "react-i18next";
import { faPlus } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FormInput } from "../../../../components/form/FormInput";
import { ImageUploader } from "../../../../components/form/ImageUploader";
import type { Person } from "../../../../types";

interface IArtistMembersAdd {
    availablePersons: Person[];
    selectedPersonId: string;
    onSelectedPersonIdChange: (personId: string) => void;
    onAddExistingMember: () => Promise<void>;
    isAdding: boolean;
    showNewPersonForm: boolean;
    onToggleNewPersonForm: () => void;
    newFirstName: string;
    onNewFirstNameChange: (value: string) => void;
    newLastName: string;
    onNewLastNameChange: (value: string) => void;
    newPersonImageFile: File | null;
    onNewPersonImageFileSelect: (file: File | null) => void;
    isCreatingPerson: boolean;
    onCreateNewPerson: (event: SubmitEvent<HTMLFormElement>) => Promise<void>;
}

export const ArtistMembersAdd = ({
    availablePersons,
    selectedPersonId,
    onSelectedPersonIdChange,
    onAddExistingMember,
    isAdding,
    showNewPersonForm,
    onToggleNewPersonForm,
    newFirstName,
    onNewFirstNameChange,
    newLastName,
    onNewLastNameChange,
    newPersonImageFile,
    onNewPersonImageFileSelect,
    isCreatingPerson,
    onCreateNewPerson,
}: IArtistMembersAdd) => {
    const { t } = useTranslation();

    return (
        <div className="mt-3">
            {/* Add existing musician select row */}
            <div className="d-flex gap-2 flex-wrap mb-2">
                <select
                    className="form-select flex-grow-1"
                    disabled={isAdding || availablePersons.length === 0}
                    onChange={(event) => onSelectedPersonIdChange(event.target.value)}
                    value={selectedPersonId}
                >
                    <option value="">
                        {availablePersons.length === 0
                            ? t("features.admin.members.allAssigned")
                            : t("features.admin.members.selectPerson")}
                    </option>
                    {availablePersons.map((person) => (
                        <option key={person.id} value={person.id}>
                            {person.first_name} {person.last_name}
                        </option>
                    ))}
                </select>

                <button
                    className="btn btn-primary"
                    disabled={!selectedPersonId || isAdding}
                    onClick={() => void onAddExistingMember()}
                    type="button"
                >
                    <FontAwesomeIcon className="me-1" icon={faPlus} />
                    {t("features.admin.members.addMember")}
                </button>
            </div>

            {/* Quick person creation toggle */}
            <div>
                <button
                    className="btn btn-secondary btn-sm text-decoration-none"
                    onClick={onToggleNewPersonForm}
                    type="button"
                >
                    {showNewPersonForm ? t("common.cancel") : t("features.admin.members.createNewPrompt")}
                </button>

                {showNewPersonForm && (
                    <form className="mt-2 p-3 rounded bg-body" onSubmit={onCreateNewPerson}>
                        <h6 className="fw-bold mb-3">{t("features.admin.members.createPersonTitle")}</h6>
                        <div className="row g-2 mb-3">
                            <div className="col-12 col-sm-6">
                                <FormInput
                                    id="new-person-first-name"
                                    label={t("forms.firstName")}
                                    name="firstName"
                                    onChange={onNewFirstNameChange}
                                    required
                                    value={newFirstName}
                                />
                            </div>
                            <div className="col-12 col-sm-6">
                                <FormInput
                                    id="new-person-last-name"
                                    label={t("forms.lastName")}
                                    name="lastName"
                                    onChange={onNewLastNameChange}
                                    required
                                    value={newLastName}
                                />
                            </div>
                        </div>

                        <ImageUploader
                            disabled={isCreatingPerson}
                            id="new-person-image-upload"
                            label={t("forms.personImage")}
                            onFileSelect={onNewPersonImageFileSelect}
                            selectedFile={newPersonImageFile}
                        />

                        <button className="btn btn-sm btn-primary" disabled={isCreatingPerson} type="submit">
                            {isCreatingPerson ? t("common.loading") : t("features.admin.members.createAndAdd")}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};
