import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCompactDisc, faFileAudio } from "@fortawesome/pro-solid-svg-icons";
import { useRecords } from "../hooks/useRecords";
import { SearchToolbar } from "../../../components/search/SearchToolbar";
import { SimpleSpinner } from "../../../components/spinners/SimpleSpinner";
import { Feedback } from "../../../components/feedback/Feedback";
import { EmptyStateCard } from "../../../components/cards/EmptyStateCard";
import { Card } from "../../../components/cards/Card";
import { CardBody } from "../../../components/cards/CardBody";
import { RecordBadges } from "../components/RecordBadges";
import type { RecordWithArtists } from "../../../types";

export const RecordsPage = () => {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState("");

    const { records, loading, loadError } = useRecords({
        loadErrorMessage: t("features.records.loadError"),
    });

    const filteredRecords = useMemo(() => {
        const query = searchTerm.trim().toLowerCase();
        if (!query) return records;

        return records.filter((rec) => {
            const matchesName = rec.name.toLowerCase().includes(query);
            const matchesArtist = rec.record_artists.some((ra) => ra.artists?.name.toLowerCase().includes(query));
            const matchesYear = rec.year ? String(rec.year).includes(query) : false;

            return matchesName || matchesArtist || matchesYear;
        });
    }, [records, searchTerm]);

    if (loading) {
        return <SimpleSpinner message={t("common.loading")} />;
    }

    if (loadError) {
        return <Feedback errors={[loadError]} />;
    }

    return (
        <main className="container-fluid" id="main-content">
            <h1 className="h2 fw-bold mb-4">{t("features.records.title")}</h1>

            <SearchToolbar
                countText={
                    <>
                        {filteredRecords.length}{" "}
                        {filteredRecords.length === 1
                            ? t("features.admin.record.title")
                            : t("features.admin.records.title")}
                    </>
                }
                onSearchChange={setSearchTerm}
                searchPlaceholder={t("features.records.searchPlaceholder")}
                searchValue={searchTerm}
                showSearch={records.length > 0}
                title={t("features.records.listTitle")}
            />

            {filteredRecords.length === 0 ? (
                <EmptyStateCard message={t("features.records.empty")} />
            ) : (
                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4 mb-4">
                    {filteredRecords.map((record: RecordWithArtists) => {
                        const artistNames = record.record_artists
                            .map((ra) => ra.artists?.name)
                            .filter(Boolean)
                            .join(", ");

                        const totalSongs = record.songs?.length ?? 0;
                        const songsWithAudio = record.songs?.filter((s) => Boolean(s.audio_path?.trim())).length ?? 0;

                        return (
                            <div className="col" key={record.id}>
                                <Card className="h-100 shadow-sm border-0 d-flex flex-column">
                                    <div
                                        className="ratio ratio-1x1 bg-body-tertiary d-flex align-items-center justify-content-center overflow-hidden"
                                        style={{
                                            borderTopLeftRadius: "var(--bs-card-inner-border-radius)",
                                            borderTopRightRadius: "var(--bs-card-inner-border-radius)",
                                        }}
                                    >
                                        {record.cover_path ? (
                                            <img
                                                alt={record.name}
                                                className="w-100 h-100 object-fit-cover"
                                                src={record.cover_path}
                                            />
                                        ) : (
                                            <div className="d-flex align-items-center justify-content-center h-100 text-secondary">
                                                <FontAwesomeIcon icon={faCompactDisc} size="3x" />
                                            </div>
                                        )}
                                    </div>

                                    <CardBody className="d-flex flex-column flex-grow-1">
                                        <h2 className="h6 fw-bold mb-1 text-truncate" title={record.name}>
                                            {record.name}
                                        </h2>

                                        <p className="small text-secondary mb-2 text-truncate" title={artistNames}>
                                            {artistNames || t("features.admin.records.message.noArtists")}
                                            {record.year && <span> ({record.year})</span>}
                                        </p>

                                        <div className="mt-auto pt-2 d-flex justify-content-between align-items-center flex-wrap gap-1">
                                            <RecordBadges format={record.format} type={record.type} />
                                            {totalSongs > 0 && (
                                                <span
                                                    className="badge text-bg-light border small d-inline-flex align-items-center gap-1"
                                                    title={`${songsWithAudio} of ${totalSongs} tracks have audio`}
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faFileAudio}
                                                        className={songsWithAudio > 0 ? "text-success" : "text-muted"}
                                                    />
                                                    {totalSongs}
                                                </span>
                                            )}
                                        </div>
                                    </CardBody>
                                </Card>
                            </div>
                        );
                    })}
                </div>
            )}
        </main>
    );
};
