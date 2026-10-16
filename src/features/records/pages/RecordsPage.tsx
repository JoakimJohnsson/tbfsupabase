import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecords } from "../hooks/useRecords";
import { SearchToolbar } from "../../../components/search/SearchToolbar";
import { SimpleSpinner } from "../../../components/spinners/SimpleSpinner";
import { Feedback } from "../../../components/feedback/Feedback";
import { EmptyStateCard } from "../../../components/cards/EmptyStateCard";
import type { RecordWithArtists } from "../../../types";
import { RecordCard } from "../components/RecordCard";

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
                        {filteredRecords.length === 1 ? t("features.records.record") : t("features.records.records")}
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
                        return (
                            <div className="col" key={record.id}>
                                <RecordCard record={record} showTrackCount />
                            </div>
                        );
                    })}
                </div>
            )}
        </main>
    );
};
