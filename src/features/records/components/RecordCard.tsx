import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCompactDisc, faFileAudio } from "@fortawesome/pro-solid-svg-icons";
import { Card } from "../../../components/cards/Card";
import { CardBody } from "../../../components/cards/CardBody";
import { CardMedia } from "../../../components/cards/CardMedia";
import { RecordBadges } from "./RecordBadges";
import type { RecordWithArtists } from "../../../types";

interface IRecordCard {
    record: RecordWithArtists;
    showTrackCount?: boolean;
}

export const RecordCard = ({ record, showTrackCount = false }: IRecordCard) => {
    const { t } = useTranslation();

    const artistNames = record.record_artists
        .map((ra) => ra.artists?.name)
        .filter(Boolean)
        .join(", ");

    const totalSongs = record.songs?.length ?? 0;
    const songsWithAudio = record.songs?.filter((s) => Boolean(s.audio_path?.trim())).length ?? 0;

    return (
        <Card className="h-100 d-flex flex-column">
            <CardMedia ratio="1x1">
                {record.cover_path ? (
                    <img alt={record.name} src={record.cover_path} />
                ) : (
                    <div className="tbf-card-media__placeholder">
                        <FontAwesomeIcon icon={faCompactDisc} size="3x" />
                    </div>
                )}
            </CardMedia>

            <CardBody className="d-flex flex-column flex-grow-1">
                <h3 className="h6 fw-bold mb-1 text-truncate" title={record.name}>
                    {record.name}
                </h3>

                <p className="small text-secondary mb-2 text-truncate" title={artistNames}>
                    {artistNames || t("features.admin.records.message.noArtists")}
                    {record.year && <span> ({record.year})</span>}
                </p>

                <div className="mt-auto pt-2 d-flex justify-content-between align-items-center flex-wrap gap-1">
                    <RecordBadges format={record.format} type={record.type} />
                    {showTrackCount && totalSongs > 0 && (
                        <span
                            className="badge text-bg-light border small d-inline-flex align-items-center gap-1"
                            title={t("features.records.audioProgressTooltip", {
                                count: songsWithAudio,
                                total: totalSongs,
                            })}
                        >
                            <FontAwesomeIcon
                                className={songsWithAudio > 0 ? "text-success" : "text-muted"}
                                icon={faFileAudio}
                            />
                            {totalSongs}
                        </span>
                    )}
                </div>
            </CardBody>
        </Card>
    );
};
