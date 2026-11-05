import { createContext } from "react";
import type { SongWithRecordAndArtists } from "../../types";

export type PlayerContextValue = {
    currentSong: SongWithRecordAndArtists | null;
    isPlaying: boolean;
    playSong: (song: SongWithRecordAndArtists) => void;
    pauseSong: () => void;
    togglePlay: (song: SongWithRecordAndArtists) => void;
};

export const PlayerContext = createContext<PlayerContextValue | null>(null);
