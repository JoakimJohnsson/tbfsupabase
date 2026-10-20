import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCompactDisc, faMusic, faPlay, faStop, faUserGroup } from "@fortawesome/pro-solid-svg-icons";
import { Card } from "../../../components/cards/Card";
import { CardBody } from "../../../components/cards/CardBody";
import { Feedback } from "../../../components/feedback/Feedback";
import { SimpleSpinner } from "../../../components/spinners/SimpleSpinner";
import { ListRowItem } from "../../../components/lists/ListRowItem";
import { ToolButton } from "../../../components/buttons/ToolButton";
import { useArtist } from "../hooks/useArtist";
import { useArtistRecords } from "../../records/hooks/useArtistRecords";
import { useArtistMembers } from "../hooks/useArtistMembers";
import { useArtistSongs } from "../../songs/hooks/useArtistSongs";
import { useAuth } from "../../auth/hooks/useAuth";
import { RecordBadges } from "../../records/components/RecordBadges";
import { ArtistMemberItem } from "../components/members/ArtistMemberItem";

export const ArtistPage = () => {
    const { t } = useTranslation();
    const { artistSlug } = useParams();
    const { user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [activeSongUrl, setActiveSongUrl] = useState<string | null>(null);

    const loadErrorMessage = t("features.artist.error.loadError");
    const { artist, loadError, loading } = useArtist({
        artistSlug,
        loadErrorMessage,
    });

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
            {/* Left column: Artist biography and band members */}
            <aside className="col-12 col-lg-4 col-xl-3">
                <Card className="mb-4">
                    {artist.image_path && <img alt={artist.name} className="card-img-top" src={artist.image_path} />}
                    <CardBody>
                        <h1 className="h3 card-title fw-bold mb-3">{artist.name}</h1>
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
            </aside>

            {/* Right column: Artist songs and discography */}
            <main className="col-12 col-lg-8 col-xl-9" id="main-content">
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
                        {/* Audio player when a song is playing */}
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
                                                        {record.name}
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
                            ) : songs.length === 0 ? (
                                <p className="text-muted">{t("features.artist.songsEmpty")}</p>
                            ) : (
                                <ul className="list-group shadow-sm">
                                    {songs.map((song) => {
                                        const hasAudio = Boolean(song.audio_path?.trim());
                                        const isPlaying = activeSongUrl === song.audio_path;

                                        return (
                                            <ListRowItem
                                                actions={
                                                    hasAudio ? (
                                                        <ToolButton
                                                            ariaLabel={
                                                                isPlaying
                                                                    ? `${t("common.stop")} ${song.name}`
                                                                    : `${t("common.play")} ${song.name}`
                                                            }
                                                            icon={isPlaying ? faStop : faPlay}
                                                            onClick={() => handleTogglePlay(song.audio_path)}
                                                            size="sm"
                                                            text={isPlaying ? t("common.stop") : t("common.play")}
                                                            variant={isPlaying ? "primary" : "outline-success"}
                                                        />
                                                    ) : undefined
                                                }
                                                className={`py-2${isPlaying ? " bg-primary-subtle" : ""}`}
                                                key={song.id}
                                            >
                                                <div className="d-flex align-items-center gap-3 min-w-0">
                                                    <div className="tbf-song-record-thumb">
                                                        {song.records?.cover_path ? (
                                                            <img
                                                                alt={song.records.name}
                                                                className="w-100 h-100 object-fit-cover"
                                                                src={song.records.cover_path}
                                                            />
                                                        ) : (
                                                            <FontAwesomeIcon
                                                                className="text-secondary"
                                                                icon={faCompactDisc}
                                                            />
                                                        )}
                                                    </div>

                                                    <div className="min-w-0">
                                                        <div
                                                            className={`fw-semibold text-truncate ${hasAudio ? "text-success" : ""}`}
                                                        >
                                                            {song.name}
                                                        </div>
                                                        {song.records && (
                                                            <div className="small text-secondary text-truncate">
                                                                <span>{song.records.name}</span>
                                                                {song.records.year && (
                                                                    <span> ({song.records.year})</span>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </ListRowItem>
                                        );
                                    })}
                                </ul>
                            )}
                        </section>
                    </>
                )}
            </main>
        </div>
    );
};
