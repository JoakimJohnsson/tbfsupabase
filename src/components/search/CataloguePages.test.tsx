// @vitest-environment jsdom
import { act, type ReactNode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { MemoryRouter } from "react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "../../i18n/i18n";
import { RecordsPage } from "../../features/records/pages/RecordsPage";
import { SongsPage } from "../../features/songs/pages/SongsPage";
import { PlayerProvider } from "../../features/player/PlayerProvider";
import { usePlayer } from "../../features/player/hooks/usePlayer";
import type { PlayerContextValue } from "../../features/player/PlayerContext";
import type { RecordWithArtists, SongWithRecordAndArtists } from "../../types";

const { recordsHook, songsHook } = vi.hoisted(() => ({ recordsHook: vi.fn(), songsHook: vi.fn() }));
vi.mock("../../features/records/hooks/useRecords", () => ({ useRecords: recordsHook }));
vi.mock("../../features/songs/hooks/useSongs", () => ({ useSongs: songsHook }));

const baseRecord: RecordWithArtists = {
    id: "record",
    name: "Record",
    description: null,
    cover_path: null,
    created_at: "2026-11-06",
    format: null,
    type: null,
    year: null,
    record_artists: [
        {
            artist_id: "artist",
            record_id: "record",
            is_primary: true,
            artists: { id: "artist", name: "Example Artist", slug: "example" },
        },
    ],
};
const records: RecordWithArtists[] = [
    { ...baseRecord, id: "z", name: "Zulu", year: 1990, format: "vinyl-7", type: "single" },
    { ...baseRecord, id: "b", name: "Beta", year: 2020, format: "cassette", type: "album" },
    { ...baseRecord, id: "a", name: "Alpha", year: 2020, format: "vinyl-7", type: "ep" },
    { ...baseRecord, id: "unknown", name: "Aardvark" },
    { ...baseRecord, id: "cd", name: "Delta", year: 2000, format: "cd", type: "album" },
];
const songs: SongWithRecordAndArtists[] = records.map((record) => ({
    id: `song-${record.id}`,
    name: `${record.name} Track`,
    audio_path: "/track.mp3",
    created_at: "2026-11-06",
    record_id: record.id,
    track_number: 1,
    records: record,
    song_artists: [
        {
            artist_id: "artist",
            song_id: `song-${record.id}`,
            is_primary: true,
            artists: { id: "artist", name: "Example Artist", slug: "example" },
        },
    ],
}));
songs.push({ ...songs[0], id: "no-record", name: "Missing Record Track", records: null });

describe("catalogue filtering and sorting", () => {
    let host: HTMLDivElement;
    let root: Root;
    let player: PlayerContextValue;
    const CapturePlayer = () => {
        player = usePlayer();
        return null;
    };
    const render = (page: ReactNode) =>
        act(() =>
            root.render(
                <PlayerProvider>
                    <CapturePlayer />
                    <MemoryRouter>{page}</MemoryRouter>
                </PlayerProvider>,
            ),
        );
    const titles = () => [...host.querySelectorAll("h3 span.text-truncate")].map((node) => node.textContent);
    const trackTitles = () =>
        [...host.querySelectorAll("li .fw-semibold.text-truncate")].map((node) => node.textContent);
    const clickChip = (label: string) => {
        const button = [...host.querySelectorAll("fieldset button")].find((node) => node.textContent === label)!;
        expect(button).toBeDefined();
        act(() => button.dispatchEvent(new MouseEvent("click", { bubbles: true })));
        return button;
    };
    const setSort = (value: string) => {
        const select = host.querySelector("select")!;
        act(() => {
            select.value = value;
            select.dispatchEvent(new Event("change", { bubbles: true }));
        });
    };
    const search = (value: string) => {
        const input = host.querySelector("input")!;
        act(() => {
            Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!.call(input, value);
            input.dispatchEvent(new Event("input", { bubbles: true }));
        });
    };

    beforeEach(() => {
        vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
        vi.spyOn(HTMLMediaElement.prototype, "play").mockImplementation(function (this: HTMLMediaElement) {
            this.dispatchEvent(new Event("play"));
            return Promise.resolve();
        });
        recordsHook.mockReturnValue({ records, loading: false, loadError: null });
        songsHook.mockReturnValue({ songs, loading: false, loadError: null });
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

    it("filters to vinyl-7 and combines format and type chips with search", () => {
        render(<RecordsPage />);
        expect(titles()).toEqual(["Alpha", "Beta", "Delta", "Zulu", "Aardvark"]);
        const vinyl = clickChip('7" Vinyl');
        expect(vinyl.getAttribute("aria-pressed")).toBe("true");
        expect(titles()).toEqual(["Alpha", "Zulu"]);
        clickChip("EP");
        expect(titles()).toEqual(["Alpha"]);
        search("Example Artist");
        expect(titles()).toEqual(["Alpha"]);
        search("Zulu");
        expect(titles()).toEqual([]);
        expect(host.textContent).toContain("No records found.");
        clickChip("All types");
        expect(titles()).toEqual(["Zulu"]);
        search("");
        clickChip('7" Vinyl');
        expect(vinyl.getAttribute("aria-pressed")).toBe("false");
        expect(titles()).toHaveLength(5);
    });

    it("supports cassette and CD filters and clearing filters with All", () => {
        render(<RecordsPage />);
        clickChip("Cassette");
        expect(titles()).toEqual(["Beta"]);
        clickChip("CD");
        expect(titles()).toEqual(["Delta"]);
        clickChip("All formats");
        clickChip("Album");
        expect(titles()).toEqual(["Beta", "Delta"]);
        clickChip("Album");
        expect(titles()).toHaveLength(5);
    });

    it("sorts records chronologically in both directions and by title without mutating source data", () => {
        const order = records.map((record) => record.id);
        render(<RecordsPage />);
        setSort("year-asc");
        expect(titles()).toEqual(["Zulu", "Delta", "Alpha", "Beta", "Aardvark"]);
        setSort("title");
        expect(titles()).toEqual(["Aardvark", "Alpha", "Beta", "Delta", "Zulu"]);
        setSort("year-desc");
        expect(titles()).toEqual(["Alpha", "Beta", "Delta", "Zulu", "Aardvark"]);
        expect(records.map((record) => record.id)).toEqual(order);
        search("1990");
        expect(titles()).toEqual(["Zulu"]);
    });

    it("sorts songs using record years with missing years and records last", () => {
        render(<SongsPage />);
        expect(trackTitles()).toEqual([
            "Aardvark Track",
            "Alpha Track",
            "Beta Track",
            "Delta Track",
            "Missing Record Track",
            "Zulu Track",
        ]);
        setSort("year-asc");
        expect(trackTitles()).toEqual([
            "Zulu Track",
            "Delta Track",
            "Alpha Track",
            "Beta Track",
            "Aardvark Track",
            "Missing Record Track",
        ]);
        setSort("year-desc");
        expect(trackTitles()).toEqual([
            "Alpha Track",
            "Beta Track",
            "Delta Track",
            "Zulu Track",
            "Aardvark Track",
            "Missing Record Track",
        ]);
        search("example artist");
        expect(trackTitles()).toHaveLength(6);
        search("delta");
        expect(trackTitles()).toEqual(["Delta Track"]);
    });

    it("starts a song queue in the displayed filtered and sorted order", async () => {
        render(<SongsPage />);
        setSort("year-asc");
        search("example");
        await act(async () =>
            host.querySelector("li button")!.dispatchEvent(new MouseEvent("click", { bubbles: true })),
        );
        expect(player.queue.map((song) => song.name)).toEqual(trackTitles());
        expect(player.currentSong?.name).toBe("Zulu Track");
        await act(async () => host.querySelector("audio")!.dispatchEvent(new Event("ended")));
        expect(player.currentSong?.name).toBe("Delta Track");
    });

    it("preserves empty catalogue states without presenting unusable controls", () => {
        recordsHook.mockReturnValue({ records: [], loading: false, loadError: null });
        songsHook.mockReturnValue({ songs: [], loading: false, loadError: null });
        render(<RecordsPage />);
        expect(host.textContent).toContain("No records found.");
        expect(host.querySelector("fieldset, select, input")).toBeNull();
        render(<SongsPage />);
        expect(host.textContent).toContain("No tracks found.");
        expect(host.querySelector("select, input")).toBeNull();
    });

    it("preserves catalogue loading and error states", () => {
        recordsHook.mockReturnValue({ records: [], loading: true, loadError: null });
        render(<RecordsPage />);
        expect(host.querySelector('[role="status"]')).not.toBeNull();
        recordsHook.mockReturnValue({ records: [], loading: false, loadError: "Records failed" });
        render(<RecordsPage />);
        expect(host.querySelector('[role="alert"]')?.textContent).toContain("Records failed");
        songsHook.mockReturnValue({ songs: [], loading: true, loadError: null });
        render(<SongsPage />);
        expect(host.querySelector('[role="status"]')).not.toBeNull();
        songsHook.mockReturnValue({ songs: [], loading: false, loadError: "Songs failed" });
        render(<SongsPage />);
        expect(host.querySelector('[role="alert"]')?.textContent).toContain("Songs failed");
    });
});
