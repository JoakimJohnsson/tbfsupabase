import { useEffect, useState } from "react";
import { getArtistMembers } from "../../persons/api/getArtistMembers";
import { isAbortError } from "../../../lib/asyncHelpers/withAbortSignal";
import type { Person, SimpleMessage } from "../../../types";

type UseArtistMembersOptions = {
    artistId?: string;
    loadErrorMessage: string;
};

// Hook managing data loading for public artist members
export const useArtistMembers = ({ artistId, loadErrorMessage }: UseArtistMembersOptions) => {
    const [members, setMembers] = useState<Person[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState<SimpleMessage>(null);

    useEffect(() => {
        if (!artistId) {
            setMembers([]);
            setLoading(false);
            setLoadError(null);
            return;
        }

        const controller = new AbortController();

        const load = async () => {
            setLoading(true);
            setLoadError(null);

            try {
                const data = await getArtistMembers(artistId, controller.signal);
                if (!controller.signal.aborted) {
                    setMembers(data);
                }
            } catch (err) {
                if (!isAbortError(err)) {
                    console.error(err);
                    setLoadError(loadErrorMessage);
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        void load();

        return () => {
            controller.abort();
        };
    }, [artistId, loadErrorMessage]);

    return {
        members,
        loading,
        loadError,
    };
};
