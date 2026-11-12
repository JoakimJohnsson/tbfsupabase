import { beforeEach, describe, expect, it, vi } from "vitest";
import { addFavorite } from "./addFavorite";
import { getFavoriteSongIds } from "./getFavoriteSongIds";
import { getFavorites } from "./getFavorites";
import { removeFavorite } from "./removeFavorite";

const { query, from, response } = vi.hoisted(() => ({
    query: {
        select: vi.fn(),
        insert: vi.fn(),
        delete: vi.fn(),
        eq: vi.fn(),
        order: vi.fn(),
        then: vi.fn(),
    },
    from: vi.fn(),
    response: { data: null as unknown, error: null as unknown },
}));

vi.mock("../../../lib/supabase/client", () => ({ supabase: { from } }));

beforeEach(() => {
    vi.clearAllMocks();
    response.data = null;
    response.error = null;
    from.mockReturnValue(query);
    query.select.mockReturnValue(query);
    query.insert.mockReturnValue(query);
    query.delete.mockReturnValue(query);
    query.eq.mockReturnValue(query);
    query.order.mockReturnValue(query);
    query.then.mockImplementation((resolve: (value: unknown) => unknown) =>
        Promise.resolve({ data: response.data, error: response.error }).then(resolve),
    );
});

describe("favorites API", () => {
    it("loads favorite songs with their record and artist relations", async () => {
        const song = { id: "song-1", name: "Track", records: null, song_artists: [] };
        response.data = [{ created_at: "2026-01-01", songs: song }];

        await expect(getFavorites("user-1")).resolves.toEqual([song]);
        expect(from).toHaveBeenCalledWith("song_favorites");
        expect(query.select).toHaveBeenCalledWith(expect.stringContaining("song_artists"));
        expect(query.eq).toHaveBeenCalledWith("user_id", "user-1");
        expect(query.order).toHaveBeenCalledWith("created_at", { ascending: false });
    });

    it("returns favorite song IDs only", async () => {
        response.data = [{ song_id: "one" }, { song_id: "two" }];
        await expect(getFavoriteSongIds("user-1")).resolves.toEqual(["one", "two"]);
        expect(query.select).toHaveBeenCalledWith("song_id");
        expect(query.eq).toHaveBeenCalledWith("user_id", "user-1");
    });

    it("adds and removes a favorite for the requested user and song", async () => {
        await addFavorite("user-1", "song-1");
        expect(query.insert).toHaveBeenCalledWith({ user_id: "user-1", song_id: "song-1" });

        await removeFavorite("user-1", "song-1");
        expect(query.delete).toHaveBeenCalled();
        expect(query.eq).toHaveBeenCalledWith("user_id", "user-1");
        expect(query.eq).toHaveBeenCalledWith("song_id", "song-1");
    });

    it("propagates database errors", async () => {
        const error = new Error("Request failed");
        response.error = error;
        await expect(addFavorite("user-1", "song-1")).rejects.toBe(error);
    });
});
