import {useEffect, useState} from "react";
import type {Record} from "../../../types";
import {isAbortError} from "../../../lib/asyncHelpers/withAbortSignal";
import {getArtistRecords} from "../api/getArtistRecords";

type UseArtistRecordsOptions = {
    artistId?: string;
    recordsLoadErrorMessage: string;
};

export const useArtistRecords = ({
                                     artistId,
                                     recordsLoadErrorMessage,
                                 }: UseArtistRecordsOptions) => {
    const [records, setRecords] = useState<Record[]>([]);
    const [recordsLoading, setRecordsLoading] = useState(true);
    const [hasLoadError, setHasLoadError] = useState(false);

    useEffect(() => {
        if (!artistId) {
            setRecords([]);
            setRecordsLoading(false);
            setHasLoadError(false);
            return;
        }

        const controller = new AbortController();

        const loadRecords = async () => {
            setRecordsLoading(true);
            setHasLoadError(false);

            try {
                const data = await getArtistRecords(
                    artistId,
                    controller.signal,
                );

                setRecords(data);
            } catch (error) {
                if (!isAbortError(error)) {
                    console.error(error);
                    setHasLoadError(true);
                }
            } finally {
                if (!controller.signal.aborted) {
                    setRecordsLoading(false);
                }
            }
        };

        void loadRecords();

        return () => {
            controller.abort();
        };
    }, [artistId]);

    return {
        records,
        recordsLoadError: hasLoadError ? recordsLoadErrorMessage : null,
        recordsLoading,
        setRecords,
    };
};