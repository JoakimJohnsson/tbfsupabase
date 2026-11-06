import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecords } from "../hooks/useRecords";
import { SearchToolbar } from "../../../components/search/SearchToolbar";
import { SimpleSpinner } from "../../../components/spinners/SimpleSpinner";
import { Feedback } from "../../../components/feedback/Feedback";
import { EmptyStateCard } from "../../../components/cards/EmptyStateCard";
import { RecordCard } from "../components/RecordCard";
import type { RecordWithArtists } from "../../../types";
import { RECORD_FORMATS, RECORD_TYPES, type RecordFormat, type RecordType } from "../constants";
import { CatalogueSortSelect } from "../../../components/search/CatalogueSortSelect";
import { sortCatalogue, type CatalogueSort } from "../../../lib/helpers/sortHelpers";

export const RecordsPage = () => {
    const { t, i18n } = useTranslation();
    const [searchTerm, setSearchTerm] = useState("");
    const [format, setFormat] = useState<RecordFormat | null>(null);
    const [recordType, setRecordType] = useState<RecordType | null>(null);
    const [sort, setSort] = useState<CatalogueSort>("year-desc");

    const { records, loading, loadError } = useRecords({
        loadErrorMessage: t("features.records.loadError"),
    });

    const filteredRecords = useMemo(() => {
        const query = searchTerm.trim().toLowerCase();
        const matches = records.filter((rec) => {
            if (format && rec.format !== format) return false;
            if (recordType && rec.type !== recordType) return false;
            if (!query) return true;
            const matchesName = rec.name.toLowerCase().includes(query);
            const matchesArtist = rec.record_artists.some((ra) => ra.artists?.name.toLowerCase().includes(query));
            const matchesYear = rec.year ? String(rec.year).includes(query) : false;

            return matchesName || matchesArtist || matchesYear;
        });
        return sortCatalogue(matches, sort, (record) => record.year, i18n.language);
    }, [records, searchTerm, format, recordType, sort, i18n.language]);

    if (loading) {
        return <SimpleSpinner message={t("common.loading")} />;
    }

    if (loadError) {
        return <Feedback errors={[loadError]} />;
    }

    return (
        <>
            <h1>{t("features.records.title")}</h1>

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

            {records.length > 0 && (
                <div className="row g-3 mb-3">
                    <div className="col-12 col-lg-9">
                        <fieldset className="mb-3">
                            <legend className="fs-6">{t("forms.format")}</legend>
                            <div className="d-flex flex-wrap gap-2">
                                <button
                                    aria-pressed={format === null}
                                    className={`btn btn-sm rounded-pill btn-${format === null ? "primary" : "outline-secondary"}`}
                                    onClick={() => setFormat(null)}
                                    type="button"
                                >
                                    {t("catalogue.allFormats")}
                                </button>
                                {RECORD_FORMATS.map((value) => (
                                    <button
                                        aria-pressed={format === value}
                                        className={`btn btn-sm rounded-pill btn-${format === value ? "primary" : "outline-secondary"}`}
                                        key={value}
                                        onClick={() => setFormat(format === value ? null : value)}
                                        type="button"
                                    >
                                        {t(`forms.formats.${value}`)}
                                    </button>
                                ))}
                            </div>
                        </fieldset>
                        <fieldset>
                            <legend className="fs-6">{t("forms.type")}</legend>
                            <div className="d-flex flex-wrap gap-2">
                                <button
                                    aria-pressed={recordType === null}
                                    className={`btn btn-sm rounded-pill btn-${recordType === null ? "primary" : "outline-secondary"}`}
                                    onClick={() => setRecordType(null)}
                                    type="button"
                                >
                                    {t("catalogue.allTypes")}
                                </button>
                                {RECORD_TYPES.map((value) => (
                                    <button
                                        aria-pressed={recordType === value}
                                        className={`btn btn-sm rounded-pill btn-${recordType === value ? "primary" : "outline-secondary"}`}
                                        key={value}
                                        onClick={() => setRecordType(recordType === value ? null : value)}
                                        type="button"
                                    >
                                        {t(`forms.types.${value}`)}
                                    </button>
                                ))}
                            </div>
                        </fieldset>
                    </div>
                    <div className="col-12 col-lg-3">
                        <CatalogueSortSelect id="records-sort" onChange={setSort} value={sort} />
                    </div>
                </div>
            )}

            {filteredRecords.length === 0 ? (
                <EmptyStateCard message={t("features.records.empty")} />
            ) : (
                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4 mb-4">
                    {filteredRecords.map((record: RecordWithArtists) => (
                        <div className="col" key={record.id}>
                            <RecordCard record={record} showTrackCount to={`/records/${record.id}`} />
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};
