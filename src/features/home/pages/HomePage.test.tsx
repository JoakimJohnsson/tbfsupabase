// @vitest-environment jsdom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { MemoryRouter } from "react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "../../../i18n/i18n";
import { HomePage } from "./HomePage";
import { PlayerProvider } from "../../player/PlayerProvider";
import { usePlayer } from "../../player/hooks/usePlayer";
import type { PlayerContextValue } from "../../player/PlayerContext";
import type { SongWithRecordAndArtists } from "../../../types";

const { auth, songsHook } = vi.hoisted(() => ({ auth: vi.fn(), songsHook: vi.fn() }));
vi.mock("../../auth/hooks/useAuth", () => ({ useAuth: auth }));
vi.mock("../../songs/hooks/useSongs", () => ({ useSongs: songsHook }));
vi.mock("../../artists/hooks/useArtists", () => ({
    useArtists: () => ({ artists: [], loading: false, loadError: null }),
}));
vi.mock("../../records/hooks/useRecords", () => ({
    useRecords: () => ({ records: [], loading: false, loadError: null }),
}));

const song: SongWithRecordAndArtists = {
    id: "radio-song",
    name: "Radio Song",
    audio_path: "/radio.mp3",
    created_at: "2026-11-06",
    record_id: null,
    track_number: null,
    records: null,
    song_artists: [],
};

describe("home radio", () => {
    let host: HTMLDivElement;
    let root: Root;
    let player: PlayerContextValue;
    const CapturePlayer = () => {
        player = usePlayer();
        return null;
    };
    const render = () =>
        act(() =>
            root.render(
                <PlayerProvider>
                    <CapturePlayer />
                    <MemoryRouter>
                        <HomePage />
                    </MemoryRouter>
                </PlayerProvider>,
            ),
        );
    const radioButton = () => host.querySelector<HTMLButtonElement>("button")!;

    beforeEach(() => {
        vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
        vi.spyOn(HTMLMediaElement.prototype, "play").mockImplementation(function (this: HTMLMediaElement) {
            this.dispatchEvent(new Event("play"));
            return Promise.resolve();
        });
        auth.mockReturnValue({ user: { id: "user-1" } });
        songsHook.mockReturnValue({ songs: [song], loading: false, loadError: null });
        songsHook.mockClear();
        host = document.createElement("div");
        document.body.append(host);
        root = createRoot(host);
    });

    afterEach(() => {
        act(() => root.unmount());
        host.remove();
        vi.restoreAllMocks();
        vi.unstubAllGlobals();
    });

    it("shows a large radio button only for logged-in users and starts shuffled repeating playback", async () => {
        render();
        expect(radioButton().textContent).toContain("Start TBF Radio");
        expect(radioButton().classList.contains("btn-lg")).toBe(true);
        expect(songsHook).toHaveBeenCalledWith({ all: true, loadErrorMessage: "Could not load radio tracks." });
        await act(async () =>
            radioButton().dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true })),
        );
        expect(player.queue).toEqual([song]);
        expect(player.isPlaying).toBe(true);
        expect(player.isShuffling).toBe(true);
        expect(player.isRepeating).toBe(true);
    });

    it("does not render or load radio for logged-out visitors", () => {
        auth.mockReturnValue({ user: null });
        render();
        expect(host.textContent).not.toContain("Start TBF Radio");
        expect(songsHook).not.toHaveBeenCalled();
    });

    it("disables the radio while songs load", () => {
        songsHook.mockReturnValue({ songs: [], loading: true, loadError: null });
        render();
        expect(radioButton().disabled).toBe(true);
        expect(radioButton().textContent).toContain("Loading...");
    });

    it("shows an explicit empty state when no tracks have audio", () => {
        songsHook.mockReturnValue({ songs: [{ ...song, audio_path: " " }], loading: false, loadError: null });
        render();
        expect(radioButton().disabled).toBe(true);
        expect(radioButton().textContent).toContain("No playable tracks available yet.");
    });

    it("disables the radio and reports load failures", () => {
        songsHook.mockReturnValue({ songs: [], loading: false, loadError: "Could not load radio tracks." });
        render();
        expect(radioButton().disabled).toBe(true);
        expect(host.querySelector('[role="alert"]')?.textContent).toContain("Could not load radio tracks.");
    });
});
