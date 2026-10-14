import { useEffect, useState } from "react";
import { getPersons } from "../api/getPersons";
import { isAbortError } from "../../../lib/asyncHelpers/withAbortSignal";
import type { Person } from "../../../types";

type UsePersonsOptions = {
    loadErrorMessage: string;
};

export const usePersons = ({ loadErrorMessage }: UsePersonsOptions) => {
    const [persons, setPersons] = useState<Person[]>([]);
    const [loading, setLoading] = useState(true);
    const [hasLoadError, setHasLoadError] = useState(false);

    useEffect(() => {
        const controller = new AbortController();

        const load = async () => {
            setLoading(true);
            setHasLoadError(false);

            try {
                const data = await getPersons(controller.signal);
                if (!controller.signal.aborted) {
                    setPersons(data);
                }
            } catch (error) {
                if (!controller.signal.aborted && !isAbortError(error)) {
                    console.error(error);
                    setHasLoadError(true);
                    setPersons([]);
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
    }, []);

    return {
        persons,
        loading,
        loadError: hasLoadError ? loadErrorMessage : null,
        setPersons,
    };
};
