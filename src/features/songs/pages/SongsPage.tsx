import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSongs } from "../hooks/useSongs";
import { SearchToolbar } from "../../../components/search/SearchToolbar";
import { SimpleSpinner } from "../../../components/spinners/SimpleSpinner";
import { Feedback } from "../../../components/feedback/Feedback";
import { SongList } from "../components/SongList";
import { CatalogueSortSelect } from "../../../components/search/CatalogueSortSelect";
import { sortCatalogue, type CatalogueSort } from "../../../lib/helpers/sortHelpers";

export const SongsPage = () => {
    const { t, i18n } = useTranslation();
    const [searchTerm, setSearchTerm] = useState("");
    const [sort, setSort] = useState<CatalogueSort>("title");

    const { songs, loading, loadError } = useSongs({
        loadErrorMessage: t("features.songs.loadError"),
    });

    const filteredSongs = useMemo(() => {
        const query = searchTerm.trim().toLowerCase();
        const matches = songs.filter((s) => {
            if (!query) return true;
            const matchesName = s.name.toLowerCase().includes(query);
            const matchesRecord = s.records?.name.toLowerCase().includes(query) ?? false;
            const matchesArtist = s.song_artists.some((sa) => sa.artists?.name.toLowerCase().includes(query));

            return matchesName || matchesRecord || matchesArtist;
        });
        return sortCatalogue(matches, sort, (song) => song.records?.year, i18n.language);
    }, [songs, searchTerm, sort, i18n.language]);

    if (loading) {
        return <SimpleSpinner message={t("common.loading")} />;
    }

    if (loadError) {
        return <Feedback errors={[loadError]} />;
    }

    return (
        <>
            <h1>{t("features.songs.title")}</h1>

            <SearchToolbar
                countText={
                    <>
                        {filteredSongs.length}{" "}
                        {filteredSongs.length === 1 ? t("features.songs.song") : t("features.songs.songs")}
                    </>
                }
                onSearchChange={setSearchTerm}
                searchPlaceholder={t("features.songs.searchPlaceholder")}
                searchValue={searchTerm}
                showSearch={songs.length > 0}
                title={t("features.songs.listTitle")}
            />

            {songs.length > 0 && (
                <div className="row">
                    <div className="col-12 col-md-6 col-lg-3">
                        <CatalogueSortSelect id="songs-sort" onChange={setSort} value={sort} />
                    </div>
                </div>
            )}

            <SongList emptyMessage={t("features.songs.empty")} showCover showRecordInfo songs={filteredSongs} />
        </>
    );
};
