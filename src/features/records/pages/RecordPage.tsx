import { useState } from "react";
import { useParams } from "react-router";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCompactDisc, faMusic, faPlay, faStop } from "@fortawesome/pro-solid-svg-icons";
import { Card } from "../../../components/cards/Card";
import { CardBody } from "../../../components/cards/CardBody";
import { Feedback } from "../../../components/feedback/Feedback";
import { SimpleSpinner } from "../../../components/spinners/SimpleSpinner";
import { Breadcrumbs } from "../../../components/navs/Breadcrumbs";
import { ListRowItem } from "../../../components/lists/ListRowItem";
import { ToolButton } from "../../../components/buttons/ToolButton";
import { useRecord } from "../hooks/useRecord";
import { RecordBadges } from "../components/RecordBadges";

export const RecordPage = () => {
    const { t } = useTranslation();
    const { recordId } = useParams();
    const [activeSongUrl, setActiveSongUrl] = useState<string | null>(null);

    const loadErrorMessage = t("features.records.loadError");
    const { record, loadError, loading } = useRecord({
        recordId,
        loadErrorMessage,
    });

    // Breadcrumbs
    const breadcrumbItems = [
        { label: t("navigation.home"), to: "/" },
        { label: t("navigation.records"), to: "/records" },
        ...(record ? [{ label: record.name }] : []),
    ];

    const handleTogglePlay = (audioPath: string) => {
        if (activeSongUrl === audioPath) {
            setActiveSongUrl(null);
        } else {
            setActiveSongUrl(audioPath);
        }
    };

    if (loadError) {
        return <Feedback errors={[loadError]} />;
    }

    if (loading) {
        return <SimpleSpinner message={t("common.loading")} />;
    }

    if (!record) {
        return <Feedback warnings={[t("features.records.empty")]} />;
    }

    const artistNames = record.record_artists
        .map((ra) => ra.artists?.name)
        .filter(Boolean)
        .join(", ");

    return (
        <div className="row g-4">
            <Breadcrumbs items={breadcrumbItems} />

            {/* Left column: Cover image and record metadata */}
            <aside className="col-12 col-lg-4 col-xl-3">
                <Card className="mb-4">
                    {record.cover_path ? (
                        <img alt={record.name} className="card-img-top" src={record.cover_path} />
                    ) : (
                        <div className="text-center py-5 bg-body-tertiary text-secondary">
                            <FontAwesomeIcon icon={faCompactDisc} size="4x" />
                        </div>
                    )}
                    <CardBody>
                        <h1 className="h3 card-title fw-bold mb-2">{record.name}</h1>
                        <p className="text-secondary small mb-3">
                            {artistNames} {record.year && <span>({record.year})</span>}
                        </p>
                        <RecordBadges format={record.format} type={record.type} />
                    </CardBody>
                </Card>
            </aside>

            {/* Right column: Description and track list */}
            <div className="col-12 col-lg-8 col-xl-9">
                {record.description && (
                    <Card className="mb-4">
                        <CardBody>
                            <h2 className="h5 fw-bold mb-2">{t("forms.description")}</h2>
                            <p className="card-text text-secondary mb-0">{record.description}</p>
                        </CardBody>
                    </Card>
                )}

                {/* Active audio player */}
                {activeSongUrl && (
                    <div className="card bg-body-secondary shadow-sm mb-4 border">
                        <div className="card-body p-3 d-flex align-items-center gap-3">
                            <FontAwesomeIcon className="text-primary fs-4 flex-shrink-0" icon={faMusic} />
                            <audio
                                autoPlay
                                className="w-100"
                                controls
                                key={activeSongUrl}
                                onEnded={() => setActiveSongUrl(null)}
                                src={activeSongUrl}
                            />
                        </div>
                    </div>
                )}

                {/* Songs section */}
                <section aria-labelledby="record-songs-heading">
                    <h2 className="h4 fw-bold mb-3" id="record-songs-heading">
                        {t("features.songs.title")}
                    </h2>

                    {!record.songs || record.songs.length === 0 ? (
                        <p className="text-muted">{t("features.songs.empty")}</p>
                    ) : (
                        <ul className="list-group shadow-sm mb-4">
                            {record.songs.map((song) => {
                                const hasAudio = Boolean(song.audio_path?.trim());
                                const isPlaying = activeSongUrl === song.audio_path;

                                return (
                                    <ListRowItem
                                        actions={
                                            hasAudio ? (
                                                <ToolButton
                                                    ariaLabel={isPlaying ? `Stop ${song.name}` : `Play ${song.name}`}
                                                    icon={isPlaying ? faStop : faPlay}
                                                    onClick={() => handleTogglePlay(song.audio_path)}
                                                    size="sm"
                                                    text={isPlaying ? t("common.stop") : t("common.play")}
                                                    variant={isPlaying ? "primary" : "outline-primary"}
                                                />
                                            ) : undefined
                                        }
                                        className={`py-2${isPlaying ? " bg-primary-subtle" : ""}`}
                                        key={song.id}
                                    >
                                        <div className="d-flex align-items-center gap-3 min-w-0">
                                            {song.track_number && (
                                                <span className="text-secondary small fw-semibold">
                                                    {song.track_number}.
                                                </span>
                                            )}
                                            <div className="min-w-0">
                                                <div
                                                    className={`fw-semibold text-truncate ${hasAudio ? "text-success" : ""}`}
                                                >
                                                    {song.name}
                                                </div>
                                            </div>
                                        </div>
                                    </ListRowItem>
                                );
                            })}
                        </ul>
                    )}
                </section>
            </div>
        </div>
    );
};
