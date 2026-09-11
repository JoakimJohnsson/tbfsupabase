import {useTranslation} from "react-i18next";

import type {SongWithArtists} from "../../../types";

interface RecordSongsToolRowProps {
    song: SongWithArtists;
    artistNames: string;
    handleStartEdit: (song: SongWithArtists) => void;
    handleDeleteSong: (song: SongWithArtists) => void;
}

export const RecordSongsToolRow = ({
                                    song,
                                    artistNames,
                                    handleStartEdit,
                                    handleDeleteSong,
                                }: RecordSongsToolRowProps) => {
    const {t} = useTranslation();

    return (
        <li className="list-group-item d-flex justify-content-between align-items-center"
            key={song.id}>
            <div>
                <span className="fw-semibold">{song.name}</span>
                {artistNames && <span className="text-muted small ms-2">({artistNames})</span>}
            </div>
            <div className="d-flex gap-2">
                <button className="btn btn-outline-secondary" onClick={() => handleStartEdit(song)}
                        type="button">
                    {t("common.edit")}
                </button>
                <button className="btn btn-outline-danger"
                        onClick={() => void handleDeleteSong(song)} type="button">
                    {t("common.delete")}
                </button>
            </div>
        </li>
    );
};
