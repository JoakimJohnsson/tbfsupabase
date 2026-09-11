import { useTranslation } from "react-i18next";
import type { Artist } from "../../../types";
import { Dispatch, SetStateAction, type SubmitEvent } from "react";
import { FormInput, FormTextArea } from "../../../components/form";

interface RecordCreateProps {
    handleCreateRecord: (event: SubmitEvent<HTMLFormElement>) => Promise<void>;
    setName: Dispatch<SetStateAction<string>>;
    name: string;
    setYear: Dispatch<SetStateAction<string>>;
    year: string;
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
    setDescription,
    description,
    artists,
    selectedArtistIds,
    handleArtistCheckboxChange,
    isSubmitting,
}: RecordCreateProps) => {
    const { t } = useTranslation();

    return (
        <>
            <h2>{t("features.admin.record.create.title")}</h2>

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

                <FormInput
                    id="year"
                    label={t("forms.year")}
                    name="year"
                    onChange={setYear}
                    placeholder="YYYY"
                    type="number"
                    value={year}
                />

                <FormTextArea
                    id="description"
                    label={t("forms.description")}
                    name="description"
                    onChange={setDescription}
                    rows={3}
                    value={description}
                />

                <fieldset
                    aria-describedby={
                        selectedArtistIds.length === 0
                            ? "artists-hint"
                            : undefined
                    }
                    className="mb-3"
                >
                    <legend className="form-label col-form-label pt-0">
                        {t("features.admin.record.create.artistsLabel")}
                    </legend>
                    <div className="border rounded p-2 form-scroll-box">
                        {artists.length === 0 ? (
                            <span className="text-muted small">
                                {t("features.artists.message.empty")}
                            </span>
                        ) : (
                            artists.map((artist) => (
                                <div className="form-check" key={artist.id}>
                                    <input
                                        checked={selectedArtistIds.includes(
                                            artist.id,
                                        )}
                                        className="form-check-input"
                                        id={`artist-${artist.id}`}
                                        name="artist-ids"
                                        onChange={() => {
                                            handleArtistCheckboxChange(
                                                artist.id,
                                            );
                                        }}
                                        type="checkbox"
                                    />
                                    <label
                                        className="form-check-label"
                                        htmlFor={`artist-${artist.id}`}
                                    >
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

                <button
                    className="btn btn-primary"
                    disabled={isSubmitting}
                    type="submit"
                >
                    {isSubmitting
                        ? t("features.admin.record.create.submitting")
                        : t("features.admin.record.create.submit")}
                </button>
            </form>
        </>
    );
};
