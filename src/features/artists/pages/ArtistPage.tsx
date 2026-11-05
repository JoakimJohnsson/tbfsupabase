import { Link, useLocation, useNavigate, useParams } from "react-router";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserGroup } from "@fortawesome/pro-solid-svg-icons";
import { Card } from "../../../components/cards/Card";
import { CardBody } from "../../../components/cards/CardBody";
import { Feedback } from "../../../components/feedback/Feedback";
import { SimpleSpinner } from "../../../components/spinners/SimpleSpinner";
import { SongList } from "../../songs/components/SongList";
import { useArtist } from "../hooks/useArtist";
import { useArtistRecords } from "../../records/hooks/useArtistRecords";
import { useArtistMembers } from "../hooks/useArtistMembers";
import { useArtistSongs } from "../../songs/hooks/useArtistSongs";
import { useAuth } from "../../auth/hooks/useAuth";
import { RecordBadges } from "../../records/components/RecordBadges";
import { ArtistMemberItem } from "../components/members/ArtistMemberItem";
import { Breadcrumbs } from "../../../components/navs/Breadcrumbs";

export const ArtistPage = () => {
    const { t } = useTranslation();
    const { artistSlug } = useParams();
    const { user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const loadErrorMessage = t("features.artist.error.loadError");
    const { artist, loadError, loading } = useArtist({
        artistSlug,
        loadErrorMessage,
    });

    // Breadcrumbs
    const breadcrumbItems = [
        { label: t("navigation.home"), to: "/" },
        { label: t("navigation.artists"), to: "/artists" },
        ...(artist ? [{ label: artist.name }] : []),
    ];

    // Public member list accessible to all visitors
    const {
        members,
        loading: membersLoading,
        loadError: membersError,
    } = useArtistMembers({
        artistId: artist?.id,
        loadErrorMessage: t("features.artist.membersLoadError"),
    });

    // Records and tracks are only fetched when the visitor is authenticated
    const { records, recordsLoadError, recordsLoading } = useArtistRecords({
        artistId: user ? artist?.id : undefined,
        recordsLoadErrorMessage: loadErrorMessage,
    });

    const {
        songs,
        loadError: songsLoadError,
        loading: songsLoading,
    } = useArtistSongs({
        artistId: user ? artist?.id : undefined,
        loadErrorMessage: t("features.artist.songsLoadError"),
    });

    if (loadError) {
        return <Feedback errors={[loadError]} />;
    }

    if (loading) {
        return <SimpleSpinner message={t("features.artist.message.loading")} />;
    }

    if (!artist) {
        return <Feedback warnings={[t("features.artist.message.empty")]} />;
    }

    const handlePromptLogin = () => {
        navigate("/login", { state: { from: location } });
    };

    return (
        <div className="row g-4">
            <Breadcrumbs items={breadcrumbItems} />
            {/* Left column: Artist biography and band members */}
            <section aria-labelledby="artist-heading" className="col-12 col-lg-4 col-xl-3">
                <Card className="mb-4">
                    {artist.image_path && <img alt={artist.name} className="card-img-top" src={artist.image_path} />}
                    <CardBody>
                        <h1 className="h3 card-title fw-bold mb-3" id="artist-heading">
                            {artist.name}
                        </h1>
                        {artist.description ? (
                            <p className="card-text text-secondary">{artist.description}</p>
                        ) : (
                            <p className="text-muted small fst-italic">{t("features.artist.message.noBiography")}</p>
                        )}
                    </CardBody>
                </Card>

                {/* Band members section */}
                <Card>
                    <CardBody>
                        <h2 className="h5 fw-bold mb-3 d-flex align-items-center gap-2">
                            <FontAwesomeIcon className="text-primary" icon={faUserGroup} />
                            <span>{t("features.artist.membersTitle")}</span>
                        </h2>

                        {membersError && <Feedback errors={[membersError]} />}

                        {membersLoading ? (
                            <SimpleSpinner />
                        ) : members.length === 0 ? (
                            <p className="text-muted small mb-0">{t("features.artist.noMembers")}</p>
                        ) : (
                            <ul className="list-group list-group-flush">
                                {members.map((member) => (
                                    <li className="list-group-item bg-transparent px-0 py-2" key={member.id}>
                                        <ArtistMemberItem member={member} />
                                    </li>
                                ))}
                            </ul>
                        )}
                    </CardBody>
                </Card>
            </section>

            {/* Right column: Artist songs and discography */}
            <div className="col-12 col-lg-8 col-xl-9">
                {!user ? (
                    // Prompt unauthenticated visitors to sign in before exploring releases
                    <Card background={"tertiary"} className="text-center" variant="outlined">
                        <CardBody padding="comfortable">
                            <h2 className="h5 fw-bold mb-2">{t("features.artist.loginPrompt.title")}</h2>
                            <p className="text-muted mb-4">{t("features.artist.loginPrompt.description")}</p>
                            <button className="btn btn-primary" onClick={handlePromptLogin} type="button">
                                {t("features.artist.loginPrompt.submit")}
                            </button>
                        </CardBody>
                    </Card>
                ) : (
                    // Authenticated members can view tracks and releases
                    <>
                        {/* Releases section */}
                        <section aria-labelledby="artist-records-heading" className={"mb-5"}>
                            <h2 className="h4 fw-bold mb-3" id="artist-records-heading">
                                {t("features.artist.recordsTitle")}
                            </h2>

                            {recordsLoadError && <Feedback errors={[recordsLoadError]} />}

                            {recordsLoading ? (
                                <SimpleSpinner />
                            ) : records.length === 0 ? (
                                <p className="text-muted">{t("features.artist.message.recordsEmpty")}</p>
                            ) : (
                                <div className="d-flex flex-column gap-3">
                                    {records.map((record) => (
                                        <div className="card shadow-sm border" key={record.id}>
                                            <CardBody>
                                                <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
                                                    <h3 className="h5 card-title fw-semibold mb-0">
                                                        <Link className="stretched-link" to={`/records/${record.id}`}>
                                                            {record.name}
                                                        </Link>
                                                        {record.year && (
                                                            <span className="text-muted fs-6 fw-normal ms-2">
                                                                ({record.year})
                                                            </span>
                                                        )}
                                                    </h3>

                                                    <RecordBadges format={record.format} type={record.type} />
                                                </div>

                                                {record.description && (
                                                    <p className="card-text text-muted small mb-0">
                                                        {record.description}
                                                    </p>
                                                )}
                                            </CardBody>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>

                        {/* Tracks section */}
                        <section aria-labelledby="artist-songs-heading" className="mb-5">
                            <h2 className="h4 fw-bold mb-3" id="artist-songs-heading">
                                {t("features.artist.songsTitle")}
                            </h2>

                            {songsLoadError && <Feedback errors={[songsLoadError]} />}

                            {songsLoading ? (
                                <SimpleSpinner />
                            ) : (
                                <SongList
                                    showCover
                                    showRecordInfo
                                    songs={songs}
                                    emptyMessage={t("features.artist.songsEmpty")}
                                />
                            )}
                        </section>
                    </>
                )}
            </div>
        </div>
    );
};
