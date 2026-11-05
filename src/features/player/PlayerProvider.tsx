import { useState, useRef, type ReactNode } from "react";
import { PlayerContext } from "./PlayerContext";
import type { SongWithRecordAndArtists } from "../../types";

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
    const [currentSong, setCurrentSong] = useState<SongWithRecordAndArtists | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const playSong = (song: SongWithRecordAndArtists) => {
        if (!song.audio_path) return;

        if (currentSong?.id === song.id) {
            audioRef.current?.play();
            setIsPlaying(true);
            return;
        }

        setCurrentSong(song);
        setIsPlaying(true);
    };

    const pauseSong = () => {
        audioRef.current?.pause();
        setIsPlaying(false);
    };

    const togglePlay = (song: SongWithRecordAndArtists) => {
        if (currentSong?.id === song.id && isPlaying) {
            pauseSong();
        } else {
            playSong(song);
        }
    };

    return (
        <PlayerContext
            value={{
                currentSong,
                isPlaying,
                playSong,
                pauseSong,
                togglePlay,
            }}
        >
            {children}
            {/* Hidden global audio element that handles playback */}
            {currentSong?.audio_path && (
                <audio
                    ref={audioRef}
                    src={currentSong.audio_path}
                    autoPlay
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onEnded={() => setIsPlaying(false)}
                />
            )}
        </PlayerContext>
    );
};
