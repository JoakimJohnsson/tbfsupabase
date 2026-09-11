import { useTranslation } from "react-i18next";
import type { Artist, RecordWithArtists } from "../../../types";
import { Dispatch, SetStateAction, type SubmitEvent } from "react";

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
                <div className="mb-3">
                    <label className="form-label" htmlFor={`name-${record.id}`}>
                        {t("forms.name")}
                    </label>
                    <input
                        className="form-control"
                        id={`name-${record.id}`}
                        name="name"
                        onChange={(e) => {
                            setEditName(e.target.value);
                        }}
                        required
                        type="text"
                        value={editName}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label" htmlFor={`year-${record.id}`}>
                        {t("forms.year")}
                    </label>
                    <input
                        className="form-control"
                        id={`year-${record.id}`}
                        name="year"
                        onChange={(e) => {
                            setEditYear(e.target.value);
                        }}
                        placeholder="YYYY"
                        type="number"
                        value={editYear}
                    />
                </div>

                <div className="mb-3">
                    <label
                        className="form-label"
                        htmlFor={`description-${record.id}`}
                    >
                        {t("forms.description")}
                    </label>
                    <textarea
                        className="form-control"
                        id={`description-${record.id}`}
                        name="description"
                        onChange={(e) => {
                            setEditDescription(e.target.value);
                        }}
                        rows={3}
                        value={editDescription}
                    />
                </div>

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
                                    name={"artist-ids"}
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
