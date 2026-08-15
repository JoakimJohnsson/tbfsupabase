export const ABORT_ERROR_NAME = "AbortError";
export const ABORT_ERROR_TYPE = "abort";

const createAbortError = (): Error => {
    const error = new Error("The operation was aborted.");
    error.name = ABORT_ERROR_NAME;
    return error;
};

export const withAbortSignal = async <T>(promiseLike: PromiseLike<T>, signal?: AbortSignal): Promise<T> => {
    const promise = Promise.resolve(promiseLike);

    if (!signal) {
        return promise;
    }

    if (signal.aborted) {
        throw createAbortError();
    }

    // Race the original async work against the abort signal.
    return new Promise<T>((resolve, reject) => {
        const onAbort = () => {
            reject(createAbortError());
        };

        signal.addEventListener(ABORT_ERROR_TYPE, onAbort, {once: true});

        promise
            .then(resolve)
            .catch(reject)
            .finally(() => {
                signal.removeEventListener(ABORT_ERROR_TYPE, onAbort);
            });
    });
};

export const isAbortError = (error: unknown): boolean => {
    return error instanceof Error && error.name === ABORT_ERROR_NAME;
};
