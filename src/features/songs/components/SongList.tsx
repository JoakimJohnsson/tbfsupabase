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
    if (songs.length === 0) {
        return emptyMessage ? <EmptyStateCard message={emptyMessage} /> : null;
    }

    return (
        <ul className="list-group shadow-sm mb-4">
            {songs.map((song) => (
                <SongListItem
                    key={song.id}
                    showCover={showCover}
                    showRecordInfo={showRecordInfo}
                    song={song}
                    songs={songs}
                />
            ))}
        </ul>
    );
};
