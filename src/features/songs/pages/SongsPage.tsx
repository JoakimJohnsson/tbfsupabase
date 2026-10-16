import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCompactDisc, faMusic, faPlay, faStop } from "@fortawesome/pro-solid-svg-icons";
import { useSongs } from "../hooks/useSongs";
import { SearchToolbar } from "../../../components/search/SearchToolbar";
import { SimpleSpinner } from "../../../components/spinners/SimpleSpinner";
import { Feedback } from "../../../components/feedback/Feedback";
import { EmptyStateCard } from "../../../components/cards/EmptyStateCard";
import { ListRowItem } from "../../../components/lists/ListRowItem";
import { ToolButton } from "../../../components/buttons/ToolButton";

export const SongsPage = () => {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState("");
    const [activeSongUrl, setActiveSongUrl] = useState<string | null>(null);

    const { songs, loading, loadError } = useSongs({
        loadErrorMessage: t("features.songs.loadError"),
    });

    const filteredSongs = useMemo(() => {
        const query = searchTerm.trim().toLowerCase();
        if (!query) return songs;

        return songs.filter((s) => {
            const matchesName = s.name.toLowerCase().includes(query);
            const matchesRecord = s.records?.name.toLowerCase().includes(query) ?? false;
            const matchesArtist = s.song_artists.some((sa) => sa.artists?.name.toLowerCase().includes(query));

            return matchesName || matchesRecord || matchesArtist;
        });
    }, [songs, searchTerm]);

    const handleTogglePlay = (audioPath: string) => {
        if (activeSongUrl === audioPath) {
            setActiveSongUrl(null);
        } else {
            setActiveSongUrl(audioPath);
        }
    };

    if (loading) {
        return <SimpleSpinner message={t("common.loading")} />;
    }

    if (loadError) {
        return <Feedback errors={[loadError]} />;
    }

    return (
        <main className="container-fluid" id="main-content">
            <h1 className="h2 fw-bold mb-4">{t("features.songs.title")}</h1>

            <SearchToolbar
                countText={
                    <>
                        {filteredSongs.length}{" "}
                        {filteredSongs.length === 1
                            ? t("features.admin.dashboard.stats.song")
                            : t("features.admin.dashboard.stats.songs")}
                    </>
                }
                onSearchChange={setSearchTerm}
                searchPlaceholder={t("features.songs.searchPlaceholder")}
                searchValue={searchTerm}
                showSearch={songs.length > 0}
                title={t("features.songs.listTitle")}
            />

            {/* Simple player */}
            {activeSongUrl && (
                <div className="card bg-body-secondary shadow-sm mb-4 border">
                    <div className="card-body p-3 d-flex align-items-center gap-3">
                        <FontAwesomeIcon className="text-primary fs-4 flex-shrink-0" icon={faMusic} />
                        <audio autoPlay className="w-100" controls key={activeSongUrl} src={activeSongUrl} />
                    </div>
                </div>
            )}

            {filteredSongs.length === 0 ? (
                <EmptyStateCard message={t("features.songs.empty")} />
            ) : (
                <ul className="list-group shadow-sm mb-4">
                    {filteredSongs.map((song) => {
                        const artistNames = song.song_artists
                            .map((sa) => sa.artists?.name)
                            .filter(Boolean)
                            .join(", ");

                        const hasAudio = Boolean(song.audio_path?.trim());
                        const isPlaying = activeSongUrl === song.audio_path;

                        return (
                            <ListRowItem
                                actions={
                                    hasAudio ? (
                                        <ToolButton
                                            ariaLabel={isPlaying ? `Stop ${song.name}` : `Play ${song.name}`}
                                            icon={isPlaying ? faStop : faPlay}
                                            onClick={() => handleTogglePlay(song.audio_path)}
                                            size="sm"
                                            text={isPlaying ? t("common.stop") : t("common.play")}
                                            variant={isPlaying ? "primary" : "outline-success"}
                                        />
                                    ) : undefined
                                }
                                className={`py-2${isPlaying ? " bg-primary-subtle" : ""}`}
                                key={song.id}
                            >
                                <div className="d-flex align-items-center gap-3 min-w-0">
                                    <div
                                        className="d-flex align-items-center justify-content-center bg-body border rounded flex-shrink-0 overflow-hidden"
                                        style={{ width: "40px", height: "40px" }}
                                    >
                                        {song.records?.cover_path ? (
                                            <img
                                                alt={song.records.name}
                                                className="w-100 h-100 object-fit-cover"
                                                src={song.records.cover_path}
                                            />
                                        ) : (
                                            <FontAwesomeIcon className="text-secondary" icon={faCompactDisc} />
                                        )}
                                    </div>

                                    <div className="min-w-0">
                                        <div className={`fw-semibold text-truncate ${hasAudio ? "text-success" : ""}`}>
                                            {song.name}
                                        </div>
                                        <div className="small text-secondary text-truncate">
                                            {artistNames || "—"}
                                            {song.records && (
                                                <>
                                                    <span className="mx-1">•</span>
                                                    <span>{song.records.name}</span>
                                                    {song.records.year && <span> ({song.records.year})</span>}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </ListRowItem>
                        );
                    })}
                </ul>
            )}
        </main>
    );
};
