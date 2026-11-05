import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCompactDisc, faPlay, faStop } from "@fortawesome/pro-solid-svg-icons";
import { ListRowItem } from "../../../components/lists/ListRowItem";
import { ToolButton } from "../../../components/buttons/ToolButton";
import type { SongWithRecordAndArtists } from "../../../types";
import { usePlayer } from "../../player/hooks/usePlayer";

interface ISongListItem {
    song: SongWithRecordAndArtists;
    showCover?: boolean;
    showRecordInfo?: boolean;
}

export const SongListItem = ({ song, showCover = false, showRecordInfo = false }: ISongListItem) => {
    const { t } = useTranslation();
    const { currentSong, isPlaying, togglePlay } = usePlayer();
    const isCurrent = currentSong?.id === song.id && isPlaying;
    const hasAudio = Boolean(song.audio_path?.trim());

    const artistNames = song.song_artists
        ?.map((sa) => sa.artists?.name)
        .filter(Boolean)
        .join(", ");

    return (
        <ListRowItem
            actions={
                hasAudio ? (
                    <ToolButton
                        icon={isCurrent ? faStop : faPlay}
                        onClick={() => togglePlay(song)}
                        variant={isCurrent ? "primary" : "outline-primary"}
                        text={isCurrent ? t("common.stop") : t("common.play")}
                    />
                ) : undefined
            }
            className={`py-2${isCurrent ? " bg-primary-subtle" : ""}`}
        >
            <div className="d-flex align-items-center gap-3 min-w-0">
                {showCover && (
                    <div className="tbf-song-record-thumb">
                        {song.records?.cover_path ? (
                            <img
                                alt={song.records.name}
                                className="w-100 h-100 object-fit-cover"
                                src={song.records.cover_path}
                            />
                        ) : (
                            <FontAwesomeIcon className="text-secondary" icon={faCompactDisc} />
                        )}
                    </div>
                )}

                {song.track_number && !showCover && (
                    <span className="text-secondary small fw-semibold">{song.track_number}.</span>
                )}

                <div className="min-w-0">
                    <div className={`fw-semibold text-truncate ${hasAudio ? "text-success" : ""}`}>{song.name}</div>

                    {(showRecordInfo || artistNames) && (
                        <div className="small text-secondary text-truncate">
                            {artistNames || "—"}
                            {showRecordInfo && song.records && (
                                <>
                                    <span className="mx-1">•</span>
                                    <span>{song.records.name}</span>
                                    {song.records.year && <span> ({song.records.year})</span>}
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </ListRowItem>
    );
};
