import { useRef, type ChangeEvent, type SubmitEvent } from "react";
import { useTranslation } from "react-i18next";
import { faFileAudio, faFloppyDisk, faTrashCan, faUpload, faXmark } from "@fortawesome/pro-solid-svg-icons";
import { FormInput } from "../../../../components/form/FormInput";
import { FormNumberInput } from "../../../../components/form/FormNumberInput";
import { FormSelect } from "../../../../components/form/FormSelect";
import { ToolButton } from "../../../../components/buttons/ToolButton";
import { ToolButtonGroup } from "../../../../components/buttons/ToolButtonGroup";
import type { Artist, SongWithArtists } from "../../../../types";

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

    const artistOptions = availableArtists.map((artist) => ({
        label: artist.name,
        value: artist.id,
    }));

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
        <li className="list-group-item bg-body border-top-0 p-3">
            <form onSubmit={handleSaveEdit}>
                <div className="row g-2 mb-2 align-items-center">
                    {/* Track Number */}
                    <div className="col-12 col-sm-2 col-md-1">
                        <FormNumberInput
                            ariaLabel={t("forms.trackNumber")}
                            containerClassName=""
                            hideLabel
                            id={`track-number-${song.id}`}
                            label={t("forms.trackNumber")}
                            name="track-number"
                            onChange={setEditTrackNumber}
                            placeholder={t("forms.trackNumberPlaceholder")}
                            value={editTrackNumber}
                        />
                    </div>

                    {/* Song Title */}
                    <div className="col-12 col-sm-5 col-md-3">
                        <FormInput
                            ariaLabel={t("forms.name")}
                            containerClassName=""
                            hideLabel
                            id={`name-${song.id}`}
                            label={t("forms.name")}
                            name="name"
                            onChange={setEditSongName}
                            required
                            value={editSongName}
                        />
                    </div>

                    {/* Performing Artist Selector */}
                    <div className="col-12 col-sm-5 col-md-3">
                        <FormSelect
                            ariaLabel={t("forms.artist", { defaultValue: "Artist" })}
                            containerClassName=""
                            hideLabel
                            id={`edit-artist-${song.id}`}
                            label={t("forms.artist", { defaultValue: "Artist" })}
                            name="artist"
                            onChange={onArtistChange}
                            options={artistOptions}
                            placeholder={t("forms.selectArtistPlaceholder", { defaultValue: "-- Select artist --" })}
                            value={editArtistIds[0] ?? ""}
                        />
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
                    <div>
                        <span className="text-muted small">{t("forms.audioUploadHelp")}</span>
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
