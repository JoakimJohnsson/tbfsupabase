import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { faPlay, faPause, faHeart as faSolidHeart, faTrash } from "@fortawesome/pro-solid-svg-icons";
import { faHeart as faRegularHeart } from "@fortawesome/pro-regular-svg-icons";
import { ListRowItem } from "../../../components/lists/ListRowItem";
import { ToolButton } from "../../../components/buttons/ToolButton";
import type { SongWithRecordAndArtists } from "../../../types";
import { usePlayer } from "../../player/hooks/usePlayer";
import { AuthContext } from "../../auth/AuthContext";
import { FavoritesContext } from "../../favorites/hooks/FavoritesContext";
import { SongListItemContent } from "./SongListItemContent";

interface ISongListItem {
    song: SongWithRecordAndArtists;
    songs?: SongWithRecordAndArtists[];
    showCover?: boolean;
    showRecordInfo?: boolean;
    onRemoveSong?: (songId: string) => void;
    removeSongLabel?: string;
}

export const SongListItem = ({
    song,
    songs,
    showCover = false,
    showRecordInfo = false,
    onRemoveSong,
    removeSongLabel,
}: ISongListItem) => {
    const { t } = useTranslation();
    const { currentSong, isPlaying, togglePlay } = usePlayer();
    const auth = useContext(AuthContext);
    const favorites = useContext(FavoritesContext);
    const user = auth?.user;
    const isCurrent = currentSong?.id === song.id && isPlaying;
    const hasAudio = Boolean(song.audio_path?.trim());
    const favorite = favorites?.isFavorite(song.id) ?? false;
    const actions = (
        <>
            {hasAudio && (
                <ToolButton
                    icon={isCurrent ? faPause : faPlay}
                    onClick={() => togglePlay(song, songs)}
                    variant={isCurrent ? "primary" : "outline-primary"}
                    text={isCurrent ? t("common.pause") : t("common.play")}
                />
            )}
            {user && (
                <ToolButton
                    ariaLabel={t(favorite ? "features.favorites.removeFavorite" : "features.favorites.addFavorite")}
                    ariaPressed={favorite}
                    className={favorite ? "text-danger" : undefined}
                    icon={favorite ? faSolidHeart : faRegularHeart}
                    onClick={() =>
                        void favorites?.toggleFavorite(song.id).catch((error: unknown) => {
                            console.error(error);
                        })
                    }
                    variant="outline-secondary"
                />
            )}
            {onRemoveSong && (
                <ToolButton
                    ariaLabel={removeSongLabel ?? t("common.remove")}
                    icon={faTrash}
                    onClick={() => onRemoveSong(song.id)}
                    variant="outline-danger"
                />
            )}
        </>
    );

    return (
        <ListRowItem
            actions={hasAudio || user || onRemoveSong ? actions : undefined}
            className={`py-2${isCurrent ? " bg-primary-subtle" : ""}`}
        >
            <SongListItemContent showCover={showCover} showRecordInfo={showRecordInfo} song={song} />
        </ListRowItem>
    );
};
