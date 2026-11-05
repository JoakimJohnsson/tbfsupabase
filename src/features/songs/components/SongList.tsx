import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMusic } from "@fortawesome/pro-solid-svg-icons";
import { EmptyStateCard } from "../../../components/cards/EmptyStateCard";
import { SongListItem } from "./SongListItem";
import type { SongWithRecordAndArtists } from "../../../types";

interface ISongList {
    songs: SongWithRecordAndArtists[];
    emptyMessage?: string;
    showCover?: boolean;
    showRecordInfo?: boolean;
}

export const SongList = ({ songs, emptyMessage, showCover = false, showRecordInfo = false }: ISongList) => {
    const [activeSongUrl, setActiveSongUrl] = useState<string | null>(null);

    if (songs.length === 0) {
        return emptyMessage ? <EmptyStateCard message={emptyMessage} /> : null;
    }

    return (
        <>
            {activeSongUrl && (
                <div className="card bg-body-secondary shadow-sm mb-4 border">
                    <div className="card-body p-3 d-flex align-items-center gap-3">
                        <FontAwesomeIcon className="text-primary fs-4 flex-shrink-0" icon={faMusic} />
                        <audio
                            autoPlay
                            className="w-100"
                            controls
                            key={activeSongUrl}
                            onEnded={() => setActiveSongUrl(null)}
                            src={activeSongUrl}
                        />
                    </div>
                </div>
            )}

            <ul className="list-group shadow-sm mb-4">
                {songs.map((song) => (
                    <SongListItem key={song.id} showCover={showCover} showRecordInfo={showRecordInfo} song={song} />
                ))}
            </ul>
        </>
    );
};
