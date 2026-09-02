import {type SubmitEvent, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import Feedback from "../../../components/feedback/Feedback";
import SimpleSpinner from "../../../components/spinners/SimpleSpinner";
import {getArtists} from "../../artists/api/getArtists";
import {createRecord} from "../../records/api/createRecord";
import {deleteRecord} from "../../records/api/deleteRecord";
import {getRecords} from "../../records/api/getRecords";
import {updateRecord} from "../../records/api/updateRecord";
import {isAbortError} from "../../../lib/asyncHelpers/withAbortSignal";
import type {Artist, RecordWithArtists, SimpleMessage} from "../../../types";

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
    const {t} = useTranslation();

    const [records, setRecords] = useState<RecordWithArtists[]>([]);
    const [artists, setArtists] = useState<Artist[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState<SimpleMessage>(null);

    // Create form state
    const [name, setName] = useState("");
    const [year, setYear] = useState("");
    const [description, setDescription] = useState("");
    const [selectedArtistIds, setSelectedArtistIds] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<SimpleMessage>(null);
    const [submitSuccess, setSubmitSuccess] = useState<SimpleMessage>(null);

    // Edit form state
    const [editingRecordId, setEditingRecordId] = useState<string | null>(null);
    const [editName, setEditName] = useState("");
    const [editYear, setEditYear] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editArtistIds, setEditArtistIds] = useState<string[]>([]);
    const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);
    const [recordActionError, setRecordActionError] = useState<SimpleMessage>(null);
    const [recordActionSuccess, setRecordActionSuccess] = useState<SimpleMessage>(null);

    const [deletingRecordId, setDeletingRecordId] = useState<string | null>(null);

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

    const handleArtistCheckboxChange = (artistId: string) => {
        setSelectedArtistIds((current) =>
            current.includes(artistId)
                ? current.filter((id) => id !== artistId)
                : [...current, artistId]
        );
    };

    const handleEditArtistCheckboxChange = (artistId: string) => {
        setEditArtistIds((current) =>
            current.includes(artistId)
                ? current.filter((id) => id !== artistId)
                : [...current, artistId]
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
                year: parsedYear,
            });

            const newRecordWithArtists: RecordWithArtists = {
                ...created,
                record_artists: mapArtistRelations(selectedArtistIds),
            };

            setRecords((current) => sortRecordsList([...current, newRecordWithArtists]));
            setName("");
            setYear("");
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
        setEditDescription(record.description ?? "");
        setEditArtistIds(record.record_artists.map((ra) => ra.artist_id));
    };

    const handleCancelEdit = () => {
        setEditingRecordId(null);
        setEditName("");
        setEditYear("");
        setEditDescription("");
        setEditArtistIds([]);
    };

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
                year: parsedYear,
            });

            const updatedRecordWithArtists: RecordWithArtists = {
                ...updated,
                record_artists: mapArtistRelations(editArtistIds),
            };

            setRecords((current) =>
                sortRecordsList(
                    current.map((rec) => (rec.id === updated.id ? updatedRecordWithArtists : rec))
                )
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
        const confirmed = window.confirm(
            t("features.admin.artist.deleteRecord.confirm", {name: record.name})
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
            setRecordActionSuccess(t("features.admin.artist.deleteRecord.success.deleteSuccess"));
        } catch (err) {
            console.error(err);
            setRecordActionError(t("features.admin.artist.deleteRecord.error.deleteError"));
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
        <>
            <h1>{t("features.admin.records.title")}</h1>
            <p className="lead">{t("features.admin.records.lead")}</p>

            <Feedback errors={[submitError, recordActionError]} successes={[submitSuccess, recordActionSuccess]} />

            {records.length === 0 ? (
                <p>{t("features.admin.records.message.empty")}</p>
            ) : (
                <ul className="list-group mb-4">
                    {records.map((record) => {
                        const isEditing = editingRecordId === record.id;
                        const artistNames = record.record_artists
                            .map((ra) => ra.artists?.name)
                            .filter(Boolean)
                            .join(", ");

                        if (isEditing) {
                            return (
                                <li className="list-group-item" key={record.id}>
                                    <form onSubmit={handleSaveEdit}>
                                        <div className="mb-2">
                                            <label className="form-label" htmlFor={`edit-name-${record.id}`}>
                                                {t("forms.name")}
                                            </label>
                                            <input
                                                className="form-control"
                                                id={`edit-name-${record.id}`}
                                                onChange={(e) => {
                                                    setEditName(e.target.value);
                                                }}
                                                required
                                                type="text"
                                                value={editName}
                                            />
                                        </div>

                                        <div className="mb-2">
                                            <label className="form-label" htmlFor={`edit-year-${record.id}`}>
                                                {t("forms.year")}
                                            </label>
                                            <input
                                                className="form-control"
                                                id={`edit-year-${record.id}`}
                                                onChange={(e) => {
                                                    setEditYear(e.target.value);
                                                }}
                                                placeholder="YYYY"
                                                type="number"
                                                value={editYear}
                                            />
                                        </div>

                                        <div className="mb-2">
                                            <label className="form-label" htmlFor={`edit-desc-${record.id}`}>
                                                {t("forms.description")}
                                            </label>
                                            <textarea
                                                className="form-control"
                                                id={`edit-desc-${record.id}`}
                                                onChange={(e) => {
                                                    setEditDescription(e.target.value);
                                                }}
                                                rows={2}
                                                value={editDescription}
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label d-block">
                                                {t("features.admin.record.create.artistsLabel")}
                                            </label>
                                            <div
                                                className="border rounded p-2"
                                                style={{maxHeight: "140px", overflowY: "auto"}}
                                            >
                                                {artists.map((artist) => (
                                                    <div className="form-check" key={artist.id}>
                                                        <input
                                                            checked={editArtistIds.includes(artist.id)}
                                                            className="form-check-input"
                                                            id={`edit-artist-${record.id}-${artist.id}`}
                                                            onChange={() => {
                                                                handleEditArtistCheckboxChange(artist.id);
                                                            }}
                                                            type="checkbox"
                                                        />
                                                        <label
                                                            className="form-check-label"
                                                            htmlFor={`edit-artist-${record.id}-${artist.id}`}
                                                        >
                                                            {artist.name}
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="d-flex gap-2">
                                            <button
                                                className="btn btn-sm btn-primary"
                                                disabled={isSubmittingEdit}
                                                type="submit"
                                            >
                                                {isSubmittingEdit
                                                    ? t("features.admin.record.edit.submitting")
                                                    : t("features.admin.record.edit.submit")}
                                            </button>
                                            <button
                                                className="btn btn-sm btn-secondary"
                                                disabled={isSubmittingEdit}
                                                onClick={handleCancelEdit}
                                                type="button"
                                            >
                                                {t("common.cancel")}
                                            </button>
                                        </div>
                                    </form>
                                </li>
                            );
                        }

                        return (
                            <li
                                className="list-group-item d-flex justify-content-between align-items-center"
                                key={record.id}
                            >
                                <div>
                                    <strong>{record.name}</strong>
                                    {record.year && ` (${record.year})`}
                                    <div className="text-muted small">
                                        {artistNames || t("features.admin.records.message.noArtists")}
                                    </div>
                                </div>

                                <div className="d-flex gap-2">
                                    <button
                                        className="btn btn-sm btn-outline-secondary"
                                        onClick={() => {
                                            handleStartEdit(record);
                                        }}
                                        type="button"
                                    >
                                        {t("common.edit")}
                                    </button>
                                    <button
                                        className="btn btn-sm btn-outline-danger"
                                        disabled={deletingRecordId === record.id}
                                        onClick={() => {
                                            void handleDeleteRecord(record);
                                        }}
                                        type="button"
                                    >
                                        {deletingRecordId === record.id
                                            ? t("features.admin.artist.deleteRecord.deleting")
                                            : t("common.delete")}
                                    </button>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}

            <h2>{t("features.admin.record.create.title")}</h2>

            <form onSubmit={handleCreateRecord}>
                <div className="mb-3">
                    <label className="form-label" htmlFor="record-name">
                        {t("forms.name")}
                    </label>
                    <input
                        className="form-control"
                        id="record-name"
                        onChange={(e) => {
                            setName(e.target.value);
                        }}
                        required
                        type="text"
                        value={name}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label" htmlFor="record-year">
                        {t("forms.year")}
                    </label>
                    <input
                        className="form-control"
                        id="record-year"
                        onChange={(e) => {
                            setYear(e.target.value);
                        }}
                        placeholder="YYYY"
                        type="number"
                        value={year}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label" htmlFor="record-description">
                        {t("forms.description")}
                    </label>
                    <textarea
                        className="form-control"
                        id="record-description"
                        onChange={(e) => {
                            setDescription(e.target.value);
                        }}
                        rows={3}
                        value={description}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label d-block">
                        {t("features.admin.record.create.artistsLabel")}
                    </label>
                    <div
                        className="border rounded p-2"
                        style={{maxHeight: "180px", overflowY: "auto"}}
                    >
                        {artists.length === 0 ? (
                            <span className="text-muted small">
                                {t("features.artists.message.empty")}
                            </span>
                        ) : (
                            artists.map((artist) => (
                                <div className="form-check" key={artist.id}>
                                    <input
                                        checked={selectedArtistIds.includes(artist.id)}
                                        className="form-check-input"
                                        id={`artist-${artist.id}`}
                                        onChange={() => {
                                            handleArtistCheckboxChange(artist.id);
                                        }}
                                        type="checkbox"
                                    />
                                    <label
                                        className="form-check-label"
                                        htmlFor={`artist-${artist.id}`}
                                    >
                                        {artist.name}
                                    </label>
                                </div>
                            ))
                        )}
                    </div>
                    {selectedArtistIds.length === 0 && (
                        <small className="form-text text-muted">
                            {t("features.admin.record.create.noArtistsHint")}
                        </small>
                    )}
                </div>

                <button
                    className="btn btn-primary"
                    disabled={isSubmitting}
                    type="submit"
                >
                    {isSubmitting
                        ? t("features.admin.record.create.submitting")
                        : t("features.admin.record.create.submit")}
                </button>
            </form>
        </>
    );
};