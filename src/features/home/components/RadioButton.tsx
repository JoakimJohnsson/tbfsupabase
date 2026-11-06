import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRadio } from "@fortawesome/pro-solid-svg-icons";
import { useTranslation } from "react-i18next";
import { Feedback } from "../../../components/feedback/Feedback";
import { useSongs } from "../../songs/hooks/useSongs";
import { usePlayer } from "../../player/hooks/usePlayer";

export const RadioButton = () => {
    const { t } = useTranslation();
    const { startRadio } = usePlayer();
    const { songs, loading, loadError } = useSongs({
        all: true,
        loadErrorMessage: t("features.home.radio.loadError"),
    });
    const playable = songs.filter((song) => song.audio_path?.trim());

    return (
        <div className="col-12 col-md-6">
            <button
                className="btn btn-primary btn-lg w-100 p-4 d-flex flex-column align-items-center gap-2 shadow-sm"
                disabled={loading || Boolean(loadError) || !playable.length}
                onClick={() => startRadio(playable)}
                type="button"
            >
                <FontAwesomeIcon aria-hidden="true" icon={faRadio} size="2x" />
                <span className="fw-bold">{t("features.home.radio.start")}</span>
                <span className="fs-6">
                    {loading
                        ? t("common.loading")
                        : !loadError && !playable.length
                          ? t("features.home.radio.empty")
                          : t("features.home.radio.lead")}
                </span>
            </button>
            {loadError && <Feedback errors={[loadError]} />}
        </div>
    );
};
