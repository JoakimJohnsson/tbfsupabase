import {useNavigate, useParams} from "react-router";
import {useTranslation} from "react-i18next";
import SimpleSpinner from "../../../components/spinners/SimpleSpinner";
import Feedback from "../../../components/feedback/Feedback";
import {useArtist} from "../../artists/hooks/useArtist";
import {useEffect, useState} from "react";
import {updateArtist} from "../../artists/api/updateArtist";
import type {SubmitEvent} from "react";
import {SimpleMessage} from "../../../types";
import {deleteArtist} from "../../artists/api/deleteArtist";
import {useArtistRecords} from "../../records/hooks/useArtistRecords";
import {createRecord} from "../../records/api/createRecord";

export const AdminArtistPage = () => {

    const {t} = useTranslation();
    const navigate = useNavigate();
    const loadErrorMessage = t("features.admin.artist.error.loadError");
    const editErrorMessage = t("features.admin.artist.edit.error.editError");
    const editSuccessMessage = t("features.admin.artist.edit.success.editSuccess");
    const deleteErrorMessage = t("features.admin.artist.delete.error.deleteError");
    const recordsLoadErrorMessage = t("features.admin.artist.error.loadRecordsError");

    const {artistSlug} = useParams();
    const {artist, loadError, loading, setArtist} = useArtist({
        artistSlug,
        loadErrorMessage,
    });
    const {records, recordsLoadError, recordsLoading, setRecords} = useArtistRecords({
        artistId: artist?.id,
        recordsLoadErrorMessage,
    });

    // Artist edit state
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [editError, setEditError] = useState<SimpleMessage | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editSuccess, setEditSuccess] = useState<SimpleMessage | null>(null);
    const [deleteError, setDeleteError] = useState<SimpleMessage | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Record create state
    const [recordName, setRecordName] = useState("");
    const [recordYear, setRecordYear] = useState("");
    const [recordDescription, setRecordDescription] = useState("");
    const [createRecordError, setCreateRecordError] = useState<SimpleMessage | null>(null);
    const [createRecordSuccess, setCreateRecordSuccess] = useState<SimpleMessage | null>(null);
    const [isCreatingRecord, setIsCreatingRecord] = useState(false);

    // Initialize edit fields
    useEffect(() => {
        if (!artist) {
            return;
        }

        setName(artist.name);
        setDescription(artist.description ?? "");
    }, [artist]);

    const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!artist) {
            return;
        }

        setEditError(null);
        setEditSuccess(null);
        setIsSubmitting(true);

        try {
            const updatedArtist = await updateArtist({
                id: artist.id,
                name: name.trim(),
                description: description.trim(),
            });

            setEditSuccess(editSuccessMessage);
            setArtist(updatedArtist);
        } catch (err) {
            console.error(err);
            setEditError(editErrorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCreateRecord = async (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!artist) {
            return;
        }

        setCreateRecordError(null);
        setCreateRecordSuccess(null);
        setIsCreatingRecord(true);

        try {
            const trimmedRecordName = recordName.trim();

            if (!trimmedRecordName) {
                setCreateRecordError(t("features.admin.artist.createRecord.error.invalidNameError"));
                return;
            }

            let parsedYear: number | undefined;
            const trimmedYear = recordYear.trim();

            if (trimmedYear) {
                const numericYear = Number(trimmedYear);

                if (isNaN(numericYear) || !Number.isInteger(numericYear)) {
                    setCreateRecordError(t("features.admin.artist.createRecord.error.invalidYearError"));
                    return;
                }

                parsedYear = numericYear;
            }

            const createdRecord = await createRecord({
                artist_ids: [artist.id],
                name: trimmedRecordName,
                description: recordDescription.trim() || undefined,
                year: parsedYear,
            });

            // Add created record to list and sort matching getArtistRecords query: year DESC (nulls last), then name ASC
            setRecords((currentRecords) => [
                ...currentRecords,
                createdRecord,
            ].sort((a, b) => {
                if (a.year === null && b.year === null) {
                    return a.name.localeCompare(b.name);
                }

                if (a.year === null) {
                    return 1;
                }

                if (b.year === null) {
                    return -1;
                }

                if (b.year !== a.year) {
                    return b.year - a.year;
                }

                return a.name.localeCompare(b.name);
            }));

            setRecordName("");
            setRecordYear("");
            setRecordDescription("");
            setCreateRecordSuccess(t("features.admin.artist.createRecord.success.createSuccess"));
        } catch (err) {
            console.error(err);
            setCreateRecordError(t("features.admin.artist.createRecord.error.createError"));
        } finally {
            setIsCreatingRecord(false);
        }
    };

    const handleDelete = async () => {
        if (!artist) {
            return;
        }

        const confirmed = window.confirm(
            t("features.admin.artist.delete.confirm", {
                name: artist.name,
            }),
        );

        if (!confirmed) {
            return;
        }

        setDeleteError(null);
        setIsDeleting(true);

        try {
            await deleteArtist(artist.id);
            navigate("/admin/artists", {
                replace: true,
            });
        } catch (err) {
            console.error(err);
            setDeleteError(deleteErrorMessage);
            setIsDeleting(false);
        }
    };

    // Error and state handling
    if (loadError) {
        return <Feedback errors={[loadError]}/>;
    }

    if (loading) {
        return <SimpleSpinner message={t("features.admin.artist.message.loading")}/>;
    }

    if (!artist) {
        return <Feedback warnings={[t("features.admin.artist.message.empty")]}/>;
    }

    return (
        <>
            <h1>{artist.name}</h1>

            <Feedback errors={[editError, deleteError]} successes={[editSuccess]}/>

            {artist.description && <p>{artist.description}</p>}

            <h2>{t("features.admin.artist.edit.title")}</h2>

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label" htmlFor="name">
                        {t("forms.name")}
                    </label>

                    <input className="form-control"
                           id="name"
                           name="name"
                           onChange={(event) => {
                               setName(event.target.value);
                           }}
                           required
                           type="text"
                           value={name}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label" htmlFor="description">
                        {t("forms.description")}
                    </label>

                    <textarea className="form-control"
                              id="description"
                              name="description"
                              onChange={(event) => {
                                  setDescription(event.target.value);
                              }}
                              rows={5}
                              value={description}
                    />
                </div>

                <button className="btn btn-primary" disabled={isSubmitting} type="submit">
                    {isSubmitting
                        ? t("features.admin.artist.edit.submitting")
                        : t("features.admin.artist.edit.submitEdit")}
                </button>
            </form>

            <h2>{t("features.admin.artist.recordsTitle")}</h2>

            {recordsLoadError && <Feedback errors={[recordsLoadError]}/>}

            {recordsLoading && <SimpleSpinner/>}

            {!recordsLoading && !recordsLoadError && records.length === 0 && (
                <p>{t("features.admin.artist.message.recordsEmpty")}</p>
            )}

            {records.length > 0 && (
                <ul>
                    {records.map((record) => (
                        <li key={record.id}>
                            {record.name}
                            {record.year && ` (${record.year})`}
                        </li>
                    ))}
                </ul>
            )}

            <h2>{t("features.admin.artist.createRecord.title")}</h2>

            <Feedback errors={[createRecordError]} successes={[createRecordSuccess]}/>

            <form onSubmit={handleCreateRecord}>
                <div className="mb-3">
                    <label className="form-label" htmlFor="record-name">
                        {t("forms.name")}
                    </label>

                    <input className="form-control"
                           id="record-name"
                           name="record-name"
                           onChange={(event) => {
                               setRecordName(event.target.value);
                           }}
                           required
                           type="text"
                           value={recordName}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label" htmlFor="record-year">
                        {t("forms.year")}
                    </label>

                    <input className="form-control"
                           id="record-year"
                           name="record-year"
                           onChange={(event) => {
                               setRecordYear(event.target.value);
                           }}
                           placeholder="YYYY"
                           type="number"
                           value={recordYear}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label" htmlFor="record-description">
                        {t("forms.description")}
                    </label>

                    <textarea className="form-control"
                              id="record-description"
                              name="record-description"
                              onChange={(event) => {
                                  setRecordDescription(event.target.value);
                              }}
                              rows={3}
                              value={recordDescription}
                    />
                </div>

                <button className="btn btn-primary" disabled={isCreatingRecord} type="submit">
                    {isCreatingRecord
                        ? t("features.admin.artist.createRecord.submitting")
                        : t("features.admin.artist.createRecord.submit")}
                </button>
            </form>

            <h2>{t("features.admin.artist.delete.title")}</h2>

            <button
                className="btn btn-danger"
                disabled={isDeleting || isSubmitting}
                onClick={() => {
                    void handleDelete();
                }}
                type="button"
            >
                {isDeleting
                    ? t("features.admin.artist.delete.deleting")
                    : t("features.admin.artist.delete.submitDelete")}
            </button>
        </>
    );
};