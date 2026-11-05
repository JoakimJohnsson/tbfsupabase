import { useParams } from "react-router";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCompactDisc } from "@fortawesome/pro-solid-svg-icons";
import { Card } from "../../../components/cards/Card";
import { CardBody } from "../../../components/cards/CardBody";
import { Feedback } from "../../../components/feedback/Feedback";
import { SimpleSpinner } from "../../../components/spinners/SimpleSpinner";
import { Breadcrumbs } from "../../../components/navs/Breadcrumbs";
import { useRecord } from "../hooks/useRecord";
import { RecordBadges } from "../components/RecordBadges";
import { SongList } from "../../songs/components/SongList";

export const RecordPage = () => {
    const { t } = useTranslation();
    const { recordId } = useParams();

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

    // Ensure that the songs are sent with the record reference if needed
    const songsWithRecord = (record.songs ?? []).map((song) => ({
        ...song,
        records: {
            id: record.id,
            name: record.name,
            year: record.year,
            cover_path: record.cover_path,
        },
    }));

    return (
        <>
            <div className="row g-4">
                <Breadcrumbs items={breadcrumbItems} />

                {/* Left column: Cover and record metadata */}
                <section aria-labelledby={"record-heading"} className="col-12 col-lg-4 col-xl-3">
                    <Card className="mb-4">
                        {record.cover_path ? (
                            <img alt={record.name} className="card-img-top" src={record.cover_path} />
                        ) : (
                            <div className="text-center py-5 bg-body-tertiary text-secondary">
                                <FontAwesomeIcon icon={faCompactDisc} size="4x" />
                            </div>
                        )}
                        <CardBody>
                            <h1 className="h3 card-title fw-bold mb-2" id="record-heading">
                                {record.name}
                            </h1>
                            <p className="text-secondary small mb-3">
                                {artistNames} {record.year && <span>({record.year})</span>}
                            </p>
                            <RecordBadges format={record.format} type={record.type} />
                        </CardBody>
                    </Card>
                </section>

                {/* Right column: Description and song list */}
                <div className="col-12 col-lg-8 col-xl-9">
                    {record.description && (
                        <Card className="mb-4">
                            <CardBody>
                                <h2 className="h5 fw-bold mb-2">{t("forms.description")}</h2>
                                <p className="card-text text-secondary mb-0">{record.description}</p>
                            </CardBody>
                        </Card>
                    )}

                    <section aria-labelledby="record-songs-heading">
                        <h2 className="h4 fw-bold mb-3" id="record-songs-heading">
                            {t("features.songs.title")}
                        </h2>

                        <SongList
                            emptyMessage={t("features.songs.empty")}
                            showCover={false}
                            showRecordInfo={false}
                            songs={songsWithRecord}
                        />
                    </section>
                </div>
            </div>
        </>
    );
};
