import { type Dispatch, type SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import {
    faMusic,
    faPenToSquare,
    faTrashCan,
} from "@fortawesome/pro-solid-svg-icons";
import { ToolButton } from "../../../components/buttons/ToolButton";
import type { Artist, RecordWithArtists } from "../../../types";
import { RecordSongsManager } from "./RecordSongsManager";

interface RecordRowProps {
    record: RecordWithArtists;
    artistNames: string;
    handleStartEdit: (record: RecordWithArtists) => void;
    deletingRecordId: string | null;
    handleDeleteRecord: (record: RecordWithArtists) => void;
    setOpenTracklistRecordId: Dispatch<SetStateAction<string | null>>;
    openTracklistRecordId: string | null;
    artists: Artist[];
}

export const RecordToolRow = ({
    record,
    artistNames,
    handleStartEdit,
    deletingRecordId,
    handleDeleteRecord,
    setOpenTracklistRecordId,
    openTracklistRecordId,
    artists,
}: RecordRowProps) => {
    const { t } = useTranslation();
    const deleteRecordText =
        deletingRecordId === record.id
            ? t("features.admin.artist.deleteRecord.deleting")
            : t("common.delete");

    return (
        <>
            <li className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                    <strong>{record.name}</strong>
                    {record.year && ` (${record.year})`}
                    <div className="text-muted small">
                        {artistNames ||
                            t("features.admin.records.message.noArtists")}
                    </div>
                </div>

                <div className="d-flex gap-2">
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
                            setOpenTracklistRecordId((cur) =>
                                cur === record.id ? null : record.id,
                            );
                        }}
                        text={t("features.admin.songs.tracks")}
                        variant="outline-info"
                    />
                </div>
            </li>
            {openTracklistRecordId === record.id && (
                <RecordSongsManager
                    availableArtists={artists}
                    defaultArtistIds={record.record_artists.map(
                        (ra) => ra.artist_id,
                    )}
                    recordId={record.id}
                />
            )}
        </>
    );
};
