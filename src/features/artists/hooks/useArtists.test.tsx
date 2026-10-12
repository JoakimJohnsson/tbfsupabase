// @vitest-environment jsdom
import { act, StrictMode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import type { Artist, RecordWithArtists } from "../../../types";
import { useArtists } from "./useArtists";
import { useRecords } from "../../records/hooks/useRecords";

vi.mock("../api/getArtists", () => ({ getArtists: vi.fn() }));
vi.mock("../../records/api/getRecords", () => ({ getRecords: vi.fn() }));

import { getArtists } from "../api/getArtists";
import { getRecords } from "../../records/api/getRecords";

const artist: Artist = {
    id: "artist-1",
    name: "Example Artist",
    slug: "example-artist",
    description: null,
    image_path: null,
    created_at: "2026-10-12T00:00:00Z",
};

const record: RecordWithArtists = {
    id: "record-1",
    name: "Example Record",
    description: null,
    cover_path: null,
    created_at: "2026-10-12T00:00:00Z",
    format: null,
    type: null,
    year: null,
    record_artists: [{ record_id: "record-1", artist_id: artist.id, is_primary: true, artists: artist }],
};

const useArtistList = (loadErrorMessage: string) => {
    const { artists, setArtists, ...state } = useArtists({ loadErrorMessage });
    return { ...state, data: artists, removeFirst: () => setArtists((current) => current.slice(1)) };
};

const useRecordList = (loadErrorMessage: string) => {
    const { records, setRecords, ...state } = useRecords({ loadErrorMessage });
    return { ...state, data: records, removeFirst: () => setRecords((current) => current.slice(1)) };
};

const testListHook = <T,>(
    name: string,
    useList: (message: string) => {
        data: T[];
        loading: boolean;
        loadError: string | null;
        removeFirst: () => void;
    },
    fetch: Mock<(signal?: AbortSignal) => Promise<T[]>>,
    data: T[],
) => {
    describe(name, () => {
        let root: Root;
        let host: HTMLDivElement;
        let resolveRequest: (value: typeof data) => void;
        let rejectRequest: (error: Error) => void;
        let signal: AbortSignal | undefined;
        let consoleError: ReturnType<typeof vi.spyOn>;

        const Harness = ({ message }: { message: string }) => {
            const { loading, loadError, data, removeFirst } = useList(message);
            return (
                <>
                    <div data-loading={loading}>{loadError ?? JSON.stringify(data)}</div>
                    <button onClick={removeFirst}>Remove first</button>
                </>
            );
        };

        const render = (message = "Load failed") => {
            act(() => root.render(<Harness message={message} />));
        };

        beforeEach(() => {
            vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
            consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
            host = document.createElement("div");
            document.body.append(host);
            root = createRoot(host);
            fetch.mockReset();
            fetch.mockImplementation((requestSignal) => {
                signal = requestSignal;
                return new Promise((resolve, reject) => {
                    resolveRequest = resolve;
                    rejectRequest = reject;
                });
            });
        });

        afterEach(() => {
            act(() => root.unmount());
            host.remove();
            consoleError.mockRestore();
            vi.unstubAllGlobals();
        });

        it("loads data and exposes functional local updates", async () => {
            render();
            expect(host.querySelector("div")?.dataset.loading).toBe("true");
            expect(signal).toBeInstanceOf(AbortSignal);
            await act(async () => resolveRequest(data));
            expect(host.querySelector("div")?.dataset.loading).toBe("false");
            expect(host.querySelector("div")?.textContent).toBe(JSON.stringify(data));
            act(() => host.querySelector("button")?.click());
            expect(host.querySelector("div")?.textContent).toBe("[]");
            expect(fetch).toHaveBeenCalledTimes(1);
        });

        it("supports an empty result without a load error", async () => {
            render();
            await act(async () => resolveRequest([]));
            expect(host.querySelector("div")?.textContent).toBe("[]");
            expect(host.querySelector("div")?.dataset.loading).toBe("false");
        });

        it("surfaces errors and updates their translation without refetching", async () => {
            render();
            const error = new Error("Request failed");
            await act(async () => rejectRequest(error));
            expect(host.querySelector("div")?.textContent).toBe("Load failed");
            expect(host.querySelector("div")?.dataset.loading).toBe("false");
            expect(consoleError).toHaveBeenCalledWith(error);
            render("Translated error");
            expect(host.querySelector("div")?.textContent).toBe("Translated error");
            expect(fetch).toHaveBeenCalledTimes(1);
        });

        it("does not refetch or discard data when the error message changes", async () => {
            render();
            await act(async () => resolveRequest(data));
            render("Translated error");
            expect(host.querySelector("div")?.textContent).toBe(JSON.stringify(data));
            expect(fetch).toHaveBeenCalledTimes(1);
        });

        it("ignores cancellation errors", async () => {
            render();
            await act(async () => rejectRequest(Object.assign(new Error("Aborted"), { name: "AbortError" })));
            expect(host.querySelector("div")?.textContent).toBe("[]");
            expect(consoleError).not.toHaveBeenCalled();
        });

        it("aborts the request on unmount", async () => {
            render();
            act(() => root.render(null));
            expect(signal?.aborted).toBe(true);
            await act(async () => rejectRequest(new Error("Late failure")));
            expect(consoleError).not.toHaveBeenCalled();
        });

        it("ignores stale results after StrictMode cleanup", async () => {
            render();
            const resolveStaleRequest = resolveRequest;
            act(() => root.render(null));
            act(() =>
                root.render(
                    <StrictMode>
                        <Harness message="Load failed" />
                    </StrictMode>,
                ),
            );
            expect(fetch).toHaveBeenCalledTimes(3);
            expect(fetch.mock.calls[0][0]?.aborted).toBe(true);
            expect(fetch.mock.calls[1][0]?.aborted).toBe(true);
            expect(fetch.mock.calls[2][0]?.aborted).toBe(false);
            await act(async () => resolveRequest(data));
            await act(async () => resolveStaleRequest([]));
            expect(host.querySelector("div")?.textContent).toBe(JSON.stringify(data));
        });
    });
};

testListHook("useArtists", useArtistList, vi.mocked(getArtists), [artist]);
testListHook("useRecords", useRecordList, vi.mocked(getRecords), [record]);
