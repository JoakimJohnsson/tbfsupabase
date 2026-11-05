import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCompactDisc } from "@fortawesome/pro-solid-svg-icons";
import type { SongWithArtists, SongWithRecordAndArtists } from "../../../types";

interface ISongListItemContent {
    song: SongWithArtists & { records?: SongWithRecordAndArtists["records"] };
    showCover?: boolean;
    showRecordInfo?: boolean;
}

export const SongListItemContent = ({ song, showCover = false, showRecordInfo = false }: ISongListItemContent) => {
    const hasAudio = Boolean(song.audio_path?.trim());
    const artistNames = song.song_artists
        ?.map((sa) => sa.artists?.name)
        .filter(Boolean)
        .join(", ");

    return (
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
    );
};
