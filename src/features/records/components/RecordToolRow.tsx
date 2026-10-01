import { type Dispatch, type SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { faMusic, faPenToSquare, faTrashCan } from "@fortawesome/pro-solid-svg-icons";
import { ToolButton } from "../../../components/buttons/ToolButton";
import { ListRowItem } from "../../../components/layout/ListRowItem";
import type { Artist, RecordWithArtists } from "../../../types";
import { RecordSongsManager } from "./RecordSongsManager";
import { RecordListItem } from "./RecordListItem";

interface RecordRowProps {
    record: RecordWithArtists;
    artistNames: string;
    handleStartEdit: (record: RecordWithArtists) => void;
    deletingRecordId: string | null;
    handleDeleteRecord: (record: RecordWithArtists) => void;
    setOpenSongListRecordId: Dispatch<SetStateAction<string | null>>;
    openSongListRecordId: string | null;
    artists: Artist[];
}

export const RecordToolRow = ({
    record,
    artistNames,
    handleStartEdit,
    deletingRecordId,
    handleDeleteRecord,
    setOpenSongListRecordId,
    openSongListRecordId,
    artists,
}: RecordRowProps) => {
    const { t } = useTranslation();
    const deleteRecordText =
        deletingRecordId === record.id ? t("features.admin.records.deleteRecord.deleting") : t("common.delete");

    return (
        <>
            <ListRowItem
                actions={
                    <>
                        <ToolButton
                            icon={faPenToSquare}
                            onClick={() => {
                                handleStartEdit(record);
                            }}
                            text={t("common.edit")}
                            variant="outline-secondary"
                        />
                        <ToolButton
                            icon={faTrashCan}
                            onClick={() => {
                                void handleDeleteRecord(record);
                            }}
                            text={deleteRecordText}
                            variant="outline-danger"
                        />
                        <ToolButton
                            icon={faMusic}
                            onClick={() => {
                                setOpenSongListRecordId((cur) => (cur === record.id ? null : record.id));
                            }}
                            text={t("features.admin.songs.songList")}
                            variant="outline-info"
                        />
                    </>
                }
            >
                <RecordListItem
                    artistNames={artistNames || t("features.admin.records.message.noArtists")}
                    record={record}
                />
            </ListRowItem>
            {openSongListRecordId === record.id && (
                <RecordSongsManager
                    availableArtists={artists}
                    defaultArtistIds={record.record_artists.map((ra) => ra.artist_id)}
                    recordId={record.id}
                />
            )}
        </>
    );
};
