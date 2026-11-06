import { beforeEach, describe, expect, it, vi } from "vitest";
import { getSongs } from "./getSongs";

const { query, execute } = vi.hoisted(() => ({
    query: { select: vi.fn(), order: vi.fn(), range: vi.fn() },
    execute: vi.fn(),
}));
vi.mock("../../../lib/supabase/client", () => ({
    supabase: { from: () => query },
}));
vi.mock("../../../lib/asyncHelpers/withAbortSignal", () => ({
    withAbortSignal: execute,
}));

beforeEach(() => {
    vi.clearAllMocks();
    query.select.mockReturnValue(query);
    query.order.mockReturnValue(query);
    query.range.mockReturnValue(query);
});

describe("getSongs", () => {
    it("loads every page for radio, including catalogues above the default API limit", async () => {
        const page = Array.from({ length: 500 }, (_, i) => ({ id: String(i) }));
        execute
            .mockResolvedValueOnce({ data: page, error: null })
            .mockResolvedValueOnce({ data: page, error: null })
            .mockResolvedValueOnce({ data: [{ id: "last" }], error: null });
        const songs = await getSongs(undefined, { all: true });
        expect(songs).toHaveLength(1001);
        expect(songs[1000].id).toBe("last");
        expect(query.range.mock.calls).toEqual([
            [0, 499],
            [500, 999],
            [1000, 1499],
        ]);
        expect(query.order).toHaveBeenCalledWith("id", { ascending: true });
    });

    it("preserves the normal single-query song list", async () => {
        execute.mockResolvedValueOnce({ data: [{ id: "song" }], error: null });
        expect(await getSongs()).toEqual([{ id: "song" }]);
        expect(query.range).not.toHaveBeenCalled();
    });

    it("surfaces later-page failures instead of returning a partial radio catalogue", async () => {
        const error = new Error("Page failed");
        execute
            .mockResolvedValueOnce({ data: Array.from({ length: 500 }, () => ({ id: "song" })), error: null })
            .mockResolvedValueOnce({ data: null, error });
        await expect(getSongs(undefined, { all: true })).rejects.toBe(error);
    });

    it("stops paginating when aborted", async () => {
        const controller = new AbortController();
        execute.mockImplementationOnce(async () => {
            controller.abort();
            return { data: Array.from({ length: 500 }, () => ({ id: "song" })), error: null };
        });
        await expect(getSongs(controller.signal, { all: true })).rejects.toMatchObject({ name: "AbortError" });
        expect(execute).toHaveBeenCalledOnce();
    });
});
