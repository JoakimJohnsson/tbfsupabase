import {type SubmitEvent, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import Feedback from "../../../components/feedback/Feedback";
import SimpleSpinner from "../../../components/spinners/SimpleSpinner";
import {getArtists} from "../../artists/api/getArtists";
import {createRecord} from "../../records/api/createRecord";
import {deleteRecord} from "../../records/api/deleteRecord";
import {getRecords} from "../../records/api/getRecords";
import {isAbortError} from "../../../lib/asyncHelpers/withAbortSignal";
import type {Artist, RecordWithArtists, SimpleMessage} from "../../../types";

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

    const handleCreateRecord = async (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();

        setSubmitError(null);
        setSubmitSuccess(null);
        setIsSubmitting(true);

        try {
            const trimmedName = name.trim();

            if (!trimmedName) {
                setSubmitError(t("features.admin.records.create.error.invalidNameError"));
                return;
            }

            let parsedYear: number | undefined;
            const trimmedYear = year.trim();

            if (trimmedYear) {
                const numericYear = Number(trimmedYear);

                if (isNaN(numericYear) || !Number.isInteger(numericYear)) {
                    setSubmitError(t("features.admin.records.create.error.invalidYearError"));
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

            // Map selected artists for immediate UI state representation
            const linkedArtistObjects = selectedArtistIds
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
                .filter(Boolean);

            const newRecordWithArtists: RecordWithArtists = {
                ...created,
                record_artists: linkedArtistObjects as RecordWithArtists["record_artists"],
            };

            setRecords((current) =>
                [...current, newRecordWithArtists].sort((a, b) => {
                    if (a.year === null && b.year === null) return a.name.localeCompare(b.name);
                    if (a.year === null) return 1;
                    if (b.year === null) return -1;
                    if (b.year !== a.year) return b.year - a.year;
                    return a.name.localeCompare(b.name);
                })
            );

            setName("");
            setYear("");
            setDescription("");
            setSelectedArtistIds([]);
            setSubmitSuccess(t("features.admin.records.create.success.createSuccess"));
        } catch (err) {
            console.error(err);
            setSubmitError(t("features.admin.records.create.error.createError"));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteRecord = async (record: RecordWithArtists) => {
        const confirmed = window.confirm(
            t("features.admin.artist.deleteRecord.confirm", {name: record.name})
        );

        if (!confirmed) {
            return;
        }

        setDeletingRecordId(record.id);

        try {
            await deleteRecord(record.id);
            setRecords((current) => current.filter((r) => r.id !== record.id));
        } catch (err) {
            console.error(err);
            setSubmitError(t("features.admin.artist.deleteRecord.error.deleteError"));
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

            <Feedback errors={[submitError]} successes={[submitSuccess]} />

            {records.length === 0 ? (
                <p>{t("features.admin.records.message.empty")}</p>
            ) : (
                <ul className="list-group mb-4">
                    {records.map((record) => {
                        const artistNames = record.record_artists
                            .map((ra) => ra.artists?.name)
                            .filter(Boolean)
                            .join(", ");

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
                            </li>
                        );
                    })}
                </ul>
            )}

            <h2>{t("features.admin.records.create.title")}</h2>

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
                        {t("features.admin.records.create.artistsLabel")}
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
                            {t("features.admin.records.create.noArtistsHint")}
                        </small>
                    )}
                </div>

                <button
                    className="btn btn-primary"
                    disabled={isSubmitting}
                    type="submit"
                >
                    {isSubmitting
                        ? t("features.admin.records.create.submitting")
                        : t("features.admin.records.create.submit")}
                </button>
            </form>
        </>
    );
};
