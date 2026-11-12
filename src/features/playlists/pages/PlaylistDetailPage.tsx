import { useEffect, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router";
import { Breadcrumbs } from "../../../components/navs/Breadcrumbs";
import { ConfirmModal } from "../../../components/feedback/ConfirmModal";
import { Feedback } from "../../../components/feedback/Feedback";
import { FormInput } from "../../../components/form/FormInput";
import { FormTextArea } from "../../../components/form/FormTextArea";
import { SimpleSpinner } from "../../../components/spinners/SimpleSpinner";
import { isAbortError } from "../../../lib/asyncHelpers/withAbortSignal";
import type { SongWithRecordAndArtists } from "../../../types";
import { getSongs } from "../../songs/api/getSongs";
import { SongList } from "../../songs/components/SongList";
import { addSongToPlaylist } from "../api/addSongToPlaylist";
import { deletePlaylist } from "../api/deletePlaylist";
import { getPlaylist, type PlaylistDetails } from "../api/getPlaylist";
import { removeSongFromPlaylist } from "../api/removeSongFromPlaylist";
import { updatePlaylist } from "../api/updatePlaylist";

export const PlaylistDetailPage = () => {
    const { t } = useTranslation();
    const { playlistId } = useParams();
    const navigate = useNavigate();
    const [playlist, setPlaylist] = useState<PlaylistDetails | null>(null);
    const [catalogueSongs, setCatalogueSongs] = useState<SongWithRecordAndArtists[]>([]);
    const [selectedSongId, setSelectedSongId] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [pending, setPending] = useState(false);
    const [loadError, setLoadError] = useState(false);
    const [actionError, setActionError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();
        setLoading(true);
        setLoadError(false);

        if (!playlistId) {
            setLoadError(true);
            setLoading(false);
            return () => controller.abort();
        }

        void Promise.all([getPlaylist(playlistId, controller.signal), getSongs(controller.signal, { all: true })])
            .then(([data, songs]) => {
                setPlaylist(data);
                setName(data.name);
                setDescription(data.description ?? "");
                setCatalogueSongs(songs);
            })
            .catch((error: unknown) => {
                if (!isAbortError(error)) {
                    console.error(error);
                    setLoadError(true);
                }
            })
            .finally(() => {
                if (!controller.signal.aborted) setLoading(false);
            });

        return () => controller.abort();
    }, [playlistId]);

    const handleSave = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!playlist || !name.trim()) return;
        setPending(true);
        setActionError(null);
        try {
            const updated = await updatePlaylist(playlist.id, name.trim(), description);
            setPlaylist({ ...playlist, ...updated });
            setIsEditing(false);
        } catch (error) {
            console.error(error);
            setActionError(t("features.playlists.updateError"));
        } finally {
            setPending(false);
        }
    };

    const handleDelete = async () => {
        if (!playlist) return;
        setPending(true);
        setActionError(null);
        try {
            await deletePlaylist(playlist.id);
            navigate("/playlists", { replace: true });
        } catch (error) {
            console.error(error);
            setActionError(t("features.playlists.deleteError"));
            setShowDelete(false);
        } finally {
            setPending(false);
        }
    };

    const handleRemoveSong = async (songId: string) => {
        if (!playlist) return;
        const playlistSongId = playlist.playlistSongIds[songId];
        if (!playlistSongId) return;

        setActionError(null);
        try {
            await removeSongFromPlaylist(playlistSongId);
            setPlaylist((current) =>
                current
                    ? {
                          ...current,
                          songs: current.songs.filter((song) => song.id !== songId),
                          playlistSongIds: Object.fromEntries(
                              Object.entries(current.playlistSongIds).filter(([id]) => id !== songId),
                          ),
                      }
                    : current,
            );
        } catch (error) {
            console.error(error);
            setActionError(t("features.playlists.removeSongError"));
        }
    };

    const handleAddSong = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!playlist || !selectedSongId) return;

        setPending(true);
        setActionError(null);
        try {
            await addSongToPlaylist(playlist.id, selectedSongId);
            setPlaylist(await getPlaylist(playlist.id));
            setSelectedSongId("");
        } catch (error) {
            console.error(error);
            setActionError(t("features.playlists.addSongError"));
        } finally {
            setPending(false);
        }
    };

    const breadcrumbs = [
        { label: t("navigation.home"), to: "/" },
        { label: t("navigation.myPlaylists"), to: "/playlists" },
        ...(playlist ? [{ label: playlist.name }] : []),
    ];

    if (loading) return <SimpleSpinner message={t("common.loading")} />;
    if (loadError) return <Feedback errors={[t("features.playlists.detailLoadError")]} />;
    if (!playlist) return <Feedback warnings={[t("features.playlists.notFound")]} />;

    return (
        <>
            <Breadcrumbs items={breadcrumbs} />
            {actionError && <Feedback errors={[actionError]} />}
            <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
                <div>
                    <h1 className="h2 fw-bold mb-2">{playlist.name}</h1>
                    {playlist.description && <p className="text-secondary mb-0">{playlist.description}</p>}
                </div>
                <div className="d-flex gap-2">
                    <button
                        className="btn btn-outline-primary"
                        onClick={() => setIsEditing((editing) => !editing)}
                        type="button"
                    >
                        {t(isEditing ? "common.cancel" : "features.playlists.edit")}
                    </button>
                    <button className="btn btn-outline-danger" onClick={() => setShowDelete(true)} type="button">
                        {t("features.playlists.delete")}
                    </button>
                </div>
            </div>

            {isEditing && (
                <form className="card card-body mb-4" onSubmit={handleSave}>
                    <FormInput
                        id="playlist-edit-name"
                        label={t("features.playlists.playlistName")}
                        onChange={setName}
                        required
                        value={name}
                    />
                    <FormTextArea
                        id="playlist-edit-description"
                        label={t("features.playlists.playlistDescription")}
                        onChange={setDescription}
                        value={description}
                    />
                    <div>
                        <button className="btn btn-primary" disabled={pending || !name.trim()} type="submit">
                            {t("features.playlists.save")}
                        </button>
                    </div>
                </form>
            )}

            <section aria-labelledby="playlist-songs-heading">
                <h2 className="h4 fw-bold mb-3" id="playlist-songs-heading">
                    {t("features.playlists.songsTitle")}
                </h2>
                <form className="row g-2 align-items-end mb-3" onSubmit={handleAddSong}>
                    <div className="col-12 col-md-8">
                        <label className="form-label" htmlFor="playlist-add-song">
                            {t("features.playlists.selectSong")}
                        </label>
                        <select
                            className="form-select"
                            id="playlist-add-song"
                            onChange={(event) => setSelectedSongId(event.target.value)}
                            value={selectedSongId}
                        >
                            <option value="">{t("features.playlists.selectSong")}</option>
                            {catalogueSongs
                                .filter((song) => !playlist.playlistSongIds[song.id])
                                .map((song) => (
                                    <option key={song.id} value={song.id}>
                                        {song.name}
                                    </option>
                                ))}
                        </select>
                    </div>
                    <div className="col-12 col-md-4">
                        <button className="btn btn-primary" disabled={pending || !selectedSongId} type="submit">
                            {t("features.playlists.addSong")}
                        </button>
                    </div>
                </form>
                <SongList
                    emptyMessage={t("features.playlists.songsEmpty")}
                    onRemoveSong={(songId) => void handleRemoveSong(songId)}
                    removeSongLabel={t("features.playlists.removeSong")}
                    showCover
                    showRecordInfo
                    songs={playlist.songs}
                />
            </section>

            <ConfirmModal
                confirmText={t("features.playlists.delete")}
                isOpen={showDelete}
                isPending={pending}
                message={t("features.playlists.deleteConfirm", { name: playlist.name })}
                onCancel={() => setShowDelete(false)}
                onConfirm={() => void handleDelete()}
                title={t("features.playlists.delete")}
            />
        </>
    );
};
