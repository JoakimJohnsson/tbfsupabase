import type { SubmitEvent } from "react";
import { useTranslation } from "react-i18next";
import { faFloppyDisk, faXmark } from "@fortawesome/pro-solid-svg-icons";
import { FormInput } from "../../../../components/form/FormInput";
import { ImageUploader } from "../../../../components/form/ImageUploader";
import { ToolButton } from "../../../../components/buttons/ToolButton";
import { ToolButtonGroup } from "../../../../components/buttons/ToolButtonGroup";
import type { Person } from "../../../../types";

interface IArtistMemberEdit {
    member: Person;
    editFirstName: string;
    onFirstNameChange: (value: string) => void;
    editLastName: string;
    onLastNameChange: (value: string) => void;
    editImageFile: File | null;
    onEditImageFileSelect: (file: File | null) => void;
    currentEditImageUrl: string | null;
    onRemoveCurrentEditImage: () => void;
    isSaving: boolean;
    onSave: (event: SubmitEvent<HTMLFormElement>) => Promise<void>;
    onCancel: () => void;
}

export const ArtistMemberEdit = ({
    member,
    editFirstName,
    onFirstNameChange,
    editLastName,
    onLastNameChange,
    editImageFile,
    onEditImageFileSelect,
    currentEditImageUrl,
    onRemoveCurrentEditImage,
    isSaving,
    onSave,
    onCancel,
}: IArtistMemberEdit) => {
    const { t } = useTranslation();

    return (
        <li className="list-group-item bg-body-tertiary p-3">
            <form onSubmit={onSave}>
                <h3 className="h5">{t("features.admin.members.editPersonTitle")}</h3>
                <div className="row g-2 mb-3">
                    <div className="col-12 col-sm-6">
                        <FormInput
                            id={`edit-first-name-${member.id}`}
                            label={t("forms.firstName")}
                            name="firstName"
                            onChange={onFirstNameChange}
                            required
                            value={editFirstName}
                        />
                    </div>
                    <div className="col-12 col-sm-6">
                        <FormInput
                            id={`edit-last-name-${member.id}`}
                            label={t("forms.lastName")}
                            name="lastName"
                            onChange={onLastNameChange}
                            required
                            value={editLastName}
                        />
                    </div>
                </div>

                <ImageUploader
                    currentImageUrl={currentEditImageUrl}
                    disabled={isSaving}
                    id={`edit-person-image-${member.id}`}
                    label={t("forms.personImage")}
                    onFileSelect={onEditImageFileSelect}
                    onRemoveCurrent={onRemoveCurrentEditImage}
                    selectedFile={editImageFile}
                />

                <ToolButtonGroup className="mt-3">
                    <ToolButton
                        disabled={isSaving}
                        icon={faFloppyDisk}
                        text={isSaving ? t("common.loading") : t("common.save")}
                        type="submit"
                        variant="primary"
                    />
                    <ToolButton
                        disabled={isSaving}
                        icon={faXmark}
                        onClick={onCancel}
                        text={t("common.cancel")}
                        variant="secondary"
                    />
                </ToolButtonGroup>
            </form>
        </li>
    );
};
