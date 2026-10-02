import { useTranslation } from "react-i18next";
import { faPenToSquare, faTrashCan } from "@fortawesome/pro-solid-svg-icons";
import { ToolButton } from "../../../components/buttons/ToolButton";
import { ListRowItem } from "../../../components/lists/ListRowItem";
import type { SongWithArtists } from "../../../types";
import { SongListItem } from "./SongListItem";

interface IRecordSongsToolRow {
    song: SongWithArtists;
    artistNames: string;
    handleStartEdit: (song: SongWithArtists) => void;
    handleDeleteSong: (song: SongWithArtists) => void;
}

export const RecordSongsToolRow = ({ song, artistNames, handleStartEdit, handleDeleteSong }: IRecordSongsToolRow) => {
    const { t } = useTranslation();

    return (
        <ListRowItem
            actions={
                <>
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
                </>
            }
        >
            <SongListItem artistNames={artistNames} song={song} />
        </ListRowItem>
    );
};
