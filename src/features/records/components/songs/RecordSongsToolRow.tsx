import { useTranslation } from "react-i18next";
import { faPenToSquare, faTrashCan, faXmark } from "@fortawesome/pro-solid-svg-icons";
import { ToolButton } from "../../../../components/buttons/ToolButton";
import { ListRowItem } from "../../../../components/lists/ListRowItem";
import type { SongWithArtists } from "../../../../types";
import { SongListItemContent } from "../../../songs/components/SongListItemContent";

interface IRecordSongsToolRow {
    song: SongWithArtists;
    isEditing: boolean;
    handleStartEdit: (song: SongWithArtists) => void;
    handleCancelEdit: () => void;
    handleDeleteSong: (song: SongWithArtists) => void;
}

export const RecordSongsToolRow = ({
    song,
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
                        ariaLabel={isEditing ? t("common.cancel") : `${t("common.edit")} ${song.name.toLowerCase()}`}
                        icon={isEditing ? faXmark : faPenToSquare}
                        onClick={() => (isEditing ? handleCancelEdit() : handleStartEdit(song))}
                        size="sm"
                        text={isEditing ? t("common.cancel") : t("common.edit")}
                        variant={isEditing ? "secondary" : "outline-secondary"}
                    />
                    <ToolButton
                        ariaLabel={`${t("common.delete")} ${song.name.toLowerCase()}`}
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
            <SongListItemContent song={song} />
        </ListRowItem>
    );
};
