// @vitest-environment jsdom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { MemoryRouter } from "react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "../../../i18n/i18n";
import { FavoritesPage } from "./FavoritesPage";

const { auth, favorites, getFavorites } = vi.hoisted(() => ({
    auth: vi.fn(),
    favorites: vi.fn(),
    getFavorites: vi.fn(),
}));

vi.mock("../../auth/hooks/useAuth", () => ({ useAuth: auth }));
vi.mock("../hooks/useFavorites", () => ({ useFavorites: favorites }));
vi.mock("../api/getFavorites", () => ({ getFavorites }));
vi.mock("../../songs/components/SongList", () => ({
    SongList: ({ songs }: { songs: Array<{ id: string; name: string }> }) => (
        <ul>
            {songs.map((song) => (
                <li key={song.id}>{song.name}</li>
            ))}
        </ul>
    ),
}));

describe("FavoritesPage", () => {
    let host: HTMLDivElement;
    let root: Root;

    beforeEach(() => {
        vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
        auth.mockReturnValue({ user: { id: "user-1" } });
        favorites.mockReturnValue({ favoriteSongIds: new Set(["song-1"]) });
        getFavorites.mockResolvedValue([{ id: "song-1", name: "Favorite track" }]);
        host = document.createElement("div");
        document.body.append(host);
        root = createRoot(host);
    });

    afterEach(() => {
        act(() => root.unmount());
        host.remove();
        vi.clearAllMocks();
        vi.unstubAllGlobals();
    });

    it("renders favorite tracks and their count", async () => {
        await act(async () =>
            root.render(
                <MemoryRouter>
                    <FavoritesPage />
                </MemoryRouter>,
            ),
        );

        expect(host.textContent).toContain("Favorites");
        expect(host.textContent).toContain("1 favorite track");
        expect(host.textContent).toContain("Favorite track");
        expect(getFavorites).toHaveBeenCalledWith("user-1", expect.any(AbortSignal));
    });

    it("renders the empty favorites state", async () => {
        favorites.mockReturnValue({ favoriteSongIds: new Set() });
        getFavorites.mockResolvedValue([]);
        await act(async () =>
            root.render(
                <MemoryRouter>
                    <FavoritesPage />
                </MemoryRouter>,
            ),
        );

        expect(host.textContent).toContain("You have not added any favorite tracks yet.");
    });
});
