import {useTranslation} from "react-i18next";
import type {Artist, RecordWithArtists} from "../../../../types.ts";
import {Dispatch, SetStateAction, type SubmitEvent} from "react";

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

    const {t} = useTranslation();

    return (
        <li className="list-group-item" key={record.id}>
            <form onSubmit={handleSaveEdit}>
                <div className="mb-2">
                    <label className="form-label" htmlFor={`edit-name-${record.id}`}>
                        {t("forms.name")}
                    </label>
                    <input className="form-control"
                           id={`edit-name-${record.id}`}
                           onChange={(e) => {
                               setEditName(e.target.value);
                           }}
                           required
                           type="text"
                           value={editName}
                    />
                </div>

                <div className="mb-2">
                    <label className="form-label" htmlFor={`edit-year-${record.id}`}>
                        {t("forms.year")}
                    </label>
                    <input className="form-control"
                           id={`edit-year-${record.id}`}
                           onChange={(e) => {
                               setEditYear(e.target.value);
                           }}
                           placeholder="YYYY"
                           type="number"
                           value={editYear}
                    />
                </div>

                <div className="mb-2">
                    <label className="form-label" htmlFor={`edit-desc-${record.id}`}>
                        {t("forms.description")}
                    </label>
                    <textarea className="form-control"
                              id={`edit-desc-${record.id}`}
                              onChange={(e) => {
                                  setEditDescription(e.target.value);
                              }}
                              rows={2}
                              value={editDescription}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label d-block">
                        {t("features.admin.record.create.artistsLabel")}
                    </label>
                    <div className="border rounded p-2"
                         style={{maxHeight: "140px", overflowY: "auto"}}
                    >
                        {artists.map((artist) => (
                            <div className="form-check" key={artist.id}>
                                <input checked={editArtistIds.includes(artist.id)}
                                       className="form-check-input"
                                       id={`edit-artist-${record.id}-${artist.id}`}
                                       onChange={() => {
                                           handleEditArtistCheckboxChange(artist.id);
                                       }}
                                       type="checkbox"
                                />
                                <label className="form-check-label"
                                       htmlFor={`edit-artist-${record.id}-${artist.id}`}
                                >
                                    {artist.name}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="d-flex gap-2">
                    <button className="btn btn-sm btn-primary"
                            disabled={isSubmittingEdit}
                            type="submit"
                    >
                        {isSubmittingEdit
                            ? t("features.admin.record.edit.submitting")
                            : t("features.admin.record.edit.submit")}
                    </button>
                    <button className="btn btn-sm btn-secondary"
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
