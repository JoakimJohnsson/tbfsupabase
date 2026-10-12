import { type Dispatch, type SetStateAction, type SubmitEvent } from "react";
import { useTranslation } from "react-i18next";
import { faPlus } from "@fortawesome/pro-solid-svg-icons";
import { FormInput } from "../../../components/form/FormInput";
import { FormNumberInput } from "../../../components/form/FormNumberInput";
import { FormSelect } from "../../../components/form/FormSelect";
import { FormTextArea } from "../../../components/form/FormTextArea";
import { ImageUploader } from "../../../components/form/ImageUploader";
import { FormCard } from "../../../components/cards/FormCard";
import { RECORD_FORMATS, RECORD_TYPES } from "../constants";
import type { Artist } from "../../../types";
import { ArtistSelectCheckboxes } from "../../artists/components/ArtistSelectCheckboxes";

interface IRecordCreate {
    handleCreateRecord: (event: SubmitEvent<HTMLFormElement>) => Promise<void>;
    setName: Dispatch<SetStateAction<string>>;
    name: string;
    setYear: Dispatch<SetStateAction<string>>;
    year: string;
    setFormat: Dispatch<SetStateAction<string>>;
    format: string;
    setType: Dispatch<SetStateAction<string>>;
    type: string;
    setDescription: Dispatch<SetStateAction<string>>;
    description: string;
    artists: Artist[];
    selectedArtistIds: string[];
    handleArtistCheckboxChange: (artistId: string) => void;
    coverFile: File | null;
    onCoverFileSelect: (file: File | null) => void;
    isSubmitting: boolean;
}

export const RecordCreate = ({
    handleCreateRecord,
    setName,
    name,
    setYear,
    year,
    setFormat,
    format,
    setType,
    type,
    setDescription,
    description,
    artists,
    selectedArtistIds,
    handleArtistCheckboxChange,
    coverFile,
    onCoverFileSelect,
    isSubmitting,
}: IRecordCreate) => {
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
        <FormCard icon={faPlus} title={t("features.admin.record.create.title")}>
            <form onSubmit={handleCreateRecord}>
                <FormInput
                    id="name"
                    label={t("forms.name")}
                    name="name"
                    onChange={setName}
                    required
                    type="text"
                    value={name}
                />

                <div className="row g-2">
                    <div className="col-12 col-sm-6">
                        <FormNumberInput
                            id="year"
                            label={t("forms.year")}
                            name="year"
                            onChange={setYear}
                            placeholder={t("forms.yearPlaceholder")}
                            value={year}
                        />
                    </div>
                    <div className="col-12 col-sm-6">
                        <FormSelect
                            id="format"
                            label={t("forms.format")}
                            name="format"
                            onChange={setFormat}
                            options={formatOptions}
                            placeholder={t("forms.selectFormatPlaceholder")}
                            value={format}
                        />
                    </div>
                    <div className="col-12 col-sm-6">
                        <FormSelect
                            id="type"
                            label={t("forms.type")}
                            name="type"
                            onChange={setType}
                            options={typeOptions}
                            placeholder={t("forms.selectTypePlaceholder")}
                            value={type}
                        />
                    </div>
                </div>

                <ImageUploader
                    disabled={isSubmitting}
                    id="record-cover-upload"
                    label={t("forms.coverImage")}
                    onFileSelect={onCoverFileSelect}
                    selectedFile={coverFile}
                />

                <FormTextArea
                    id="description"
                    label={t("forms.description")}
                    name="description"
                    onChange={setDescription}
                    rows={3}
                    value={description}
                />

                <ArtistSelectCheckboxes
                    artists={artists}
                    selectedArtistIds={selectedArtistIds}
                    onToggleArtist={handleArtistCheckboxChange}
                />

                <button className="btn btn-primary w-100" disabled={isSubmitting} type="submit">
                    {isSubmitting
                        ? t("features.admin.record.create.submitting")
                        : t("features.admin.record.create.submit")}
                </button>
            </form>
        </FormCard>
    );
};
