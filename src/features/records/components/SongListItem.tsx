import type { SongWithArtists } from "../../../types";

interface ISongListItem {
    song: SongWithArtists;
    artistNames?: string;
}

export const SongListItem = ({ song, artistNames }: ISongListItem) => {
    return (
        <div className="tbf-song-list-item">
            <span className="tbf-song-list-item__title">{song.name}</span>
            {artistNames && <span className="tbf-song-list-item__meta">({artistNames})</span>}
        </div>
    );
};
