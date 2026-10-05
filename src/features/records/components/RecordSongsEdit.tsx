import { useRef, type ChangeEvent, type SubmitEvent } from "react";
import { useTranslation } from "react-i18next";
import { faFileAudio, faFloppyDisk, faTrashCan, faUpload, faXmark } from "@fortawesome/pro-solid-svg-icons";
import { ToolButton } from "../../../components/buttons/ToolButton";
import { ToolButtonGroup } from "../../../components/buttons/ToolButtonGroup";
import type { SongWithArtists } from "../../../types";

interface IRecordSongsEdit {
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
                    <div className="col-12 col-sm-2">
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
                    <div className="col-12 col-sm-5">
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

                    <div className="col-12 col-sm-5 d-flex align-items-center gap-2">
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
