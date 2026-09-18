import { type SubmitEvent, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/pro-solid-svg-icons";
import Feedback from "../../../components/feedback/Feedback";
import SimpleSpinner from "../../../components/spinners/SimpleSpinner";
import { getArtists } from "../../artists/api/getArtists";
import { createRecord } from "../../records/api/createRecord";
import { deleteRecord } from "../../records/api/deleteRecord";
import { getRecords } from "../../records/api/getRecords";
import { updateRecord } from "../../records/api/updateRecord";
import { isAbortError } from "../../../lib/asyncHelpers/withAbortSignal";
import { RecordEdit } from "../../records/components/RecordEdit";
import { RecordToolRow } from "../../records/components/RecordToolRow";
import { RecordCreate } from "../../records/components/RecordCreate";
import type { Artist, RecordWithArtists, SimpleMessage } from "../../../types";

const sortRecordsList = (recordsList: RecordWithArtists[]): RecordWithArtists[] => {
    return [...recordsList].sort((a, b) => {
        if (a.year === null && b.year === null) return a.name.localeCompare(b.name);
        if (a.year === null) return 1;
        if (b.year === null) return -1;
        if (b.year !== a.year) return b.year - a.year;
        return a.name.localeCompare(b.name);
    });
};

export const AdminRecordsPage = () => {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const requestedEditRecordId = searchParams.get("edit");
    const handledEditRecordIdRef = useRef<string | null>(null);

    const [records, setRecords] = useState<RecordWithArtists[]>([]);
    const [artists, setArtists] = useState<Artist[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState<SimpleMessage>(null);
    const [searchTerm, setSearchTerm] = useState("");

    // Create form state
    const [name, setName] = useState("");
    const [year, setYear] = useState("");
    const [format, setFormat] = useState("");
    const [type, setType] = useState("");
    const [description, setDescription] = useState("");
    const [selectedArtistIds, setSelectedArtistIds] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<SimpleMessage>(null);
    const [submitSuccess, setSubmitSuccess] = useState<SimpleMessage>(null);

    // Edit form state
    const [editingRecordId, setEditingRecordId] = useState<string | null>(null);
    const [editName, setEditName] = useState("");
    const [editYear, setEditYear] = useState("");
    const [editFormat, setEditFormat] = useState("");
    const [editType, setEditType] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editArtistIds, setEditArtistIds] = useState<string[]>([]);
    const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);
    const [recordActionError, setRecordActionError] = useState<SimpleMessage>(null);
    const [recordActionSuccess, setRecordActionSuccess] = useState<SimpleMessage>(null);

    const [deletingRecordId, setDeletingRecordId] = useState<string | null>(null);
    const [openSongListRecordId, setOpenSongListRecordId] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        setLoadError(null);

        const controller = new AbortController();

        const loadData = async () => {
            try {
                const [recordsData, artistsData] = await Promise.all([
                    getRecords(controller.signal),
                    getArtists(controller.signal),
                ]);

                setRecords(recordsData);
                setArtists(artistsData);
            } catch (error) {
                if (!isAbortError(error)) {
                    console.error(error);
                    setLoadError(t("features.admin.records.error.loadError"));
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        void loadData();

        return () => {
            controller.abort();
        };
    }, [t]);

    const filteredRecords = useMemo(() => {
        const query = searchTerm.trim().toLowerCase();
        if (!query) return records;

        return records.filter((rec) => {
            const matchesRecordName = rec.name.toLowerCase().includes(query);
            const matchesArtist = rec.record_artists.some((ra) => ra.artists?.name.toLowerCase().includes(query));
            const matchesYear = rec.year ? String(rec.year).includes(query) : false;

            return matchesRecordName || matchesArtist || matchesYear;
        });
    }, [records, searchTerm]);

    const handleArtistCheckboxChange = (artistId: string) => {
        setSelectedArtistIds((current) =>
            current.includes(artistId) ? current.filter((id) => id !== artistId) : [...current, artistId],
        );
    };

    const handleEditArtistCheckboxChange = (artistId: string) => {
        setEditArtistIds((current) =>
            current.includes(artistId) ? current.filter((id) => id !== artistId) : [...current, artistId],
        );
    };

    const mapArtistRelations = (artistIds: string[]) => {
        return artistIds
            .map((id, index) => {
                const found = artists.find((a) => a.id === id);
                if (!found) return null;
                return {
                    artist_id: id,
                    is_primary: index === 0,
                    artists: {
                        id: found.id,
                        name: found.name,
                        slug: found.slug,
                    },
                };
            })
            .filter(Boolean) as RecordWithArtists["record_artists"];
    };

    const handleCreateRecord = async (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();

        setSubmitError(null);
        setSubmitSuccess(null);
        setIsSubmitting(true);

        try {
            const trimmedName = name.trim();

            if (!trimmedName) {
                setSubmitError(t("features.admin.record.create.error.invalidNameError"));
                return;
            }

            let parsedYear: number | undefined;
            const trimmedYear = year.trim();

            if (trimmedYear) {
                const numericYear = Number(trimmedYear);

                if (isNaN(numericYear) || !Number.isInteger(numericYear)) {
                    setSubmitError(t("features.admin.record.create.error.invalidYearError"));
                    return;
                }

                parsedYear = numericYear;
            }

            const created = await createRecord({
                artist_ids: selectedArtistIds,
                name: trimmedName,
                description: description.trim() || undefined,
                format: format.trim() || undefined,
                type: type.trim() || undefined,
                year: parsedYear,
            });

            const newRecordWithArtists: RecordWithArtists = {
                ...created,
                record_artists: mapArtistRelations(selectedArtistIds),
            };

            setRecords((current) => sortRecordsList([...current, newRecordWithArtists]));
            setName("");
            setYear("");
            setFormat("");
            setType("");
            setDescription("");
            setSelectedArtistIds([]);
            setSubmitSuccess(t("features.admin.record.create.success.createSuccess"));
        } catch (err) {
            console.error(err);
            setSubmitError(t("features.admin.record.create.error.createError"));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleStartEdit = (record: RecordWithArtists) => {
        setRecordActionError(null);
        setRecordActionSuccess(null);
        setEditingRecordId(record.id);
        setEditName(record.name);
        setEditYear(record.year !== null ? String(record.year) : "");
        setEditFormat(record.format ?? "");
        setEditType(record.type ?? "");
        setEditDescription(record.description ?? "");
        setEditArtistIds(record.record_artists.map((ra) => ra.artist_id));
    };

    const handleCancelEdit = () => {
        setEditingRecordId(null);
        setEditName("");
        setEditYear("");
        setEditFormat("");
        setEditType("");
        setEditDescription("");
        setEditArtistIds([]);
    };

    useEffect(() => {
        if (loading || !requestedEditRecordId) {
            return;
        }

        if (handledEditRecordIdRef.current === requestedEditRecordId) {
            return;
        }

        const recordToEdit = records.find((record) => record.id === requestedEditRecordId);

        if (!recordToEdit) {
            return;
        }

        handledEditRecordIdRef.current = requestedEditRecordId;
        handleStartEdit(recordToEdit);
    }, [loading, records, requestedEditRecordId]);

    const handleSaveEdit = async (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!editingRecordId) return;

        setRecordActionError(null);
        setRecordActionSuccess(null);
        setIsSubmittingEdit(true);

        try {
            const trimmedName = editName.trim();

            if (!trimmedName) {
                setRecordActionError(t("features.admin.record.edit.error.invalidNameError"));
                return;
            }

            let parsedYear: number | undefined;
            const trimmedYear = editYear.trim();

            if (trimmedYear) {
                const numericYear = Number(trimmedYear);

                if (isNaN(numericYear) || !Number.isInteger(numericYear)) {
                    setRecordActionError(t("features.admin.record.edit.error.invalidYearError"));
                    return;
                }

                parsedYear = numericYear;
            }

            const updated = await updateRecord({
                id: editingRecordId,
                artist_ids: editArtistIds,
                name: trimmedName,
                description: editDescription.trim() || undefined,
                format: editFormat.trim() || undefined,
                type: editType.trim() || undefined,
                year: parsedYear,
            });

            const updatedRecordWithArtists: RecordWithArtists = {
                ...updated,
                record_artists: mapArtistRelations(editArtistIds),
            };

            setRecords((current) =>
                sortRecordsList(current.map((rec) => (rec.id === updated.id ? updatedRecordWithArtists : rec))),
            );

            handleCancelEdit();
            setRecordActionSuccess(t("features.admin.record.edit.success.editSuccess"));
        } catch (err) {
            console.error(err);
            setRecordActionError(t("features.admin.record.edit.error.editError"));
        } finally {
            setIsSubmittingEdit(false);
        }
    };

    const handleDeleteRecord = async (record: RecordWithArtists) => {
        const recordName = record.name;
        const confirmed = window.confirm(
            t("features.admin.artist.deleteRecord.confirm", {
                name: recordName,
            }),
        );

        if (!confirmed) {
            return;
        }

        setRecordActionError(null);
        setRecordActionSuccess(null);
        setDeletingRecordId(record.id);

        try {
            await deleteRecord(record.id);
            setRecords((current) => current.filter((r) => r.id !== record.id));
            setRecordActionSuccess(
                t("features.admin.artist.deleteRecord.success.deleteSuccess", {
                    name: recordName,
                }),
            );
        } catch (err) {
            console.error(err);
            setRecordActionError(
                t("features.admin.artist.deleteRecord.error.deleteError", {
                    name: recordName,
                }),
            );
        } finally {
            setDeletingRecordId(null);
        }
    };

    if (loading) {
        return <SimpleSpinner message={t("features.admin.records.message.loading")} />;
    }

    if (loadError) {
        return <Feedback errors={[loadError]} />;
    }

    return (
        <div className="container-fluid">
            <div className="mb-4">
                <h1 className="h2 fw-bold">{t("features.admin.records.title")}</h1>
                <p className="text-secondary mb-0">{t("features.admin.records.lead")}</p>
            </div>

            <Feedback errors={[submitError, recordActionError]} successes={[submitSuccess, recordActionSuccess]} />

            <div className="row g-4">
                {/* Left column: Create Record Card */}
                <aside className="col-12 col-lg-5 col-xl-4">
                    <div className="sticky-top" style={{ top: "1rem" }}>
                        <RecordCreate
                            artists={artists}
                            description={description}
                            format={format}
                            handleArtistCheckboxChange={handleArtistCheckboxChange}
                            handleCreateRecord={handleCreateRecord}
                            isSubmitting={isSubmitting}
                            name={name}
                            selectedArtistIds={selectedArtistIds}
                            setDescription={setDescription}
                            setFormat={setFormat}
                            setName={setName}
                            setType={setType}
                            setYear={setYear}
                            type={type}
                            year={year}
                        />
                    </div>
                </aside>

                {/* Right column: Search & Record List */}
                <main className="col-12 col-lg-7 col-xl-8">
                    <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                        <h2 className="h4 fw-bold mb-0">{t("features.admin.records.list.title")}</h2>

                        <span className="text-secondary small">
                            {filteredRecords.length}{" "}
                            {filteredRecords.length === 1
                                ? t("features.admin.record.title")
                                : t("features.admin.records.title")}
                        </span>

                        {records.length > 5 && (
                            <div className="input-group input-group-sm w-auto">
                                <span className="input-group-text bg-body border-end-0">
                                    <FontAwesomeIcon className="text-muted" icon={faSearch} />
                                </span>
                                <input
                                    className="form-control border-start-0"
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder={t("features.admin.records.search")}
                                    type="search"
                                    value={searchTerm}
                                />
                            </div>
                        )}
                    </div>

                    {filteredRecords.length === 0 ? (
                        <div className="card border-0 bg-body-tertiary p-4 text-center text-muted">
                            {t("features.admin.records.message.empty")}
                        </div>
                    ) : (
                        <ul className="list-group shadow-sm mb-4">
                            {filteredRecords.map((record) => {
                                const isEditing = editingRecordId === record.id;
                                const artistNames = record.record_artists
                                    .map((ra) => ra.artists?.name)
                                    .filter(Boolean)
                                    .join(", ");

                                if (isEditing) {
                                    return (
                                        <RecordEdit
                                            artists={artists}
                                            editArtistIds={editArtistIds}
                                            editDescription={editDescription}
                                            editFormat={editFormat}
                                            editName={editName}
                                            editType={editType}
                                            editYear={editYear}
                                            handleCancelEdit={handleCancelEdit}
                                            handleEditArtistCheckboxChange={handleEditArtistCheckboxChange}
                                            handleSaveEdit={handleSaveEdit}
                                            isSubmittingEdit={isSubmittingEdit}
                                            key={record.id}
                                            record={record}
                                            setEditDescription={setEditDescription}
                                            setEditFormat={setEditFormat}
                                            setEditName={setEditName}
                                            setEditType={setEditType}
                                            setEditYear={setEditYear}
                                        />
                                    );
                                }

                                return (
                                    <RecordToolRow
                                        artists={artists}
                                        artistNames={artistNames}
                                        deletingRecordId={deletingRecordId}
                                        handleDeleteRecord={handleDeleteRecord}
                                        handleStartEdit={handleStartEdit}
                                        key={record.id}
                                        openSongListRecordId={openSongListRecordId}
                                        record={record}
                                        setOpenSongListRecordId={setOpenSongListRecordId}
                                    />
                                );
                            })}
                        </ul>
                    )}
                </main>
            </div>
        </div>
    );
};
