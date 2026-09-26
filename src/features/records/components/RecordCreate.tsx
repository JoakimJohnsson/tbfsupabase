import { type Dispatch, type SetStateAction, type SubmitEvent } from "react";
import { useTranslation } from "react-i18next";
import { faPlus } from "@fortawesome/pro-solid-svg-icons";
import { FormInput, FormSelect, FormTextArea } from "../../../components/form";
import { FormCard } from "../../../components/layout";
import { RECORD_FORMATS, RECORD_TYPES } from "../constants";
import type { Artist } from "../../../types";

interface RecordCreateProps {
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
    isSubmitting,
}: RecordCreateProps) => {
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
                        <FormInput
                            id="year"
                            label={t("forms.year")}
                            name="year"
                            onChange={setYear}
                            placeholder={t("forms.yearPlaceholder")}
                            type="number"
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

                <FormTextArea
                    id="description"
                    label={t("forms.description")}
                    name="description"
                    onChange={setDescription}
                    rows={3}
                    value={description}
                />

                <fieldset
                    aria-describedby={selectedArtistIds.length === 0 ? "artists-hint" : undefined}
                    className="mb-3"
                >
                    <legend className="form-label col-form-label pt-0">
                        {t("features.admin.record.create.artistsLabel")}
                    </legend>
                    <div className="border rounded p-2 form-scroll-box bg-body">
                        {artists.length === 0 ? (
                            <span className="text-muted small">{t("features.artists.message.empty")}</span>
                        ) : (
                            artists.map((artist) => (
                                <div className="form-check" key={artist.id}>
                                    <input
                                        checked={selectedArtistIds.includes(artist.id)}
                                        className="form-check-input"
                                        id={`artist-${artist.id}`}
                                        name="artist-ids"
                                        onChange={() => {
                                            handleArtistCheckboxChange(artist.id);
                                        }}
                                        type="checkbox"
                                    />
                                    <label className="form-check-label" htmlFor={`artist-${artist.id}`}>
                                        {artist.name}
                                    </label>
                                </div>
                            ))
                        )}
                    </div>
                    {selectedArtistIds.length === 0 && (
                        <div className="form-text" id="artists-hint">
                            {t("features.admin.record.create.noArtistsHint")}
                        </div>
                    )}
                </fieldset>

                <button className="btn btn-primary w-100" disabled={isSubmitting} type="submit">
                    {isSubmitting
                        ? t("features.admin.record.create.submitting")
                        : t("features.admin.record.create.submit")}
                </button>
            </form>
        </FormCard>
    );
};
