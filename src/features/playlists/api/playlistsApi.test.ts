import { beforeEach, describe, expect, it, vi } from "vitest";
import { addSongToPlaylist } from "./addSongToPlaylist";
import { createPlaylist } from "./createPlaylist";
import { deletePlaylist } from "./deletePlaylist";
import { getPlaylist } from "./getPlaylist";
import { getPlaylists } from "./getPlaylists";
import { removeSongFromPlaylist } from "./removeSongFromPlaylist";
import { updatePlaylist } from "./updatePlaylist";

const { query, from, response } = vi.hoisted(() => ({
    query: {
        select: vi.fn(),
        insert: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        eq: vi.fn(),
        order: vi.fn(),
        limit: vi.fn(),
        maybeSingle: vi.fn(),
        single: vi.fn(),
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
    for (const method of [
        query.select,
        query.insert,
        query.update,
        query.delete,
        query.eq,
        query.order,
        query.limit,
        query.maybeSingle,
        query.single,
    ]) {
        method.mockReturnValue(query);
    }
    query.then.mockImplementation((resolve: (value: unknown) => unknown) =>
        Promise.resolve({ data: response.data, error: response.error }).then(resolve),
    );
});

describe("playlists API", () => {
    it("loads the user's playlists with song counts", async () => {
        response.data = [
            {
                id: "playlist-1",
                user_id: "user-1",
                name: "Favorites",
                description: null,
                created_at: "2026-01-01",
                playlist_songs: [{ count: 2 }],
            },
        ];
        await expect(getPlaylists("user-1")).resolves.toMatchObject([{ id: "playlist-1", song_count: 2 }]);
        expect(query.select).toHaveBeenCalledWith("*, playlist_songs(count)");
        expect(query.eq).toHaveBeenCalledWith("user_id", "user-1");
    });

    it("loads a playlist in position order with its songs and join IDs", async () => {
        response.data = {
            id: "playlist-1",
            user_id: "user-1",
            name: "Mix",
            description: null,
            created_at: "2026-01-01",
            playlist_songs: [
                { id: "join-2", song_id: "song-2", position: 2, songs: { id: "song-2" } },
                { id: "join-1", song_id: "song-1", position: 1, songs: { id: "song-1" } },
            ],
        };
        const playlist = await getPlaylist("playlist-1");
        expect(playlist.songs.map((song) => song.id)).toEqual(["song-1", "song-2"]);
        expect(playlist.playlistSongIds).toEqual({ "song-1": "join-1", "song-2": "join-2" });
        expect(query.order).toHaveBeenCalledWith("position", {
            referencedTable: "playlist_songs",
            ascending: true,
        });
    });

    it("creates and updates playlist details while normalizing blank descriptions", async () => {
        response.data = { id: "playlist-1", name: "Mix", description: null };
        await createPlaylist("user-1", "Mix", "  ");
        expect(query.insert).toHaveBeenCalledWith({ user_id: "user-1", name: "Mix", description: null });

        await updatePlaylist("playlist-1", "New mix", "Notes");
        expect(query.update).toHaveBeenCalledWith({ name: "New mix", description: "Notes" });
        expect(query.eq).toHaveBeenCalledWith("id", "playlist-1");
    });

    it("deletes playlists and adds or removes playlist tracks", async () => {
        response.data = { position: 3 };
        await deletePlaylist("playlist-1");
        expect(query.delete).toHaveBeenCalled();

        await addSongToPlaylist("playlist-1", "song-1");
        expect(query.insert).toHaveBeenCalledWith({ playlist_id: "playlist-1", song_id: "song-1", position: 4 });

        await removeSongFromPlaylist("playlist-song-1");
        expect(query.eq).toHaveBeenCalledWith("id", "playlist-song-1");
    });

    it("propagates playlist API failures", async () => {
        const error = new Error("Request failed");
        response.error = error;
        await expect(deletePlaylist("playlist-1")).rejects.toBe(error);
    });
});
