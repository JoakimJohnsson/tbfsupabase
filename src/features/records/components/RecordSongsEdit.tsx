import {type SubmitEvent} from "react";
import {useTranslation} from "react-i18next";

import type {SongWithArtists} from "../../../types";

interface RecordSongsEditProps {
    song: SongWithArtists;
    handleSaveEdit: (event: SubmitEvent<HTMLFormElement>) => Promise<void>;
    setEditTrackNumber: (value: string) => void;
    editTrackNumber: string;
    setEditSongName: (value: string) => void;
    editSongName: string;
    isSavingEdit: boolean;
    setEditingSongId: (value: string | null) => void;
}

export const RecordSongsEdit = ({
                                    song,
                                    handleSaveEdit,
                                    setEditTrackNumber,
                                    editTrackNumber,
                                    setEditSongName,
                                    editSongName,
                                    isSavingEdit,
                                    setEditingSongId,
                                }: RecordSongsEditProps) => {
    const {t} = useTranslation();

    return (
        <li className="list-group-item" key={song.id}>
            <form onSubmit={handleSaveEdit}>
                <div className="row g-2 mb-2">
                    <div className="col-2">
                        <label className="visually-hidden" htmlFor={`edit-track-${song.id}`}>
                            {t("forms.trackNumber")}
                        </label>
                        <input className="form-control"
                               id={`edit-track-${song.id}`}
                               name="edit-track-number"
                               onChange={(e) => setEditTrackNumber(e.target.value)}
                               placeholder="#"
                               type="number"
                               value={editTrackNumber}
                        />
                    </div>
                    <div className="col">
                        <label className="visually-hidden"
                               htmlFor={`edit-song-name-${song.id}`}>
                            {t("forms.name")}
                        </label>
                        <input className="form-control"
                               id={`edit-song-name-${song.id}`}
                               name="edit-song-name"
                               onChange={(e) => setEditSongName(e.target.value)}
                               placeholder={t("forms.name")}
                               required
                               type="text"
                               value={editSongName}
                        />
                    </div>
                </div>
                <div className="d-flex gap-2">
                    <button className="btn btn-primary" disabled={isSavingEdit} type="submit">
                        {t("common.save")}
                    </button>
                    <button className="btn btn-secondary" onClick={() => setEditingSongId(null)}
                            type="button">
                        {t("common.cancel")}
                    </button>
                </div>
            </form>
        </li>
    );
};
