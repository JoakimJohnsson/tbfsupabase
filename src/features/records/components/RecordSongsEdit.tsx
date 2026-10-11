import { useRef, type ChangeEvent, type SubmitEvent } from "react";
import { useTranslation } from "react-i18next";
import { faFileAudio, faFloppyDisk, faTrashCan, faUpload, faXmark } from "@fortawesome/pro-solid-svg-icons";
import { ToolButton } from "../../../components/buttons/ToolButton";
import { ToolButtonGroup } from "../../../components/buttons/ToolButtonGroup";
import type { Artist, SongWithArtists } from "../../../types";

interface IRecordSongsEdit {
    availableArtists: Artist[];
    editArtistIds: string[];
    onArtistChange: (artistId: string) => void;
    song: SongWithArtists;
    handleSaveEdit: (event: SubmitEvent<HTMLFormElement>) => Promise<void>;
    setEditTrackNumber: (value: string) => void;
    editTrackNumber: string;
    setEditSongName: (value: string) => void;
    editSongName: string;
    editAudioFile: File | null;
    onEditAudioFileSelect: (file: File | null) => void;
    isSavingEdit: boolean;
    setEditingSongId: (value: string | null) => void;
}

export const RecordSongsEdit = ({
    availableArtists,
    editArtistIds,
    onArtistChange,
    song,
    handleSaveEdit,
    setEditTrackNumber,
    editTrackNumber,
    setEditSongName,
    editSongName,
    editAudioFile,
    onEditAudioFileSelect,
    isSavingEdit,
    setEditingSongId,
}: IRecordSongsEdit) => {
    const { t } = useTranslation();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        onEditAudioFileSelect(file);
    };

    const handleClearFile = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        onEditAudioFileSelect(null);
    };

    return (
        <li className="list-group-item">
            <form onSubmit={handleSaveEdit}>
                <div className="row g-2 mb-2 align-items-center">
                    {/* Track Number */}
                    <div className="col-12 col-sm-2 col-md-1">
                        <label className="visually-hidden" htmlFor={`track-number-${song.id}`}>
                            {t("forms.trackNumber")}
                        </label>
                        <input
                            className="form-control"
                            id={`track-number-${song.id}`}
                            name="track-number"
                            onChange={(e) => setEditTrackNumber(e.target.value)}
                            placeholder={t("forms.trackNumberPlaceholder")}
                            type="number"
                            value={editTrackNumber}
                        />
                    </div>

                    {/* Song Title */}
                    <div className="col-12 col-sm-5 col-md-3">
                        <label className="visually-hidden" htmlFor={`name-${song.id}`}>
                            {t("forms.name")}
                        </label>
                        <input
                            className="form-control"
                            id={`name-${song.id}`}
                            name="name"
                            onChange={(e) => setEditSongName(e.target.value)}
                            required
                            type="text"
                            value={editSongName}
                        />
                    </div>

                    {/* Performing Artist Selector */}
                    <div className="col-12 col-sm-5 col-md-3">
                        <label className="visually-hidden" htmlFor={`edit-artist-${song.id}`}>
                            {t("forms.artist", { defaultValue: "Artist" })}
                        </label>
                        <select
                            className="form-select"
                            id={`edit-artist-${song.id}`}
                            name="artist"
                            onChange={(e) => onArtistChange(e.target.value)}
                            value={editArtistIds[0] ?? ""}
                        >
                            <option value="">
                                {t("forms.selectArtistPlaceholder", { defaultValue: "-- Select artist --" })}
                            </option>
                            {availableArtists.map((artist) => (
                                <option key={artist.id} value={artist.id}>
                                    {artist.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Audio Upload */}
                    <div className="col-12 col-sm-6 col-md-3 d-flex align-items-center gap-2">
                        <ToolButton
                            disabled={isSavingEdit}
                            icon={editAudioFile || song.audio_path ? faFileAudio : faUpload}
                            onClick={() => fileInputRef.current?.click()}
                            size="sm"
                            text={
                                editAudioFile
                                    ? editAudioFile.name
                                    : song.audio_path
                                      ? t("forms.changeAudio")
                                      : t("forms.uploadAudio")
                            }
                            type="button"
                            variant={editAudioFile || song.audio_path ? "outline-success" : "outline-secondary"}
                        />
                        {editAudioFile && (
                            <ToolButton
                                ariaLabel={t("common.delete")}
                                text={t("common.delete")}
                                disabled={isSavingEdit}
                                icon={faTrashCan}
                                onClick={handleClearFile}
                                size="sm"
                                type="button"
                                variant="outline-danger"
                            />
                        )}
                        <input
                            accept="audio/mpeg,audio/mp3,audio/ogg,audio/wav,audio/x-m4a,audio/mp4"
                            className="d-none"
                            disabled={isSavingEdit}
                            id={`edit-audio-file-${song.id}`}
                            onChange={handleFileChange}
                            ref={fileInputRef}
                            type="file"
                        />
                    </div>
                </div>

                <ToolButtonGroup>
                    <ToolButton
                        disabled={isSavingEdit}
                        icon={faFloppyDisk}
                        text={t("common.save")}
                        type="submit"
                        variant="primary"
                    />
                    <ToolButton
                        icon={faXmark}
                        onClick={() => {
                            setEditingSongId(null);
                            onEditAudioFileSelect(null);
                        }}
                        text={t("common.cancel")}
                        variant="secondary"
                    />
                </ToolButtonGroup>
            </form>
        </li>
    );
};
