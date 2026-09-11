import { useTranslation } from "react-i18next";
import type { Artist, RecordWithArtists } from "../../../types";
import { Dispatch, SetStateAction, type SubmitEvent } from "react";
import { FormInput, FormTextArea } from "../../../components/form";

interface RecordEditProps {
    record: RecordWithArtists;
    handleSaveEdit: (event: SubmitEvent<HTMLFormElement>) => Promise<void>;
    setEditName: Dispatch<SetStateAction<string>>;
    editName: string;
    setEditYear: Dispatch<SetStateAction<string>>;
    editYear: string;
    setEditDescription: Dispatch<SetStateAction<string>>;
    editDescription: string;
    artists: Artist[];
    editArtistIds: string[];
    handleEditArtistCheckboxChange: (artistId: string) => void;
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
    setEditDescription,
    editDescription,
    artists,
    editArtistIds,
    handleEditArtistCheckboxChange,
    isSubmittingEdit,
    handleCancelEdit,
}: RecordEditProps) => {
    const { t } = useTranslation();

    return (
        <li className="list-group-item">
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

                <FormInput
                    id={`year-${record.id}`}
                    label={t("forms.year")}
                    name="year"
                    onChange={setEditYear}
                    placeholder="YYYY"
                    type="number"
                    value={editYear}
                />

                <FormTextArea
                    id={`description-${record.id}`}
                    label={t("forms.description")}
                    name="description"
                    onChange={setEditDescription}
                    rows={3}
                    value={editDescription}
                />

                <fieldset className="mb-3">
                    <legend className="form-label col-form-label pt-0">
                        {t("features.admin.record.create.artistsLabel")}
                    </legend>
                    <div className="border rounded p-2 form-scroll-box">
                        {artists.map((artist) => (
                            <div className="form-check" key={artist.id}>
                                <input
                                    checked={editArtistIds.includes(artist.id)}
                                    className="form-check-input"
                                    id={`artist-${record.id}-${artist.id}`}
                                    name="artist-ids"
                                    onChange={() => {
                                        handleEditArtistCheckboxChange(
                                            artist.id,
                                        );
                                    }}
                                    type="checkbox"
                                />
                                <label
                                    className="form-check-label"
                                    htmlFor={`artist-${record.id}-${artist.id}`}
                                >
                                    {artist.name}
                                </label>
                            </div>
                        ))}
                    </div>
                </fieldset>

                <div className="d-flex gap-2">
                    <button
                        className="btn btn-primary"
                        disabled={isSubmittingEdit}
                        type="submit"
                    >
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
                </div>
            </form>
        </li>
    );
};
