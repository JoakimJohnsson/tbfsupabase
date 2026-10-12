import { useEffect, useState } from "react";
import { getRecords } from "../api/getRecords";
import { isAbortError } from "../../../lib/asyncHelpers/withAbortSignal";
import type { RecordWithArtists } from "../../../types";

type UseRecordsOptions = {
    loadErrorMessage: string;
};

export const useRecords = ({ loadErrorMessage }: UseRecordsOptions) => {
    const [records, setRecords] = useState<RecordWithArtists[]>([]);
    const [loading, setLoading] = useState(true);
    const [hasLoadError, setHasLoadError] = useState(false);

    useEffect(() => {
        const controller = new AbortController();

        const loadRecords = async () => {
            setLoading(true);
            setHasLoadError(false);

            try {
                const data = await getRecords(controller.signal);
                if (!controller.signal.aborted) {
                    setRecords(data);
                }
            } catch (error) {
                if (!controller.signal.aborted && !isAbortError(error)) {
                    console.error(error);
                    setHasLoadError(true);
                    setRecords([]);
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        void loadRecords();

        return () => {
            controller.abort();
        };
    }, []);

    return {
        records,
        loading,
        loadError: hasLoadError ? loadErrorMessage : null,
        setRecords,
    };
};
