import { useRef, type ChangeEvent, type SubmitEvent } from "react";
import { useTranslation } from "react-i18next";
import { faFileAudio, faTrashCan, faUpload } from "@fortawesome/pro-solid-svg-icons";
import { FormInput } from "../../../../components/form/FormInput";
import { FormNumberInput } from "../../../../components/form/FormNumberInput";
import { FormSelect } from "../../../../components/form/FormSelect";
import { ToolButton } from "../../../../components/buttons/ToolButton";
import type { Artist } from "../../../../types";

interface IRecordSongsAdd {
    availableArtists: Artist[];
    selectedArtistIds: string[];
    onArtistChange: (artistId: string) => void;
    handleCreateSong: (event: SubmitEvent<HTMLFormElement>) => Promise<void>;
    recordId: string;
    setTrackNumber: (value: string) => void;
    trackNumber: string;
    setSongName: (value: string) => void;
    songName: string;
    audioFile: File | null;
    onAudioFileSelect: (file: File | null) => void;
    isSubmitting: boolean;
}

export const RecordSongsAdd = ({
    availableArtists,
    selectedArtistIds,
    onArtistChange,
    handleCreateSong,
    recordId,
    setTrackNumber,
    trackNumber,
    setSongName,
    songName,
    audioFile,
    onAudioFileSelect,
    isSubmitting,
}: IRecordSongsAdd) => {
    const { t } = useTranslation();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const artistOptions = availableArtists.map((artist) => ({
        label: artist.name,
        value: artist.id,
    }));

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        onAudioFileSelect(file);
    };

    const handleClearFile = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        onAudioFileSelect(null);
    };

    return (
        <form onSubmit={handleCreateSong}>
            <div className="row g-2 align-items-center">
                {/* Track Number */}
                <div className="col-12 col-sm-2 col-md-1">
                    <FormNumberInput
                        ariaLabel={t("forms.trackNumber")}
                        containerClassName=""
                        hideLabel
                        id={`track-number-${recordId}`}
                        label={t("forms.trackNumber")}
                        name="track-number"
                        onChange={setTrackNumber}
                        placeholder={t("forms.trackNumberPlaceholder")}
                        value={trackNumber}
                    />
                </div>

                {/* Song Title */}
                <div className="col-12 col-sm-5 col-md-3">
                    <FormInput
                        ariaLabel={t("forms.name")}
                        containerClassName=""
                        hideLabel
                        id={`name-${recordId}`}
                        label={t("forms.name")}
                        name="name"
                        onChange={setSongName}
                        placeholder={t("forms.name")}
                        required
                        value={songName}
                    />
                </div>

                {/* Performing Artist Selector */}
                <div className="col-12 col-sm-5 col-md-3">
                    <FormSelect
                        ariaLabel={t("forms.artist")}
                        containerClassName=""
                        hideLabel
                        id={`artist-${recordId}`}
                        label={t("forms.artist")}
                        name="artist"
                        onChange={onArtistChange}
                        options={artistOptions}
                        placeholder={t("forms.selectArtistPlaceholder", { defaultValue: "-- Select artist --" })}
                        value={selectedArtistIds[0] ?? ""}
                    />
                </div>

                {/* Audio Upload */}
                <div className="col-12 col-sm-6 col-md-3 d-flex align-items-center gap-2">
                    <ToolButton
                        disabled={isSubmitting}
                        icon={audioFile ? faFileAudio : faUpload}
                        onClick={() => fileInputRef.current?.click()}
                        size="sm"
                        text={audioFile ? audioFile.name : t("forms.uploadAudio")}
                        type="button"
                        variant={audioFile ? "outline-success" : "outline-secondary"}
                    />
                    {audioFile && (
                        <ToolButton
                            ariaLabel={t("common.delete")}
                            disabled={isSubmitting}
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
                        disabled={isSubmitting}
                        id={`audio-file-${recordId}`}
                        onChange={handleFileChange}
                        ref={fileInputRef}
                        type="file"
                    />
                </div>

                <span className="text-muted small">{t("forms.audioUploadHelp")}</span>

                {/* Submit */}
                <div className="col-12 col-md-auto ms-auto">
                    <button className="btn btn-primary btn-sm w-100" disabled={isSubmitting} type="submit">
                        {isSubmitting ? t("features.admin.songs.submitting") : t("features.admin.songs.addSong")}
                    </button>
                </div>
            </div>
        </form>
    );
};
