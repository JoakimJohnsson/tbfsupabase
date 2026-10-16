import { Fragment, type SubmitEvent, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import { useTranslation } from "react-i18next";
import { Feedback } from "../../../components/feedback/Feedback";
import { ConfirmModal } from "../../../components/feedback/ConfirmModal";
import { AdminPageLayout } from "../../../components/layout/AdminPageLayout";
import { EmptyStateCard } from "../../../components/cards/EmptyStateCard";
import { SearchToolbar } from "../../../components/search/SearchToolbar";
import { SimpleSpinner } from "../../../components/spinners/SimpleSpinner";
import { useArtists } from "../../artists/hooks/useArtists";
import { createRecord } from "../../records/api/createRecord";
import { deleteRecord } from "../../records/api/deleteRecord";
import { useRecords } from "../../records/hooks/useRecords";
import { updateRecord } from "../../records/api/updateRecord";
import { RecordCreate } from "../../records/components/RecordCreate";
import { RecordEdit } from "../../records/components/RecordEdit";
import { RecordToolRow } from "../../records/components/RecordToolRow";
import type { RecordWithArtists, SimpleMessage } from "../../../types";
import { deleteImageFromStorage, uploadImage } from "../../../lib/supabase/storage";

const sortRecordsList = (recordsList: RecordWithArtists[]): RecordWithArtists[] => {
    return [...recordsList].sort((a, b) => {
        const aArtistName =
            a.record_artists.find((ra) => ra.is_primary)?.artists?.name ?? a.record_artists[0]?.artists?.name ?? "";

        const bArtistName =
            b.record_artists.find((ra) => ra.is_primary)?.artists?.name ?? b.record_artists[0]?.artists?.name ?? "";

        const artistCompare = aArtistName.localeCompare(bArtistName);

        if (artistCompare !== 0) return artistCompare;

        return a.name.localeCompare(b.name);
    });
};

export const AdminRecordsPage = () => {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const requestedEditRecordId = searchParams.get("edit");
    const handledEditRecordIdRef = useRef<string | null>(null);

    const loadErrorMessage = t("features.admin.records.error.loadError");
    const {
        records,
        setRecords,
        loading: recordsLoading,
        loadError: recordsLoadError,
    } = useRecords({ loadErrorMessage });
    const { artists, loading: artistsLoading, loadError: artistsLoadError } = useArtists({ loadErrorMessage });
    const loadError = recordsLoadError ?? artistsLoadError;
    const loading = !loadError && (recordsLoading || artistsLoading);
    const [searchTerm, setSearchTerm] = useState("");

    // Create form state
    const [name, setName] = useState("");
    const [year, setYear] = useState("");
    const [format, setFormat] = useState("");
    const [type, setType] = useState("");
    const [description, setDescription] = useState("");
    const [coverFile, setCoverFile] = useState<File | null>(null);
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
    const [editCoverFile, setEditCoverFile] = useState<File | null>(null);
    const [currentCoverUrl, setCurrentCoverUrl] = useState<string | null>(null);
    const [originalCoverPath, setOriginalCoverPath] = useState<string | null>(null);
    const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);
    const [recordActionError, setRecordActionError] = useState<SimpleMessage>(null);
    const [recordActionSuccess, setRecordActionSuccess] = useState<SimpleMessage>(null);

    const [deletingRecordId, setDeletingRecordId] = useState<string | null>(null);
    const [recordToDelete, setRecordToDelete] = useState<RecordWithArtists | null>(null);

    const filteredRecords = useMemo(() => {
        const query = searchTerm.trim().toLowerCase();

        const list = !query
            ? records
            : records.filter((rec) => {
                  const matchesRecordName = rec.name.toLowerCase().includes(query);
                  const matchesArtist = rec.record_artists.some((ra) => ra.artists?.name.toLowerCase().includes(query));
                  const matchesYear = rec.year ? String(rec.year).includes(query) : false;

                  return matchesRecordName || matchesArtist || matchesYear;
              });

        return sortRecordsList(list);
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

            let coverPath: string | undefined;

            if (coverFile) {
                coverPath = await uploadImage(coverFile, "records", trimmedName);
            }

            const created = await createRecord({
                artist_ids: selectedArtistIds,
                name: trimmedName,
                description: description.trim() || undefined,
                format: format.trim() || undefined,
                type: type.trim() || undefined,
                year: parsedYear,
                cover_path: coverPath,
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
            setCoverFile(null);
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
        setCurrentCoverUrl(record.cover_path ?? null);
        setEditCoverFile(null);
        setOriginalCoverPath(record.cover_path ?? null);
    };

    const handleCancelEdit = () => {
        setEditingRecordId(null);
        setEditName("");
        setEditYear("");
        setEditFormat("");
        setEditType("");
        setEditDescription("");
        setEditArtistIds([]);
        setCurrentCoverUrl(null);
        setOriginalCoverPath(null);
        setEditCoverFile(null);
    };

    useEffect(() => {
        if (loading || loadError || !requestedEditRecordId) {
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
    }, [loading, loadError, records, requestedEditRecordId]);

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

            let coverPath: string | null | undefined = currentCoverUrl;
            const previousCoverPath = originalCoverPath;

            if (editCoverFile) {
                if (previousCoverPath) {
                    await deleteImageFromStorage(previousCoverPath);
                }
                coverPath = await uploadImage(editCoverFile, "records", trimmedName);
            } else if (currentCoverUrl === null) {
                if (previousCoverPath) {
                    await deleteImageFromStorage(previousCoverPath);
                }
                coverPath = null;
            }

            const updated = await updateRecord({
                id: editingRecordId,
                artist_ids: editArtistIds,
                name: trimmedName,
                description: editDescription.trim() || undefined,
                format: editFormat.trim() || undefined,
                type: editType.trim() || undefined,
                year: parsedYear,
                cover_path: coverPath,
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

        setRecordActionError(null);
        setRecordActionSuccess(null);
        setDeletingRecordId(record.id);

        try {
            await deleteRecord(record.id, record.cover_path);
            setRecords((current) => current.filter((r) => r.id !== record.id));
            setRecordActionSuccess(
                t("features.admin.records.deleteRecord.success.deleteSuccess", {
                    name: recordName,
                }),
            );
        } catch (err) {
            console.error(err);
            setRecordActionError(
                t("features.admin.records.deleteRecord.error.deleteError", {
                    name: recordName,
                }),
            );
        } finally {
            setDeletingRecordId(null);
            setRecordToDelete(null);
        }
    };

    if (loading) {
        return <SimpleSpinner message={t("features.admin.records.message.loading")} />;
    }

    if (loadError) {
        return <Feedback errors={[loadError]} />;
    }

    return (
        <AdminPageLayout
            lead={t("features.admin.records.lead")}
            sidebar={
                <div className="sticky-top-offset">
                    <RecordCreate
                        artists={artists}
                        coverFile={coverFile}
                        description={description}
                        format={format}
                        handleArtistCheckboxChange={handleArtistCheckboxChange}
                        handleCreateRecord={handleCreateRecord}
                        isSubmitting={isSubmitting}
                        name={name}
                        onCoverFileSelect={setCoverFile}
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
            }
            title={t("features.admin.records.title")}
        >
            <Feedback errors={[submitError, recordActionError]} successes={[submitSuccess, recordActionSuccess]} />
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
                searchPlaceholder={t("features.admin.records.search")}
                searchValue={searchTerm}
                showSearch={records.length > 5}
                title={t("features.admin.records.list.title")}
            />

            {filteredRecords.length === 0 ? (
                <EmptyStateCard message={t("features.admin.records.message.empty")} />
            ) : (
                <ul className="list-group shadow-sm mb-4">
                    {filteredRecords.map((record) => {
                        const isEditing = editingRecordId === record.id;
                        const artistNames = record.record_artists
                            .map((ra) => ra.artists?.name)
                            .filter(Boolean)
                            .join(", ");

                        return (
                            <Fragment key={record.id}>
                                <RecordToolRow
                                    artistNames={artistNames}
                                    deletingRecordId={deletingRecordId}
                                    handleCancelEdit={handleCancelEdit}
                                    handleDeleteRecord={setRecordToDelete}
                                    handleStartEdit={handleStartEdit}
                                    isEditing={isEditing}
                                    record={record}
                                />

                                {isEditing && (
                                    <RecordEdit
                                        artists={artists}
                                        currentCoverUrl={currentCoverUrl}
                                        editArtistIds={editArtistIds}
                                        editCoverFile={editCoverFile}
                                        editDescription={editDescription}
                                        editFormat={editFormat}
                                        editName={editName}
                                        editType={editType}
                                        editYear={editYear}
                                        handleCancelEdit={handleCancelEdit}
                                        handleEditArtistCheckboxChange={handleEditArtistCheckboxChange}
                                        handleSaveEdit={handleSaveEdit}
                                        isSubmittingEdit={isSubmittingEdit}
                                        onEditCoverFileSelect={setEditCoverFile}
                                        onRemoveCurrentCover={() => setCurrentCoverUrl(null)}
                                        record={record}
                                        setEditDescription={setEditDescription}
                                        setEditFormat={setEditFormat}
                                        setEditName={setEditName}
                                        setEditType={setEditType}
                                        setEditYear={setEditYear}
                                    />
                                )}
                            </Fragment>
                        );
                    })}
                </ul>
            )}
            <ConfirmModal
                isOpen={recordToDelete !== null}
                title={t("common.delete")}
                message={t("features.admin.records.deleteRecord.confirm", { name: recordToDelete?.name })}
                isPending={deletingRecordId !== null}
                onCancel={() => setRecordToDelete(null)}
                onConfirm={() => {
                    if (recordToDelete) void handleDeleteRecord(recordToDelete);
                }}
            />
        </AdminPageLayout>
    );
};
