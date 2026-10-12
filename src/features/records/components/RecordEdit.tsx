import { useTranslation } from "react-i18next";
import type { Artist, RecordWithArtists } from "../../../types";
import { Dispatch, SetStateAction, type SubmitEvent } from "react";
import { ToolButtonGroup } from "../../../components/buttons/ToolButtonGroup";
import { FormInput } from "../../../components/form/FormInput";
import { FormNumberInput } from "../../../components/form/FormNumberInput";
import { FormSelect } from "../../../components/form/FormSelect";
import { FormTextArea } from "../../../components/form/FormTextArea";
import { ImageUploader } from "../../../components/form/ImageUploader";
import { RECORD_FORMATS, RECORD_TYPES } from "../constants";
import { RecordSongsManager } from "./RecordSongsManager";
import { ArtistSelectCheckboxes } from "../../artists/components/ArtistSelectCheckboxes";

interface IRecordEdit {
    record: RecordWithArtists;
    handleSaveEdit: (event: SubmitEvent<HTMLFormElement>) => Promise<void>;
    setEditName: Dispatch<SetStateAction<string>>;
    editName: string;
    setEditYear: Dispatch<SetStateAction<string>>;
    editYear: string;
    setEditFormat: Dispatch<SetStateAction<string>>;
    editFormat: string;
    setEditType: Dispatch<SetStateAction<string>>;
    editType: string;
    setEditDescription: Dispatch<SetStateAction<string>>;
    editDescription: string;
    artists: Artist[];
    editArtistIds: string[];
    handleEditArtistCheckboxChange: (artistId: string) => void;
    editCoverFile: File | null;
    onEditCoverFileSelect: (file: File | null) => void;
    currentCoverUrl: string | null;
    onRemoveCurrentCover: () => void;
    isSubmittingEdit: boolean;
    handleCancelEdit: () => void;
}

export const RecordEdit = ({
    record,
    handleSaveEdit,
    setEditName,
    editName,
    setEditYear,
    editYear,
    setEditFormat,
    editFormat,
    setEditType,
    editType,
    setEditDescription,
    editDescription,
    artists,
    editArtistIds,
    handleEditArtistCheckboxChange,
    editCoverFile,
    onEditCoverFileSelect,
    currentCoverUrl,
    onRemoveCurrentCover,
    isSubmittingEdit,
    handleCancelEdit,
}: IRecordEdit) => {
    const { t } = useTranslation();

    const formatOptions = RECORD_FORMATS.map((formatId) => ({
        label: t(`forms.formats.${formatId}` as const),
        value: formatId,
    }));

    const typeOptions = RECORD_TYPES.map((typeId) => ({
        label: t(`forms.types.${typeId}` as const),
        value: typeId,
    }));

    return (
        <li className="list-group-item bg-body-secondary">
            <form onSubmit={handleSaveEdit}>
                <FormInput
                    id={`name-${record.id}`}
                    label={t("forms.name")}
                    name="name"
                    onChange={setEditName}
                    required
                    type="text"
                    value={editName}
                />

                <div className="row">
                    <div className="col-12 col-md-4">
                        <FormNumberInput
                            id={`year-${record.id}`}
                            label={t("forms.year")}
                            name="year"
                            onChange={setEditYear}
                            placeholder={t("forms.yearPlaceholder")}
                            value={editYear}
                        />
                    </div>
                    <div className="col-12 col-md-4">
                        <FormSelect
                            id={`format-${record.id}`}
                            label={t("forms.format")}
                            name="format"
                            onChange={setEditFormat}
                            options={formatOptions}
                            placeholder={t("forms.selectFormatPlaceholder")}
                            value={editFormat}
                        />
                    </div>
                    <div className="col-12 col-md-4">
                        <FormSelect
                            id={`type-${record.id}`}
                            label={t("forms.type")}
                            name="type"
                            onChange={setEditType}
                            options={typeOptions}
                            placeholder={t("forms.selectTypePlaceholder")}
                            value={editType}
                        />
                    </div>
                </div>

                <ImageUploader
                    currentImageUrl={currentCoverUrl}
                    disabled={isSubmittingEdit}
                    id={`edit-cover-${record.id}`}
                    label={t("forms.coverImage")}
                    onFileSelect={onEditCoverFileSelect}
                    onRemoveCurrent={onRemoveCurrentCover}
                    selectedFile={editCoverFile}
                />

                <FormTextArea
                    id={`description-${record.id}`}
                    label={t("forms.description")}
                    name="description"
                    onChange={setEditDescription}
                    rows={3}
                    value={editDescription}
                />

                <ArtistSelectCheckboxes
                    artists={artists}
                    selectedArtistIds={editArtistIds}
                    onToggleArtist={handleEditArtistCheckboxChange}
                />

                <ToolButtonGroup className="pb-3">
                    <button className="btn btn-primary" disabled={isSubmittingEdit} type="submit">
                        {isSubmittingEdit
                            ? t("features.admin.record.edit.submitting")
                            : t("features.admin.record.edit.submit")}
                    </button>
                    <button
                        className="btn btn-secondary"
                        disabled={isSubmittingEdit}
                        onClick={handleCancelEdit}
                        type="button"
                    >
                        {t("common.cancel")}
                    </button>
                </ToolButtonGroup>
            </form>

            <RecordSongsManager
                availableArtists={artists}
                defaultArtistIds={record.record_artists.map((ra) => ra.artist_id)}
                recordId={record.id}
            />
        </li>
    );
};
