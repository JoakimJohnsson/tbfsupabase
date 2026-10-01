import type { SongWithArtists } from "../../../types";

interface SongListItemProps {
    song: SongWithArtists;
    artistNames?: string;
}

export const SongListItem = ({ song, artistNames }: SongListItemProps) => {
    return (
        <div className="tbf-song-list-item">
            <span className="tbf-song-list-item__title">{song.name}</span>
            {artistNames && <span className="tbf-song-list-item__meta">({artistNames})</span>}
        </div>
    );
};
