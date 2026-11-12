// @vitest-environment jsdom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { MemoryRouter } from "react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "../../../i18n/i18n";
import { PlaylistsPage } from "./PlaylistsPage";

const { auth, getPlaylists } = vi.hoisted(() => ({
    auth: vi.fn(),
    getPlaylists: vi.fn(),
}));

vi.mock("../../auth/hooks/useAuth", () => ({ useAuth: auth }));
vi.mock("../api/getPlaylists", () => ({ getPlaylists }));

describe("PlaylistsPage", () => {
    let host: HTMLDivElement;
    let root: Root;

    beforeEach(() => {
        vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
        auth.mockReturnValue({ user: { id: "user-1" } });
        getPlaylists.mockResolvedValue([
            {
                id: "playlist-1",
                user_id: "user-1",
                name: "Road trip",
                description: "Songs for the drive",
                created_at: "2026-01-01T00:00:00.000Z",
                song_count: 3,
            },
        ]);
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

    it("renders the user's playlists, description, track count, and create form", async () => {
        await act(async () =>
            root.render(
                <MemoryRouter>
                    <PlaylistsPage />
                </MemoryRouter>,
            ),
        );

        expect(host.textContent).toContain("My playlists");
        expect(host.textContent).toContain("Road trip");
        expect(host.textContent).toContain("Songs for the drive");
        expect(host.textContent).toContain("3 tracks");
        expect(host.querySelector('input[name="playlist-name"]')).not.toBeNull();
        expect(getPlaylists).toHaveBeenCalledWith("user-1", expect.any(AbortSignal));
    });

    it("renders an empty state when the user has no playlists", async () => {
        getPlaylists.mockResolvedValue([]);
        await act(async () =>
            root.render(
                <MemoryRouter>
                    <PlaylistsPage />
                </MemoryRouter>,
            ),
        );

        expect(host.textContent).toContain("You have not created any playlists yet.");
    });
});
