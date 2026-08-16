import {useCallback, useRef} from "react";

export const useLatestRequestGuard = () => {
    const latestRequestIdRef = useRef(0);

    const beginRequest = useCallback(() => {
        latestRequestIdRef.current += 1;
        return latestRequestIdRef.current;
    }, []);

    const isLatestRequest = useCallback((requestId: number) => {
        return requestId === latestRequestIdRef.current;
    }, []);

    return {
        beginRequest,
        isLatestRequest,
    };
};


