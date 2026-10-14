import { useMemo } from "react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { faArrowRight, faCompactDisc, faFileAudio, faMusic, faUserGroup } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card } from "../../../components/cards/Card";
import { CardBody } from "../../../components/cards/CardBody";
import { SimpleSpinner } from "../../../components/spinners/SimpleSpinner";
import { Feedback } from "../../../components/feedback/Feedback";
import { useArtists } from "../../artists/hooks/useArtists";
import { useRecords } from "../../records/hooks/useRecords";

export const AdminPage = () => {
    const { t } = useTranslation();

    const {
        artists,
        loading: artistsLoading,
        loadError: artistsError,
    } = useArtists({
        loadErrorMessage: t("features.artists.error.loadError"),
    });

    const {
        records,
        loading: recordsLoading,
        loadError: recordsError,
    } = useRecords({
        loadErrorMessage: t("features.admin.records.error.loadError"),
    });

    const loading = artistsLoading || recordsLoading;
    const loadError = artistsError ?? recordsError;

    // Gather statistics for songs and audio files
    const audioStats = useMemo(() => {
        let totalSongs = 0;
        let withAudio = 0;

        for (const record of records) {
            if (record.songs) {
                totalSongs += record.songs.length;
                withAudio += record.songs.filter((song) => Boolean(song.audio_path?.trim())).length;
            }
        }

        const missingAudio = totalSongs - withAudio;
        const percentage = totalSongs > 0 ? Math.round((withAudio / totalSongs) * 100) : 0;

        return { totalSongs, withAudio, missingAudio, percentage };
    }, [records]);

    if (loading) {
        return <SimpleSpinner message={t("common.loading")} />;
    }

    if (loadError) {
        return <Feedback errors={[loadError]} />;
    }

    return (
        <div className="container-fluid">
            <header className="mb-4">
                <h1 className="h2 fw-bold">{t("features.admin.dashboard.title")}</h1>
                <p className="text-secondary mb-0">{t("features.admin.dashboard.lead")}</p>
            </header>

            {/* Statistics cards */}
            <div className="row g-4 mb-4">
                {/* Artists */}
                <div className="col-12 col-sm-6 col-xl-3">
                    <Card className="h-100">
                        <CardBody className="d-flex flex-column justify-content-between">
                            <div>
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <span className="text-secondary small fw-semibold text-uppercase">
                                        {t("features.admin.dashboard.stats.artists")}
                                    </span>
                                    <FontAwesomeIcon className="text-primary fs-5" icon={faUserGroup} />
                                </div>
                                <div className="display-6 fw-bold mb-1">{artists.length}</div>
                                <p className="text-secondary small mb-3">
                                    {t("features.admin.dashboard.stats.totalArtists", { count: artists.length })}
                                </p>
                            </div>
                            <Link
                                className="btn btn-outline-secondary btn-sm d-flex align-items-center justify-content-between mt-auto"
                                to="/admin/artists"
                            >
                                <span>{t("features.admin.dashboard.quickActions.manageArtists")}</span>
                                <FontAwesomeIcon icon={faArrowRight} />
                            </Link>
                        </CardBody>
                    </Card>
                </div>

                {/* Records */}
                <div className="col-12 col-sm-6 col-xl-3">
                    <Card className="h-100">
                        <CardBody className="d-flex flex-column justify-content-between">
                            <div>
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <span className="text-secondary small fw-semibold text-uppercase">
                                        {t("features.admin.dashboard.stats.records")}
                                    </span>
                                    <FontAwesomeIcon className="text-primary fs-5" icon={faCompactDisc} />
                                </div>
                                <div className="display-6 fw-bold mb-1">{records.length}</div>
                                <p className="text-secondary small mb-3">
                                    {t("features.admin.dashboard.stats.totalRecords", { count: records.length })}
                                </p>
                            </div>
                            <Link
                                className="btn btn-outline-secondary btn-sm d-flex align-items-center justify-content-between mt-auto"
                                to="/admin/records"
                            >
                                <span>{t("features.admin.dashboard.quickActions.manageRecords")}</span>
                                <FontAwesomeIcon icon={faArrowRight} />
                            </Link>
                        </CardBody>
                    </Card>
                </div>

                {/* Total songs */}
                <div className="col-12 col-sm-6 col-xl-3">
                    <Card className="h-100">
                        <CardBody className="d-flex flex-column justify-content-between">
                            <div>
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <span className="text-secondary small fw-semibold text-uppercase">
                                        {t("features.admin.dashboard.stats.songs")}
                                    </span>
                                    <FontAwesomeIcon className="text-primary fs-5" icon={faMusic} />
                                </div>
                                <div className="display-6 fw-bold mb-1">{audioStats.totalSongs}</div>
                                <p className="text-secondary small mb-3">
                                    {t("features.admin.dashboard.stats.audioProgress", {
                                        withAudio: audioStats.withAudio,
                                        total: audioStats.totalSongs,
                                    })}
                                </p>
                            </div>
                            <Link
                                className="btn btn-outline-secondary btn-sm d-flex align-items-center justify-content-between mt-auto"
                                to="/admin/records"
                            >
                                <span>{t("features.admin.dashboard.quickActions.manageRecords")}</span>
                                <FontAwesomeIcon icon={faArrowRight} />
                            </Link>
                        </CardBody>
                    </Card>
                </div>

                {/* Audio-status progress */}
                <div className="col-12 col-sm-6 col-xl-3">
                    <Card className="h-100">
                        <CardBody className="d-flex flex-column justify-content-between">
                            <div>
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <span className="text-secondary small fw-semibold text-uppercase">
                                        {t("features.admin.dashboard.stats.audioStatus")}
                                    </span>
                                    <FontAwesomeIcon className="text-primary fs-5" icon={faFileAudio} />
                                </div>
                                <div className="display-6 fw-bold mb-1">{audioStats.percentage}%</div>
                                <div className="progress mb-2" style={{ height: "6px" }}>
                                    <div
                                        aria-valuemax={100}
                                        aria-valuemin={0}
                                        aria-valuenow={audioStats.percentage}
                                        className="progress-bar bg-primary"
                                        role="progressbar"
                                        style={{ width: `${audioStats.percentage}%` }}
                                    />
                                </div>
                                <p className="text-secondary small mb-0">
                                    {audioStats.missingAudio === 0
                                        ? t("features.admin.dashboard.stats.allAudioComplete")
                                        : t("features.admin.dashboard.stats.missingAudio", {
                                              count: audioStats.missingAudio,
                                          })}
                                </p>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>

            {/* Links and shortcuts */}
            <div className="row g-4">
                <div className="col-12 col-lg-6">
                    <Card>
                        <CardBody>
                            <h2 className="h5 fw-bold mb-3">{t("features.admin.dashboard.quickActions.title")}</h2>
                            <div className="d-flex flex-column gap-2">
                                <Link
                                    className="btn btn-outline-secondary text-start d-flex justify-content-between align-items-center"
                                    to="/admin/artists"
                                >
                                    <span>{t("navigation.adminArtists")}</span>
                                    <FontAwesomeIcon icon={faArrowRight} />
                                </Link>
                                <Link
                                    className="btn btn-outline-secondary text-start d-flex justify-content-between align-items-center"
                                    to="/admin/records"
                                >
                                    <span>{t("navigation.adminRecords")}</span>
                                    <FontAwesomeIcon icon={faArrowRight} />
                                </Link>
                                <Link
                                    className="btn btn-outline-secondary text-start d-flex justify-content-between align-items-center"
                                    to="/artists"
                                >
                                    <span>{t("features.admin.dashboard.quickActions.viewPublicCatalogue")}</span>
                                    <FontAwesomeIcon icon={faArrowRight} />
                                </Link>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    );
};
