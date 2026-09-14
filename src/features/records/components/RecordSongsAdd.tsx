import { type SubmitEvent } from "react";
import { useTranslation } from "react-i18next";

interface RecordSongsAddProps {
    handleCreateSong: (event: SubmitEvent<HTMLFormElement>) => Promise<void>;
    recordId: string;
    setTrackNumber: (value: string) => void;
    trackNumber: string;
    setSongName: (value: string) => void;
    songName: string;
    isSubmitting: boolean;
}

export const RecordSongsAdd = ({
    handleCreateSong,
    recordId,
    setTrackNumber,
    trackNumber,
    setSongName,
    songName,
    isSubmitting,
}: RecordSongsAddProps) => {
    const { t } = useTranslation();

    return (
        <form onSubmit={handleCreateSong}>
            <div className="row g-2">
                <div className="col-2">
                    <label
                        className="visually-hidden"
                        htmlFor={`track-number-${recordId}`}
                    >
                        {t("forms.trackNumber")}
                    </label>
                    <input
                        className="form-control"
                        id={`track-number-${recordId}`}
                        name="track-number"
                        onChange={(e) => setTrackNumber(e.target.value)}
                        placeholder="#"
                        type="number"
                        value={trackNumber}
                    />
                </div>
                <div className="col">
                    <label
                        className="visually-hidden"
                        htmlFor={`name-${recordId}`}
                    >
                        {t("forms.name")}
                    </label>
                    <input
                        className="form-control"
                        id={`name-${recordId}`}
                        name="name"
                        onChange={(e) => setSongName(e.target.value)}
                        required
                        type="text"
                        value={songName}
                    />
                </div>
                <div className="col-auto">
                    <button
                        className="btn btn-primary"
                        disabled={isSubmitting}
                        type="submit"
                    >
                        {isSubmitting
                            ? t("features.admin.songs.submitting")
                            : t("features.admin.songs.addSong")}
                    </button>
                </div>
            </div>
        </form>
    );
};
