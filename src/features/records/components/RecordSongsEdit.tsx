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
        <li className="list-group-item">
            <form onSubmit={handleSaveEdit}>
                <div className="row g-2 mb-2">
                    <div className="col-2">
                        <label className="visually-hidden" htmlFor={`track-number-${song.id}`}>
                            {t("forms.trackNumber")}
                        </label>
                        <input className="form-control"
                               id={`track-number-${song.id}`}
                               name="track-number"
                               onChange={(e) => setEditTrackNumber(e.target.value)}
                               placeholder="#"
                               type="number"
                               value={editTrackNumber}
                        />
                    </div>
                    <div className="col">
                        <label className="visually-hidden"
                               htmlFor={`name-${song.id}`}>
                            {t("forms.name")}
                        </label>
                        <input className="form-control"
                               id={`name-${song.id}`}
                               name="name"
                               onChange={(e) => setEditSongName(e.target.value)}
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
