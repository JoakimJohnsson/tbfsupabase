import { useState, useRef, useEffect, useCallback, type ReactNode } from "react";
import { PlayerContext } from "./PlayerContext";
import type { SongWithRecordAndArtists } from "../../types";

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
    const [currentSong, setCurrentSong] = useState<SongWithRecordAndArtists | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [playbackError, setPlaybackError] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const playRequest = useRef(0);

    const startPlayback = useCallback(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const request = ++playRequest.current;
        setPlaybackError(false);
        void audio.play().catch((error: unknown) => {
            if (request !== playRequest.current) return;
            console.error("Could not play audio", error);
            setIsPlaying(false);
            setPlaybackError(true);
        });
    }, []);

    useEffect(() => {
        if (currentSong) startPlayback();
        return () => {
            playRequest.current++;
        };
    }, [currentSong, startPlayback]);

    useEffect(() => {
        if (audioRef.current) audioRef.current.volume = volume;
    }, [volume]);

    const playSong = (song: SongWithRecordAndArtists) => {
        if (!song.audio_path?.trim()) {
            console.error("Cannot play a song without an audio path", song.id);
            return;
        }

        if (currentSong?.id === song.id) {
            startPlayback();
            return;
        }

        playRequest.current++;
        setCurrentTime(0);
        setDuration(0);
        setIsPlaying(false);
        setPlaybackError(false);
        setCurrentSong(song);
    };

    const pauseSong = () => {
        playRequest.current++;
        audioRef.current?.pause();
        setIsPlaying(false);
    };

    const seekTo = (time: number) => {
        const audio = audioRef.current;
        if (!Number.isFinite(time)) {
            console.error("Invalid playback position", time);
            return;
        }
        if (!audio || !Number.isFinite(audio.duration) || audio.duration <= 0) return;
        const nextTime = Math.min(Math.max(time, 0), audio.duration);
        audio.currentTime = nextTime;
        setCurrentTime(nextTime);
    };

    const changeVolume = (value: number) => {
        if (!Number.isFinite(value)) {
            console.error("Invalid audio volume", value);
            return;
        }
        setVolume(Math.min(Math.max(value, 0), 1));
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
                currentTime,
                duration,
                volume,
                playbackError,
                seekTo,
                setVolume: changeVolume,
                playSong,
                pauseSong,
                togglePlay,
            }}
        >
            {children}
            <audio
                ref={audioRef}
                src={currentSong?.audio_path || undefined}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
                onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
                onSeeked={(event) => setCurrentTime(event.currentTarget.currentTime)}
                onVolumeChange={(event) => setVolume(event.currentTarget.volume)}
                onLoadedMetadata={(event) => {
                    const length = event.currentTarget.duration;
                    setDuration(Number.isFinite(length) ? length : 0);
                }}
                onDurationChange={(event) => {
                    const length = event.currentTarget.duration;
                    setDuration(Number.isFinite(length) ? length : 0);
                }}
                onError={(event) => {
                    playRequest.current++;
                    console.error("Could not load audio", event.currentTarget.error);
                    setIsPlaying(false);
                    setPlaybackError(true);
                }}
            />
        </PlayerContext>
    );
};
