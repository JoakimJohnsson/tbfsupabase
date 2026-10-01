import { faCompactDisc } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { RecordWithArtists } from "../../../types";
import { RecordBadges } from "./RecordBadges";

interface RecordListItemProps {
    record: RecordWithArtists;
    artistNames: string;
}

export const RecordListItem = ({ record, artistNames }: RecordListItemProps) => {
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
                    <strong>{record.name}</strong>
                    {record.year && <span className="tbf-record-list-item__year">({record.year})</span>}
                    <RecordBadges format={record.format} type={record.type} />
                </div>

                <div className="tbf-record-list-item__meta">{artistNames}</div>
            </div>
        </div>
    );
};
