import { faCompactDisc, faCheckCircle } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { RecordWithArtists } from "../../../types";
import { RecordBadges } from "./RecordBadges";

interface IRecordListItem {
    record: RecordWithArtists;
    artistNames: string;
}

export const RecordListItem = ({ record, artistNames }: IRecordListItem) => {
    const hasSongs = Boolean(record.songs && record.songs.length > 0);
    const hasAllAudio = hasSongs && record.songs?.every((song) => Boolean(song.audio_path?.trim()));
    const audioCount = record.songs?.filter((s) => Boolean(s.audio_path?.trim())).length ?? 0;
    const totalSongs = record.songs?.length ?? 0;

    return (
        <div className="tbf-record-list-item">
            <div className="tbf-record-list-item__media">
                {record.cover_path ? (
                    <img alt={record.name} className="tbf-record-list-item__image" src={record.cover_path} />
                ) : (
                    <FontAwesomeIcon icon={faCompactDisc} size="lg" />
                )}
            </div>

            <div className="tbf-record-list-item__body">
                <div className="tbf-record-list-item__heading">
                    <strong className={hasAllAudio ? "text-success" : ""}>{record.name}</strong>
                    {hasAllAudio && <FontAwesomeIcon className="text-success small ms-1" icon={faCheckCircle} />}
                    {record.year && <span className="tbf-record-list-item__year">({record.year})</span>}
                    <RecordBadges format={record.format} type={record.type} />
                </div>

                <div className="tbf-record-list-item__meta d-flex gap-2 align-items-center">
                    <span>{artistNames}</span>
                    {hasSongs && !hasAllAudio && (
                        <span className="badge text-bg-warning text-dark">
                            {audioCount}/{totalSongs}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};
