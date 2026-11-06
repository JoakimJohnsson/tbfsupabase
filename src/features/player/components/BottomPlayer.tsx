import { faBackwardStep, faForwardStep, faPause, faPlay, faXmark } from "@fortawesome/pro-solid-svg-icons";
import { useTranslation } from "react-i18next";
import { ToolButton } from "../../../components/buttons/ToolButton";
import { SongListItemContent } from "../../songs/components/SongListItemContent";
import { usePlayer } from "../hooks/usePlayer";

const formatTime = (seconds: number) => {
    const totalSeconds = Math.floor(Math.max(0, seconds));
    return `${Math.floor(totalSeconds / 60)}:${String(totalSeconds % 60).padStart(2, "0")}`;
};

export const BottomPlayer = () => {
    const { t } = useTranslation();
    const {
        currentSong,
        isPlaying,
        currentTime,
        duration,
        volume,
        playbackError,
        togglePlay,
        seekTo,
        setVolume,
        playNext,
        playPrevious,
        hasNext,
        hasPrevious,
        closePlayer,
    } = usePlayer();

    if (!currentSong) return null;

    return (
        <section
            aria-label={t("features.player.title")}
            className="tbf-bottom-player sticky-bottom border-top bg-body-tertiary px-3 px-md-5 py-3"
        >
            <div className="tbf-bottom-player__controls">
                <div className="tbf-bottom-player__song min-w-0">
                    <SongListItemContent showCover song={currentSong} />
                </div>
                <div className="tbf-bottom-player__play d-flex align-items-center gap-2">
                    <ToolButton
                        ariaLabel={t("features.player.previous")}
                        disabled={!hasPrevious}
                        icon={faBackwardStep}
                        onClick={playPrevious}
                    />
                    <ToolButton
                        ariaLabel={isPlaying ? t("common.pause") : t("common.play")}
                        icon={isPlaying ? faPause : faPlay}
                        onClick={() => togglePlay(currentSong)}
                        variant="primary"
                    />
                    <ToolButton
                        ariaLabel={t("features.player.next")}
                        disabled={!hasNext}
                        icon={faForwardStep}
                        onClick={playNext}
                    />
                </div>
                <div className="tbf-bottom-player__timeline d-flex align-items-center gap-2">
                    <span className="small text-secondary">{formatTime(currentTime)}</span>
                    <input
                        aria-label={t("features.player.position")}
                        aria-valuetext={`${formatTime(currentTime)} / ${formatTime(duration)}`}
                        className="form-range m-0"
                        disabled={duration <= 0}
                        max={duration}
                        min={0}
                        onChange={(event) => seekTo(Number(event.target.value))}
                        step={0.1}
                        type="range"
                        value={Math.min(currentTime, duration)}
                    />
                    <span className="small text-secondary">{formatTime(duration)}</span>
                </div>
                <label className="tbf-bottom-player__volume small">
                    {t("features.player.volume")}
                    <input
                        aria-valuetext={`${Math.round(volume * 100)}%`}
                        className="form-range d-block m-0"
                        max={1}
                        min={0}
                        onChange={(event) => setVolume(Number(event.target.value))}
                        step={0.01}
                        type="range"
                        value={volume}
                    />
                </label>
                <div className="tbf-bottom-player__close">
                    <ToolButton ariaLabel={t("features.player.close")} icon={faXmark} onClick={closePlayer} />
                </div>
            </div>
            {playbackError && (
                <div className="text-danger small mt-2" role="alert">
                    {t("features.player.playbackError")}
                </div>
            )}
        </section>
    );
};
