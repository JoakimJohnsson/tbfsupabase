import {type SubmitEvent, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import Feedback from "../../../components/feedback/Feedback";
import SimpleSpinner from "../../../components/spinners/SimpleSpinner";
import {getRecordSongs} from "../../songs/api/getRecordSongs";
import {createSong} from "../../songs/api/createSong";
import {updateSong} from "../../songs/api/updateSong";
import {deleteSong} from "../../songs/api/deleteSong";
import {isAbortError} from "../../../lib/asyncHelpers/withAbortSignal";
import type {Artist, SimpleMessage, SongWithArtists} from "../../../types";
import {RecordSongsEdit} from "./RecordSongsEdit.tsx";
import {RecordSongsToolRow} from "./RecordSongsToolRow.tsx";
import {RecordSongsAdd} from "./RecordSongsAdd.tsx";

interface RecordSongsManagerProps {
    availableArtists: Artist[];
    defaultArtistIds?: string[];
    recordId: string;
}

const sortSongs = (list: SongWithArtists[]) => {
    return [...list].sort((a, b) => {
        if (a.track_number === null && b.track_number === null) return a.name.localeCompare(b.name);
        if (a.track_number === null) return 1;
        if (b.track_number === null) return -1;
        if (a.track_number !== b.track_number) return a.track_number - b.track_number;
        return a.name.localeCompare(b.name);
    });
};

export const RecordSongsManager = ({
                                       availableArtists,
                                       defaultArtistIds = [],
                                       recordId,
                                   }: RecordSongsManagerProps) => {
    const {t} = useTranslation();

    const [songs, setSongs] = useState<SongWithArtists[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<SimpleMessage>(null);
    const [actionFeedback, setActionFeedback] = useState<{ error: SimpleMessage; success: SimpleMessage }>({
        error: null,
        success: null,
    });

    // Create form state
    const [songName, setSongName] = useState("");
    const [trackNumber, setTrackNumber] = useState("");
    const [selectedArtistIds, setSelectedArtistIds] = useState<string[]>(defaultArtistIds);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Edit form state
    const [editingSongId, setEditingSongId] = useState<string | null>(null);
    const [editSongName, setEditSongName] = useState("");
    const [editTrackNumber, setEditTrackNumber] = useState("");
    const [editArtistIds, setEditArtistIds] = useState<string[]>([]);
    const [isSavingEdit, setIsSavingEdit] = useState(false);

    useEffect(() => {
        const controller = new AbortController();
        setLoading(true);

        const load = async () => {
            try {
                const data = await getRecordSongs(recordId, controller.signal);
                setSongs(data);
            } catch (err) {
                if (!isAbortError(err)) {
                    console.error(err);
                    setError(t("features.admin.songs.loadError"));
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        void load();

        return () => {
            controller.abort();
        };
    }, [recordId, t]);

    const mapArtistRelations = (artistIds: string[]) => {
        return artistIds
            .map((id, index) => {
                const found = availableArtists.find((a) => a.id === id);
                if (!found) return null;
                return {
                    song_id: "",
                    artist_id: id,
                    is_primary: index === 0,
                    artists: {id: found.id, name: found.name, slug: found.slug},
                };
            })
            .filter(Boolean) as SongWithArtists["song_artists"];
    };

    const handleCreateSong = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        const trimmed = songName.trim();
        if (!trimmed) {
            setActionFeedback({error: t("features.admin.songs.invalidNameError"), success: null});
            return;
        }

        let parsedTrack: number | undefined;
        if (trackNumber.trim()) {
            const num = Number(trackNumber);
            if (isNaN(num) || !Number.isInteger(num)) {
                setActionFeedback({error: t("features.admin.songs.invalidTrackError"), success: null});
                return;
            }
            parsedTrack = num;
        }

        setIsSubmitting(true);
        setActionFeedback({error: null, success: null});

        try {
            const newSong = await createSong({
                record_id: recordId,
                name: trimmed,
                track_number: parsedTrack,
                artist_ids: selectedArtistIds,
            });

            const withArtists: SongWithArtists = {
                ...newSong,
                song_artists: mapArtistRelations(selectedArtistIds),
            };

            setSongs((cur) => sortSongs([...cur, withArtists]));
            setSongName("");
            setTrackNumber("");
            setSelectedArtistIds(defaultArtistIds);
            setActionFeedback({error: null, success: t("features.admin.songs.createSuccess")});
        } catch (err) {
            console.error(err);
            setActionFeedback({error: t("features.admin.songs.createError"), success: null});
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleStartEdit = (song: SongWithArtists) => {
        setEditingSongId(song.id);
        setEditSongName(song.name);
        setEditTrackNumber(song.track_number !== null ? String(song.track_number) : "");
        setEditArtistIds(song.song_artists.map((sa) => sa.artist_id));
        setActionFeedback({error: null, success: null});
    };

    const handleSaveEdit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!editingSongId) return;

        const trimmed = editSongName.trim();
        if (!trimmed) {
            setActionFeedback({error: t("features.admin.songs.invalidNameError"), success: null});
            return;
        }

        let parsedTrack: number | undefined;
        if (editTrackNumber.trim()) {
            const num = Number(editTrackNumber);
            if (isNaN(num) || !Number.isInteger(num)) {
                setActionFeedback({error: t("features.admin.songs.invalidTrackError"), success: null});
                return;
            }
            parsedTrack = num;
        }

        setIsSavingEdit(true);

        try {
            const updated = await updateSong({
                id: editingSongId,
                name: trimmed,
                track_number: parsedTrack,
                artist_ids: editArtistIds,
            });

            const withArtists: SongWithArtists = {
                ...updated,
                song_artists: mapArtistRelations(editArtistIds),
            };

            setSongs((cur) => sortSongs(cur.map((s) => (s.id === updated.id ? withArtists : s))));
            setEditingSongId(null);
            setActionFeedback({error: null, success: t("features.admin.songs.editSuccess")});
        } catch (err) {
            console.error(err);
            setActionFeedback({error: t("features.admin.songs.editError"), success: null});
        } finally {
            setIsSavingEdit(false);
        }
    };

    const handleDeleteSong = async (song: SongWithArtists) => {
        if (!window.confirm(t("features.admin.songs.deleteConfirm", {name: song.name}))) {
            return;
        }

        try {
            await deleteSong(song.id);
            setSongs((cur) => cur.filter((s) => s.id !== song.id));
            setActionFeedback({error: null, success: t("features.admin.songs.deleteSuccess")});
        } catch (err) {
            console.error(err);
            setActionFeedback({error: t("features.admin.songs.deleteError"), success: null});
        }
    };

    if (loading) return <SimpleSpinner/>;
    if (error) return <Feedback errors={[error]}/>;

    return (
        <div className="mt-3 p-3 bg-body-tertiary rounded border">
            <h6 className="fw-bold mb-3">{t("features.admin.songs.title")}</h6>

            <Feedback errors={[actionFeedback.error]} successes={[actionFeedback.success]}/>

            {songs.length === 0 ? (
                <p className="text-muted small">{t("features.admin.songs.noSongs")}</p>
            ) : (
                <ol className="list-group list-group-numbered mb-3">
                    {songs.map((song) => {
                        const isEditing = editingSongId === song.id;
                        const artistNames = song.song_artists.map((sa) => sa.artists?.name).filter(Boolean).join(", ");

                        if (isEditing) {
                            return (
                                <RecordSongsEdit key={song.id}
                                                 song={song}
                                                 handleSaveEdit={handleSaveEdit}
                                                 setEditTrackNumber={setEditTrackNumber}
                                                 editTrackNumber={editTrackNumber}
                                                 setEditSongName={setEditSongName}
                                                 editSongName={editSongName}
                                                 isSavingEdit={isSavingEdit}
                                                 setEditingSongId={setEditingSongId}
                                />
                            );
                        }

                        return (
                            <RecordSongsToolRow key={song.id}
                                                song={song}
                                                artistNames={artistNames}
                                                handleStartEdit={handleStartEdit}
                                                handleDeleteSong={handleDeleteSong}
                            />
                        );
                    })}
                </ol>
            )}

            <RecordSongsAdd handleCreateSong={handleCreateSong}
                            recordId={recordId}
                            songName={songName}
                            setSongName={setSongName}
                            setTrackNumber={setTrackNumber}
                            trackNumber={trackNumber}
                            isSubmitting={isSubmitting}
            />
        </div>
    );
};