import { createContext } from "react";
import type { SongWithRecordAndArtists } from "../../types";

export type PlayerContextValue = {
    currentSong: SongWithRecordAndArtists | null;
    queue: SongWithRecordAndArtists[];
    isShuffling: boolean;
    toggleShuffle: () => void;
    isPlaying: boolean;
    currentTime: number;
    duration: number;
    volume: number;
    playbackError: boolean;
    seekTo: (time: number) => void;
    setVolume: (volume: number) => void;
    playSong: (song: SongWithRecordAndArtists, songs?: SongWithRecordAndArtists[]) => void;
    playNext: () => void;
    playPrevious: () => void;
    hasNext: boolean;
    hasPrevious: boolean;
    closePlayer: () => void;
    pauseSong: () => void;
    togglePlay: (song: SongWithRecordAndArtists, songs?: SongWithRecordAndArtists[]) => void;
};

export const PlayerContext = createContext<PlayerContextValue | null>(null);
