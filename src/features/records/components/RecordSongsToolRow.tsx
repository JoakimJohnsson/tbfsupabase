import { useTranslation } from "react-i18next";
import { faPenToSquare, faTrashCan } from "@fortawesome/pro-solid-svg-icons";
import { ToolButton } from "../../../components/buttons/ToolButton";
import type { SongWithArtists } from "../../../types";

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
    const { t } = useTranslation();

    return (
        <li className="list-group-item d-flex justify-content-between align-items-center">
            <div className="ps-2 flex-grow-1">
                <span className="fw-semibold">{song.name}</span>
                {artistNames && <span className="text-muted small ms-2">({artistNames})</span>}
            </div>
            <div className="d-flex gap-2 ms-3">
                <ToolButton
                    icon={faPenToSquare}
                    onClick={() => {
                        handleStartEdit(song);
                    }}
                    text={t("common.edit")}
                    variant="outline-secondary"
                />
                <ToolButton
                    icon={faTrashCan}
                    onClick={() => {
                        void handleDeleteSong(song);
                    }}
                    text={t("common.delete")}
                    variant="outline-danger"
                />
            </div>
        </li>
    );
};
