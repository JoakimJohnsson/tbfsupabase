import { useTranslation } from "react-i18next";
import { faPenToSquare, faTrashCan, faXmark } from "@fortawesome/pro-solid-svg-icons";
import { ToolButton } from "../../../../components/buttons/ToolButton";
import { ListRowItem } from "../../../../components/lists/ListRowItem";
import type { SongWithArtists } from "../../../../types";
import { SongListItem } from "./SongListItem";

interface IRecordSongsToolRow {
    song: SongWithArtists;
    artistNames: string;
    isEditing: boolean;
    handleStartEdit: (song: SongWithArtists) => void;
    handleCancelEdit: () => void;
    handleDeleteSong: (song: SongWithArtists) => void;
}

export const RecordSongsToolRow = ({
    song,
    artistNames,
    isEditing,
    handleStartEdit,
    handleCancelEdit,
    handleDeleteSong,
}: IRecordSongsToolRow) => {
    const { t } = useTranslation();

    return (
        <ListRowItem
            actions={
                <>
                    <ToolButton
                        ariaLabel={isEditing ? t("common.cancel") : t("common.edit")}
                        icon={isEditing ? faXmark : faPenToSquare}
                        onClick={() => (isEditing ? handleCancelEdit() : handleStartEdit(song))}
                        size="sm"
                        text={isEditing ? t("common.cancel") : t("common.edit")}
                        variant={isEditing ? "secondary" : "outline-secondary"}
                    />
                    <ToolButton
                        ariaLabel={t("common.delete")}
                        disabled={isEditing}
                        icon={faTrashCan}
                        onClick={() => {
                            void handleDeleteSong(song);
                        }}
                        size="sm"
                        text={t("common.delete")}
                        variant="outline-danger"
                    />
                </>
            }
            className={`py-2${isEditing ? " bg-primary-subtle" : ""}`}
        >
            <SongListItem artistNames={artistNames} song={song} />
        </ListRowItem>
    );
};
