// src/features/records/hooks/useRecord.ts
import { useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { getRecord } from "../api/getRecord";
import { isAbortError } from "../../../lib/asyncHelpers/withAbortSignal";
import type { RecordWithArtistsAndSongs, SimpleMessage } from "../../../types";

type UseRecordOptions = {
    recordId?: string;
    loadErrorMessage: string;
};

type UseRecordResult = {
    record: RecordWithArtistsAndSongs | null;
    loadError: SimpleMessage | null;
    loading: boolean;
    setRecord: Dispatch<SetStateAction<RecordWithArtistsAndSongs | null>>;
};

export const useRecord = ({ recordId, loadErrorMessage }: UseRecordOptions): UseRecordResult => {
    const [record, setRecord] = useState<RecordWithArtistsAndSongs | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [hasLoadError, setHasLoadError] = useState<boolean>(false);

    useEffect(() => {
        setLoading(true);
        setHasLoadError(false);
        setRecord(null);

        if (!recordId) {
            setHasLoadError(true);
            setLoading(false);
            return;
        }

        const controller = new AbortController();

        const loadRecord = async () => {
            try {
                const data = await getRecord(recordId, controller.signal);
                if (!controller.signal.aborted) {
                    setRecord(data);
                }
            } catch (error) {
                if (!isAbortError(error)) {
                    console.error(error);
                    if (!controller.signal.aborted) {
                        setHasLoadError(true);
                    }
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        void loadRecord();

        return () => {
            controller.abort();
        };
    }, [recordId]);

    return {
        record,
        loadError: hasLoadError ? loadErrorMessage : null,
        loading,
        setRecord,
    };
};
