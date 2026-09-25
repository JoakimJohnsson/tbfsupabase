import { type Dispatch, type SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { faMusic, faPenToSquare, faTrashCan } from "@fortawesome/pro-solid-svg-icons";
import { ToolButton } from "../../../components/buttons/ToolButton";
import type { Artist, RecordWithArtists } from "../../../types";
import { RecordSongsManager } from "./RecordSongsManager";
import { RecordBadges } from "./RecordBadges";

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
        deletingRecordId === record.id ? t("features.admin.artist.deleteRecord.deleting") : t("common.delete");

    return (
        <>
            <li className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                    <div className="d-flex align-items-center flex-wrap gap-2">
                        <strong>{record.name}</strong>
                        {record.year && <span className="text-muted">({record.year})</span>}
                        <RecordBadges format={record.format} type={record.type} />
                    </div>

                    <div className="text-muted small mt-1">
                        {artistNames || t("features.admin.records.message.noArtists")}
                    </div>
                </div>

                <div className="d-flex gap-2 ms-3">
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
                </div>
            </li>
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
