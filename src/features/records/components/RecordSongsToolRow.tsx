import { useTranslation } from "react-i18next";
import { faPenToSquare, faTrashCan } from "@fortawesome/pro-solid-svg-icons";
import { ToolButton } from "../../../components/buttons";
import { ListRowItem } from "../../../components/layout";
import type { SongWithArtists } from "../../../types";
import { SongListItem } from "./SongListItem";

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
