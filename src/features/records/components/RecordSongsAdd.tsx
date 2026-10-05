import { useRef, type ChangeEvent, type SubmitEvent } from "react";
import { useTranslation } from "react-i18next";
import { faFileAudio, faTrashCan, faUpload } from "@fortawesome/pro-solid-svg-icons";
import { ToolButton } from "../../../components/buttons/ToolButton";

interface IRecordSongsAdd {
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
                <div className="col-12 col-sm-2 col-md-1">
                    <label className="visually-hidden" htmlFor={`track-number-${recordId}`}>
                        {t("forms.trackNumber")}
                    </label>
                    <input
                        className="form-control"
                        id={`track-number-${recordId}`}
                        name="track-number"
                        onChange={(e) => setTrackNumber(e.target.value)}
                        placeholder={t("forms.trackNumberPlaceholder")}
                        type="number"
                        value={trackNumber}
                    />
                </div>

                <div className="col-12 col-sm-5 col-md-4">
                    <label className="visually-hidden" htmlFor={`name-${recordId}`}>
                        {t("forms.name")}
                    </label>
                    <input
                        className="form-control"
                        id={`name-${recordId}`}
                        name="name"
                        onChange={(e) => setSongName(e.target.value)}
                        placeholder={t("forms.name")}
                        required
                        type="text"
                        value={songName}
                    />
                </div>

                <div className="col-12 col-sm-5 col-md-4 d-flex align-items-center gap-2">
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

                <div className="col-12 col-md-auto ms-auto">
                    <button className="btn btn-primary btn-sm w-100" disabled={isSubmitting} type="submit">
                        {isSubmitting ? t("features.admin.songs.submitting") : t("features.admin.songs.addSong")}
                    </button>
                </div>
            </div>
        </form>
    );
};
