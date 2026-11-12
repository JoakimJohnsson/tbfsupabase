import { useMemo } from "react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faCompactDisc, faUserGroup } from "@fortawesome/pro-solid-svg-icons";
import { useArtists } from "../../artists/hooks/useArtists";
import { useRecords } from "../../records/hooks/useRecords";
import { SimpleSpinner } from "../../../components/spinners/SimpleSpinner";
import { Feedback } from "../../../components/feedback/Feedback";
import { Card } from "../../../components/cards/Card";
import { CardBody } from "../../../components/cards/CardBody";
import { ArtistListItem } from "../../artists/components/ArtistListItem";
import { RecordCard } from "../../records/components/RecordCard";
import type { RecordWithArtists } from "../../../types";
import { useAuth } from "../../auth/hooks/useAuth";
import { shuffle } from "../../../lib/helpers/sortHelpers";
import { RadioButton } from "../components/RadioButton";

// Maximum number of preview items to showcase on the landing page
const PREVIEW_RECORDS_COUNT = 4;
const RANDOM_RECORDS_COUNT = 4;
const PREVIEW_ARTISTS_COUNT = 6;
const RANDOM_ARTISTS_COUNT = 6;

export const HomePage = () => {
    const { t } = useTranslation();
    const { user } = useAuth();

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
        loadErrorMessage: t("features.records.loadError"),
    });

    const loading = artistsLoading || recordsLoading;
    const loadError = artistsError ?? recordsError;

    // Pick top preview records (already sorted by year descending from API)
    const previewRecords = useMemo(() => records.slice(0, PREVIEW_RECORDS_COUNT), [records]);
    // Pick random records from the remaining ones
    const randomRecords = useMemo(() => {
        const previewIds = new Set(previewRecords.map((record) => record.id));
        const remaining = records.filter((record) => !previewIds.has(record.id));

        for (let i = remaining.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [remaining[i], remaining[j]] = [remaining[j], remaining[i]];
        }

        return remaining.slice(0, RANDOM_RECORDS_COUNT);
    }, [records, previewRecords]);

    // Pick top preview artists
    const previewArtists = useMemo(() => artists.slice(0, PREVIEW_ARTISTS_COUNT), [artists]);
    // Pick random artists from the remaining ones
    const randomArtists = useMemo(() => {
        const previewIds = new Set(previewArtists.map((artist) => artist.id));
        const remaining = artists.filter((artist) => !previewIds.has(artist.id));

        for (let i = remaining.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [remaining[i], remaining[j]] = [remaining[j], remaining[i]];
        }

        return remaining.slice(0, RANDOM_ARTISTS_COUNT);
    }, [artists, previewArtists]);

    const mixedRecords = useMemo(() => shuffle([...previewRecords, ...randomRecords]), [previewRecords, randomRecords]);

    const mixedArtists = useMemo(() => shuffle([...previewArtists, ...randomArtists]), [previewArtists, randomArtists]);

    if (loading) {
        return <SimpleSpinner message={t("common.loading")} />;
    }

    if (loadError) {
        return <Feedback errors={[loadError]} />;
    }

    return (
        <>
            {/* Hero banner */}
            <div className="row mb-5">
                <div className="col-12">
                    <h1 className="display-5 fw-bold mb-3">{t("features.home.hero.title")}</h1>
                    <p className="lead text-secondary mb-4">{t("features.home.hero.lead")}</p>
                    <div className="d-flex flex-wrap gap-3 mb-4">
                        <Link className="btn btn-primary btn-lg px-4" to="/artists">
                            <FontAwesomeIcon className="me-2" icon={faUserGroup} />
                            {t("features.home.hero.exploreArtists")}
                        </Link>

                        {user && (
                            <Link className="btn btn-outline-secondary btn-lg px-4" to="/records">
                                <FontAwesomeIcon className="me-2" icon={faCompactDisc} />
                                {t("features.home.hero.exploreRecords")}
                            </Link>
                        )}
                    </div>
                </div>

                {/* Quick stats counter */}
                <div className="col-12 col-sm-6 col-md-3 mb-3">
                    <Card>
                        <CardBody className="text-center py-3">
                            <div className="display-6 fw-bold text-primary mb-1">{artists.length}</div>
                            <div className="text-secondary small fw-semibold text-uppercase">
                                {t("features.home.stats.artistsCount")}
                            </div>
                        </CardBody>
                    </Card>
                </div>
                <div className="col-12 col-sm-6 col-md-3 mb-3">
                    <Card>
                        <CardBody className="text-center py-3">
                            <div className="display-6 fw-bold text-primary mb-1">{records.length}</div>
                            <div className="text-secondary small fw-semibold text-uppercase">
                                {t("features.home.stats.recordsCount")}
                            </div>
                        </CardBody>
                    </Card>
                </div>
                {user && <RadioButton />}
            </div>

            {/* Featured releases showcase */}
            <section aria-labelledby="home-records-heading" className="mb-5">
                <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                    <div>
                        <h2 className="h4 fw-bold mb-0" id="home-records-heading">
                            {t("features.home.sections.recentReleasesTitle")}
                        </h2>
                        <span className="text-secondary small">{t("features.home.sections.recentReleasesLead")}</span>
                    </div>
                    <Link
                        className="btn btn-outline-secondary btn-sm d-inline-flex align-items-center gap-2"
                        to="/records"
                    >
                        <span>{t("features.home.sections.viewAllRecords")}</span>
                        <FontAwesomeIcon icon={faArrowRight} />
                    </Link>
                </div>

                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
                    {mixedRecords.map((record: RecordWithArtists) => (
                        <div className="col" key={record.id}>
                            <RecordCard record={record} to={user ? `/records/${record.id}` : undefined} />
                        </div>
                    ))}
                </div>
            </section>

            {/* Featured artists showcase */}
            <section aria-labelledby="home-artists-heading" className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                    <div>
                        <h2 className="h4 fw-bold mb-0" id="home-artists-heading">
                            {t("features.home.sections.featuredArtistsTitle")}
                        </h2>
                        <span className="text-secondary small">{t("features.home.sections.featuredArtistsLead")}</span>
                    </div>
                    <Link
                        className="btn btn-outline-secondary btn-sm d-inline-flex align-items-center gap-2"
                        to="/artists"
                    >
                        <span>{t("features.home.sections.viewAllArtists")}</span>
                        <FontAwesomeIcon icon={faArrowRight} />
                    </Link>
                </div>

                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
                    {mixedArtists.map((artist) => (
                        <div className="col" key={artist.id}>
                            <Card className="h-100 p-2">
                                <CardBody className="p-2">
                                    <ArtistListItem artist={artist} to={`/artists/${artist.slug}`} variant="row" />
                                </CardBody>
                            </Card>
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
};
