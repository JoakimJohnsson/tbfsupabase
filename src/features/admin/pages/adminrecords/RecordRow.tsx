import {useTranslation} from "react-i18next";
import type {Artist, RecordWithArtists} from "../../../../types.ts";
import {Dispatch, SetStateAction} from "react";
import {RecordSongsManager} from "../../../records/components/RecordSongsManager.tsx";

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


export const RecordRow = ({
                              record,
                              artistNames,
                              handleStartEdit,
                              deletingRecordId,
                              handleDeleteRecord,
                              setOpenTracklistRecordId,
                              openTracklistRecordId,
                              artists,
                          }: RecordRowProps) => {

    const {t} = useTranslation();

    return (
        <>
            <li className="list-group-item d-flex justify-content-between align-items-center"
                key={record.id}
            >
                <div>
                    <strong>{record.name}</strong>
                    {record.year && ` (${record.year})`}
                    <div className="text-muted small">
                        {artistNames || t("features.admin.records.message.noArtists")}
                    </div>
                </div>

                <div className="d-flex gap-2">
                    <button className="btn btn-sm btn-outline-secondary"
                            onClick={() => {
                                handleStartEdit(record);
                            }}
                            type="button"
                    >
                        {t("common.edit")}
                    </button>
                    <button className="btn btn-sm btn-outline-danger"
                            disabled={deletingRecordId === record.id}
                            onClick={() => {
                                void handleDeleteRecord(record);
                            }}
                            type="button"
                    >
                        {deletingRecordId === record.id
                            ? t("features.admin.artist.deleteRecord.deleting")
                            : t("common.delete")}
                    </button>
                    <button className="btn btn-sm btn-outline-info"
                            onClick={() => setOpenTracklistRecordId(cur => cur === record.id ? null : record.id)}
                            type="button"
                    >
                        {t("features.admin.songs.tracks")}
                    </button>
                </div>
            </li>
            {openTracklistRecordId === record.id && (
                <RecordSongsManager
                    availableArtists={artists}
                    defaultArtistIds={record.record_artists.map(ra => ra.artist_id)}
                    recordId={record.id}
                />
            )}
        </>
    );
};
