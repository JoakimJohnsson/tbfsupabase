import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Breadcrumbs } from "../../../components/navs/Breadcrumbs";
import { EmptyStateCard } from "../../../components/cards/EmptyStateCard";
import { Feedback } from "../../../components/feedback/Feedback";
import { SimpleSpinner } from "../../../components/spinners/SimpleSpinner";
import { isAbortError } from "../../../lib/asyncHelpers/withAbortSignal";
import type { SongWithRecordAndArtists } from "../../../types";
import { useAuth } from "../../auth/hooks/useAuth";
import { SongList } from "../../songs/components/SongList";
import { getFavorites } from "../api/getFavorites";
import { useFavorites } from "../hooks/useFavorites";

export const FavoritesPage = () => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const { favoriteSongIds } = useFavorites();
    const [songs, setSongs] = useState<SongWithRecordAndArtists[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(false);

    useEffect(() => {
        const controller = new AbortController();
        setLoading(true);
        setLoadError(false);

        if (!user) {
            setSongs([]);
            setLoading(false);
            return () => controller.abort();
        }

        void getFavorites(user.id, controller.signal)
            .then((favoriteSongs) => setSongs(favoriteSongs))
            .catch((error: unknown) => {
                if (!isAbortError(error)) {
                    console.error(error);
                    setLoadError(true);
                }
            })
            .finally(() => {
                if (!controller.signal.aborted) setLoading(false);
            });

        return () => controller.abort();
    }, [user]);

    const favoriteSongs = songs.filter((song) => favoriteSongIds.has(song.id));
    const breadcrumbItems = [{ label: t("navigation.home"), to: "/" }, { label: t("navigation.favorites") }];

    if (loading) return <SimpleSpinner message={t("common.loading")} />;
    if (loadError) return <Feedback errors={[t("features.favorites.loadError")]} />;

    return (
        <>
            <Breadcrumbs items={breadcrumbItems} />
            <h1 className="h2 fw-bold mb-2">{t("features.favorites.title")}</h1>
            <p className="text-secondary mb-4">{t("features.favorites.count", { count: favoriteSongs.length })}</p>
            {favoriteSongs.length === 0 ? (
                <EmptyStateCard message={t("features.favorites.empty")} />
            ) : (
                <SongList emptyMessage={t("features.favorites.empty")} showCover showRecordInfo songs={favoriteSongs} />
            )}
        </>
    );
};
