import { useTranslation } from "react-i18next";
import { faPlay, faPause } from "@fortawesome/pro-solid-svg-icons";
import { ListRowItem } from "../../../components/lists/ListRowItem";
import { ToolButton } from "../../../components/buttons/ToolButton";
import type { SongWithRecordAndArtists } from "../../../types";
import { usePlayer } from "../../player/hooks/usePlayer";
import { SongListItemContent } from "./SongListItemContent";

interface ISongListItem {
    song: SongWithRecordAndArtists;
    showCover?: boolean;
    showRecordInfo?: boolean;
}

export const SongListItem = ({ song, showCover = false, showRecordInfo = false }: ISongListItem) => {
    const { t } = useTranslation();
    const { currentSong, isPlaying, togglePlay } = usePlayer();
    const isCurrent = currentSong?.id === song.id && isPlaying;
    const hasAudio = Boolean(song.audio_path?.trim());

    return (
        <ListRowItem
            actions={
                hasAudio ? (
                    <ToolButton
                        icon={isCurrent ? faPause : faPlay}
                        onClick={() => togglePlay(song)}
                        variant={isCurrent ? "primary" : "outline-primary"}
                        text={isCurrent ? t("common.pause") : t("common.play")}
                    />
                ) : undefined
            }
            className={`py-2${isCurrent ? " bg-primary-subtle" : ""}`}
        >
            <SongListItemContent showCover={showCover} showRecordInfo={showRecordInfo} song={song} />
        </ListRowItem>
    );
};
