import { createContext } from "react";
import type { SongWithRecordAndArtists } from "../../types";

export type PlayerContextValue = {
    currentSong: SongWithRecordAndArtists | null;
    isPlaying: boolean;
    currentTime: number;
    duration: number;
    volume: number;
    playbackError: boolean;
    seekTo: (time: number) => void;
    setVolume: (volume: number) => void;
    playSong: (song: SongWithRecordAndArtists) => void;
    pauseSong: () => void;
    togglePlay: (song: SongWithRecordAndArtists) => void;
};

export const PlayerContext = createContext<PlayerContextValue | null>(null);
