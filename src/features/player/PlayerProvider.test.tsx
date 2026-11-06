// @vitest-environment jsdom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { Link, MemoryRouter, Route, Routes } from "react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "../../i18n/i18n";
import { SiteLayout } from "../../components/layout/SiteLayout";
import { SongList } from "../songs/components/SongList";
import type { SongWithRecordAndArtists } from "../../types";
import { PlayerProvider } from "./PlayerProvider";
import { usePlayer } from "./hooks/usePlayer";
import type { PlayerContextValue } from "./PlayerContext";

vi.mock("../auth/hooks/useAuth", () => ({
    useAuth: () => ({ user: null, profile: null }),
}));
vi.mock("../auth/api/signOut", () => ({ signOut: vi.fn() }));

const song: SongWithRecordAndArtists = {
    id: "song-1",
    name: "Example Song",
    audio_path: "/song.mp3",
    created_at: "2026-10-12T00:00:00Z",
    record_id: "record-1",
    track_number: 1,
    song_artists: [
        {
            song_id: "song-1",
            artist_id: "artist-1",
            is_primary: true,
            artists: { id: "artist-1", name: "Example Artist", slug: "example-artist" },
        },
    ],
    records: { id: "record-1", name: "Example Record", year: 2026, cover_path: "/cover.jpg" },
};
const nextSong = { ...song, id: "song-2", name: "Next Song", audio_path: "/next.mp3" };
const silentSong = { ...song, id: "silent-song", audio_path: "" };

describe("persistent audio player", () => {
    let host: HTMLDivElement;
    let root: Root;
    let player: PlayerContextValue;
    let audio: HTMLAudioElement;

    const CapturePlayer = () => {
        player = usePlayer();
        return null;
    };

    const click = (element: Element | null) => {
        expect(element).not.toBeNull();
        act(() => element!.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true })));
    };

    const startSong = async () => {
        await act(async () => player.playSong(song));
    };

    const loadMetadata = (duration: number) => {
        Object.defineProperty(audio, "duration", { configurable: true, value: duration });
        act(() => audio.dispatchEvent(new Event("loadedmetadata")));
    };

    const changeRange = (label: string, value: string) => {
        const input =
            label === "Volume"
                ? host.querySelector<HTMLInputElement>("label input")!
                : host.querySelector<HTMLInputElement>(`input[aria-label="${label}"]`)!;
        act(() => {
            Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!.call(input, value);
            input.dispatchEvent(new Event("input", { bubbles: true }));
            input.dispatchEvent(new Event("change", { bubbles: true }));
        });
    };

    beforeEach(() => {
        vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
        vi.spyOn(HTMLMediaElement.prototype, "load").mockImplementation(() => {});
        vi.spyOn(HTMLMediaElement.prototype, "play").mockImplementation(function (this: HTMLMediaElement) {
            this.dispatchEvent(new Event("play"));
            return Promise.resolve();
        });
        vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(function (this: HTMLMediaElement) {
            this.dispatchEvent(new Event("pause"));
        });
        host = document.createElement("div");
        document.body.append(host);
        root = createRoot(host);
        act(() =>
            root.render(
                <PlayerProvider>
                    <CapturePlayer />
                    <MemoryRouter>
                        <Routes>
                            <Route element={<SiteLayout />}>
                                <Route
                                    index
                                    element={
                                        <>
                                            <SongList songs={[song, silentSong, nextSong]} />
                                            <Link to="/next">Next page</Link>
                                        </>
                                    }
                                />
                                <Route path="/next" element={<h1>Next page</h1>} />
                            </Route>
                        </Routes>
                    </MemoryRouter>
                </PlayerProvider>,
            ),
        );
        audio = host.querySelector("audio")!;
    });

    afterEach(() => {
        act(() => root.unmount());
        host.remove();
        vi.restoreAllMocks();
        vi.unstubAllGlobals();
    });

    it("only shows the player after selecting a song and renders song metadata outside main", async () => {
        expect(host.querySelector('section[aria-label="Audio player"]')).toBeNull();
        await startSong();
        const panel = host.querySelector('section[aria-label="Audio player"]')!;
        expect(panel.textContent).toContain("Example Song");
        expect(panel.textContent).toContain("Example Artist");
        expect(panel.querySelector("img")?.getAttribute("src")).toBe("/cover.jpg");
        expect(host.querySelector("main")?.contains(panel)).toBe(false);
        expect(audio.getAttribute("src")).toBe("/song.mp3");
    });

    it("shares play/pause with song rows and keeps the paused player visible", async () => {
        await act(async () => click(host.querySelector('main button[aria-label="Play"]')));
        expect(player.isPlaying).toBe(true);
        click(host.querySelector('section button[aria-label="Pause"]'));
        expect(player.isPlaying).toBe(false);
        expect(audio.pause).toHaveBeenCalledOnce();
        expect(host.querySelector('main button[aria-label="Play"]')).not.toBeNull();
        await act(async () => click(host.querySelector('section button[aria-label="Play"]')));
        expect(player.isPlaying).toBe(true);
        expect(audio.play).toHaveBeenCalledTimes(2);
    });

    it("retains the audio element, song, position and controls across navigation", async () => {
        await startSong();
        loadMetadata(120);
        act(() => player.seekTo(35));
        click(host.querySelector('a[href="/next"]'));
        expect(host.querySelector("main h1")?.textContent).toBe("Next page");
        expect(host.querySelector("audio")).toBe(audio);
        expect(player.currentSong?.id).toBe(song.id);
        expect(player.currentTime).toBe(35);
        expect(player.isPlaying).toBe(true);
        expect(audio.play).toHaveBeenCalledOnce();
        expect(host.querySelector('section button[aria-label="Pause"]')).not.toBeNull();
    });

    it("tracks metadata and playback position and seeks using the timeline", async () => {
        await startSong();
        const timeline = host.querySelector<HTMLInputElement>('input[aria-label="Playback position"]')!;
        expect(timeline.disabled).toBe(true);
        loadMetadata(125);
        expect(timeline.disabled).toBe(false);
        expect(timeline.max).toBe("125");
        act(() => {
            audio.currentTime = 64;
            audio.dispatchEvent(new Event("timeupdate"));
        });
        expect(player.currentTime).toBe(64);
        expect(timeline.getAttribute("aria-valuetext")).toBe("1:04 / 2:05");
        changeRange("Playback position", "90");
        expect(audio.currentTime).toBe(90);
        expect(player.currentTime).toBe(90);
        act(() => player.seekTo(200));
        expect(audio.currentTime).toBe(125);
        act(() => player.seekTo(-10));
        expect(audio.currentTime).toBe(0);
    });

    it("handles unknown duration and updates it when it changes", async () => {
        await startSong();
        loadMetadata(Infinity);
        act(() => player.seekTo(40));
        expect(player.duration).toBe(0);
        expect(audio.currentTime).toBe(0);
        Object.defineProperty(audio, "duration", { configurable: true, value: 80 });
        act(() => audio.dispatchEvent(new Event("durationchange")));
        expect(player.duration).toBe(80);
    });

    it("changes and retains volume while resetting time on song changes", async () => {
        await startSong();
        loadMetadata(125);
        act(() => player.seekTo(30));
        changeRange("Volume", "0.25");
        expect(player.volume).toBe(0.25);
        expect(audio.volume).toBe(0.25);
        await act(async () => player.playSong(nextSong));
        expect(player.currentTime).toBe(0);
        expect(player.duration).toBe(0);
        expect(audio.getAttribute("src")).toBe("/next.mp3");
        expect(audio.volume).toBe(0.25);
        changeRange("Volume", "0");
        expect(audio.volume).toBe(0);
        act(() => player.setVolume(2));
        expect(audio.volume).toBe(1);
    });

    it("shows the fallback thumbnail when cover and artists are missing", async () => {
        await act(async () => player.playSong({ ...song, records: null, song_artists: [] }));
        const panel = host.querySelector('section[aria-label="Audio player"]')!;
        expect(panel.querySelector("img")).toBeNull();
        expect(panel.querySelector(".tbf-song-record-thumb svg")).not.toBeNull();
    });

    it("synchronizes native seeking and volume changes", async () => {
        await startSong();
        loadMetadata(120);
        act(() => {
            audio.currentTime = 25;
            audio.dispatchEvent(new Event("seeked"));
            audio.volume = 0.5;
            audio.dispatchEvent(new Event("volumechange"));
        });
        expect(player.currentTime).toBe(25);
        expect(player.volume).toBe(0.5);
    });

    it("rejects invalid values without corrupting playback state", async () => {
        const log = vi.spyOn(console, "error").mockImplementation(() => {});
        await startSong();
        loadMetadata(120);
        act(() => {
            player.seekTo(NaN);
            player.setVolume(Infinity);
            player.playSong({ ...nextSong, audio_path: "   " });
        });
        expect(player.currentTime).toBe(0);
        expect(player.volume).toBe(1);
        expect(player.currentSong?.id).toBe(song.id);
        expect(log).toHaveBeenCalledTimes(3);
    });

    it("updates controls when audio pauses or ends", async () => {
        await startSong();
        act(() => audio.dispatchEvent(new Event("pause")));
        expect(player.isPlaying).toBe(false);
        act(() => audio.dispatchEvent(new Event("play")));
        expect(player.isPlaying).toBe(true);
        act(() => audio.dispatchEvent(new Event("ended")));
        expect(player.isPlaying).toBe(false);
        expect(host.querySelector('section button[aria-label="Play"]')).not.toBeNull();
    });

    it("automatically starts the next playable track from SongList when audio ends", async () => {
        await act(async () => click(host.querySelector('main button[aria-label="Play"]')));
        expect(player.queue).toEqual([song, silentSong, nextSong]);
        loadMetadata(120);
        act(() => player.seekTo(120));
        await act(async () => audio.dispatchEvent(new Event("ended")));
        expect(player.currentSong?.id).toBe(nextSong.id);
        expect(audio.getAttribute("src")).toBe("/next.mp3");
        expect(audio.play).toHaveBeenCalledTimes(2);
        expect(player.isPlaying).toBe(true);
        expect(player.currentTime).toBe(0);
        expect(player.duration).toBe(0);
        expect(player.queue).toEqual([song, silentSong, nextSong]);
        expect(host.querySelector('section[aria-label="Audio player"]')?.textContent).toContain("Next Song");

        await act(async () => audio.dispatchEvent(new Event("ended")));
        expect(player.currentSong?.id).toBe(nextSong.id);
        expect(player.isPlaying).toBe(false);
        expect(audio.play).toHaveBeenCalledTimes(2);
    });

    it("starts at the selected track and advances in the supplied list order", async () => {
        const thirdSong = { ...song, id: "song-3", audio_path: "/third.mp3" };
        const songs = [thirdSong, nextSong, song];
        await act(async () => player.playSong(nextSong, songs));
        expect(player.queue).toEqual(songs);
        await act(async () => audio.dispatchEvent(new Event("ended")));
        expect(player.currentSong?.id).toBe(song.id);
        await act(async () => player.playPrevious());
        expect(player.currentSong?.id).toBe(nextSong.id);
    });

    it("supports next and previous while skipping missing audio in both directions", async () => {
        await act(async () =>
            player.playSong(song, [song, silentSong, { ...silentSong, id: "blank", audio_path: " " }, nextSong]),
        );
        await act(async () => player.playNext());
        expect(player.currentSong?.id).toBe(nextSong.id);
        act(() => player.pauseSong());
        await act(async () => player.playPrevious());
        expect(player.currentSong?.id).toBe(song.id);
        expect(player.isPlaying).toBe(true);
        expect(audio.play).toHaveBeenCalledTimes(3);
    });

    it("leaves playback unchanged at queue boundaries and before selecting a song", async () => {
        act(() => {
            player.playNext();
            player.playPrevious();
        });
        expect(player.queue).toEqual([]);
        expect(audio.play).not.toHaveBeenCalled();
        await startSong();
        act(() => {
            player.playNext();
            player.playPrevious();
        });
        expect(audio.play).toHaveBeenCalledOnce();
        expect(player.isPlaying).toBe(true);
    });

    it("keeps the queue through bottom-player pause, resume and page navigation", async () => {
        await act(async () => click(host.querySelector('main button[aria-label="Play"]')));
        click(host.querySelector('section button[aria-label="Pause"]'));
        await act(async () => click(host.querySelector('section button[aria-label="Play"]')));
        click(host.querySelector('a[href="/next"]'));
        expect(player.queue).toEqual([song, silentSong, nextSong]);
        await act(async () => audio.dispatchEvent(new Event("ended")));
        expect(player.currentSong?.id).toBe(nextSong.id);
        expect(player.isPlaying).toBe(true);
    });

    it("replaces the queue on a new list selection even when resuming the same song", async () => {
        await act(async () => player.playSong(song, [song, nextSong]));
        act(() => player.pauseSong());
        await act(async () => player.togglePlay(song, [nextSong, song]));
        expect(player.queue).toEqual([nextSong, song]);
        await act(async () => audio.dispatchEvent(new Event("ended")));
        expect(player.currentSong?.id).toBe(song.id);
        expect(player.isPlaying).toBe(false);
        await act(async () => player.playSong(nextSong));
        expect(player.queue).toEqual([nextSong]);
    });

    it("captures the queue without retaining a mutable list reference", async () => {
        const songs = [song, nextSong];
        await act(async () => player.playSong(song, songs));
        songs.pop();
        expect(player.queue).toEqual([song, nextSong]);
        await act(async () => audio.dispatchEvent(new Event("ended")));
        expect(player.currentSong?.id).toBe(nextSong.id);
    });

    it("stops after the last playable track when only tracks without audio remain", async () => {
        await act(async () => player.playSong(song, [song, silentSong]));
        await act(async () => audio.dispatchEvent(new Event("ended")));
        expect(player.currentSong?.id).toBe(song.id);
        expect(player.isPlaying).toBe(false);
        expect(audio.play).toHaveBeenCalledOnce();
    });

    it("rejects a selected song missing from the supplied queue", async () => {
        const log = vi.spyOn(console, "error").mockImplementation(() => {});
        await act(async () => player.playSong(song, [nextSong]));
        expect(player.currentSong).toBeNull();
        expect(player.queue).toEqual([]);
        expect(audio.play).not.toHaveBeenCalled();
        expect(log).toHaveBeenCalledOnce();
    });

    it("navigates with the player buttons and disables unavailable directions", async () => {
        const button = (label: string) =>
            host.querySelector<HTMLButtonElement>(`section button[aria-label="${label}"]`)!;
        await act(async () => click(host.querySelector('main button[aria-label="Play"]')));
        expect(button("Previous track").disabled).toBe(true);
        expect(button("Next track").disabled).toBe(false);
        await act(async () => click(button("Next track")));
        expect(player.currentSong?.id).toBe(nextSong.id);
        expect(player.isPlaying).toBe(true);
        expect(button("Previous track").disabled).toBe(false);
        expect(button("Next track").disabled).toBe(true);
        await act(async () => click(button("Previous track")));
        expect(player.currentSong?.id).toBe(song.id);
        expect(player.isPlaying).toBe(true);
        expect(button("Previous track").disabled).toBe(true);
        await act(async () => player.playSong(nextSong));
        expect(button("Previous track").disabled).toBe(true);
        expect(button("Next track").disabled).toBe(true);
    });

    it.each([false, true])("fully closes the player when paused is %s and allows restarting", async (paused) => {
        await act(async () => click(host.querySelector('main button[aria-label="Play"]')));
        loadMetadata(120);
        act(() => {
            player.seekTo(35);
            player.setVolume(0.25);
            if (paused) player.pauseSong();
        });
        click(host.querySelector('section button[aria-label="Close player"]'));
        expect(audio.pause).toHaveBeenCalled();
        expect(audio.load).toHaveBeenCalledOnce();
        expect(audio.hasAttribute("src")).toBe(false);
        expect(player.currentSong).toBeNull();
        expect(player.queue).toEqual([]);
        expect(player.isPlaying).toBe(false);
        expect(player.currentTime).toBe(0);
        expect(player.duration).toBe(0);
        expect(player.playbackError).toBe(false);
        expect(player.volume).toBe(0.25);
        expect(host.querySelector('section[aria-label="Audio player"]')).toBeNull();
        expect(host.querySelector('main button[aria-label="Pause"]')).toBeNull();
        act(() => {
            audio.dispatchEvent(new Event("ended"));
            audio.dispatchEvent(new Event("timeupdate"));
            audio.dispatchEvent(new Event("durationchange"));
            audio.dispatchEvent(new Event("error"));
        });
        expect(player.currentSong).toBeNull();
        expect(player.currentTime).toBe(0);
        expect(player.duration).toBe(0);
        expect(player.playbackError).toBe(false);
        await act(async () => click(host.querySelector('main button[aria-label="Play"]')));
        expect(player.currentSong?.id).toBe(song.id);
        expect(player.queue).toEqual([song, silentSong, nextSong]);
        expect(player.isPlaying).toBe(true);
        expect(audio.volume).toBe(0.25);
    });

    it("clears playback errors on close", async () => {
        vi.spyOn(console, "error").mockImplementation(() => {});
        vi.mocked(audio.play).mockRejectedValueOnce(new Error("Playback failed"));
        await startSong();
        expect(player.playbackError).toBe(true);
        click(host.querySelector('section button[aria-label="Close player"]'));
        expect(player.playbackError).toBe(false);
        expect(host.querySelector('[role="alert"]')).toBeNull();
    });

    it("toggles repeat independently and wraps next and previous around the queue", async () => {
        await act(async () => player.playSong(nextSong, [silentSong, song, nextSong, silentSong]));
        const repeat = host.querySelector<HTMLButtonElement>('button[aria-label="Repeat queue"]')!;
        expect(player.hasNext).toBe(false);
        expect(repeat.getAttribute("aria-pressed")).toBe("false");
        click(repeat);
        expect(repeat.getAttribute("aria-pressed")).toBe("true");
        expect(player.isRepeating).toBe(true);
        expect(player.isShuffling).toBe(false);
        expect(player.hasNext).toBe(true);
        await act(async () => audio.dispatchEvent(new Event("ended")));
        expect(player.currentSong?.id).toBe(song.id);
        expect(player.isPlaying).toBe(true);
        await act(async () => player.playPrevious());
        expect(player.currentSong?.id).toBe(nextSong.id);
        click(repeat);
        expect(player.hasNext).toBe(false);
        await act(async () => audio.dispatchEvent(new Event("ended")));
        expect(player.isPlaying).toBe(false);
    });

    it("restarts a single repeating track from zero and resets repeat on close", async () => {
        await startSong();
        loadMetadata(120);
        act(() => {
            player.seekTo(120);
            player.toggleRepeat();
        });
        await act(async () => audio.dispatchEvent(new Event("ended")));
        expect(player.currentSong?.id).toBe(song.id);
        expect(audio.currentTime).toBe(0);
        expect(player.currentTime).toBe(0);
        expect(player.isPlaying).toBe(true);
        expect(audio.play).toHaveBeenCalledTimes(2);
        expect(player.hasNext).toBe(true);
        expect(player.hasPrevious).toBe(true);
        click(host.querySelector('section button[aria-label="Close player"]'));
        expect(player.isRepeating).toBe(false);
    });

    it("starts radio with only playable songs, shuffle and repeat, and loops its shuffled order", async () => {
        vi.spyOn(Math, "random").mockReturnValue(0);
        const thirdSong = { ...song, id: "song-3", audio_path: "/third.mp3" };
        await act(async () => player.startRadio([song, silentSong, nextSong, thirdSong]));
        expect(player.queue).toEqual([nextSong, thirdSong, song]);
        expect(player.currentSong?.id).toBe(nextSong.id);
        expect(player.isShuffling).toBe(true);
        expect(player.isRepeating).toBe(true);
        for (const expected of [thirdSong, song, nextSong, thirdSong]) {
            await act(async () => audio.dispatchEvent(new Event("ended")));
            expect(player.currentSong?.id).toBe(expected.id);
            expect(player.isPlaying).toBe(true);
        }
        act(() => player.toggleShuffle());
        expect(player.queue).toEqual([song, nextSong, thirdSong]);
        expect(player.isRepeating).toBe(true);
        await act(async () => audio.dispatchEvent(new Event("ended")));
        expect(player.currentSong?.id).toBe(song.id);
    });

    it("restarts radio when the random first track is already current", async () => {
        await startSong();
        loadMetadata(120);
        act(() => player.seekTo(40));
        await act(async () => player.startRadio([song]));
        expect(player.currentTime).toBe(0);
        expect(audio.currentTime).toBe(0);
        expect(player.isRepeating).toBe(true);
        expect(player.isPlaying).toBe(true);
    });

    it("rejects an empty radio queue without disturbing current playback", async () => {
        const log = vi.spyOn(console, "error").mockImplementation(() => {});
        await startSong();
        act(() => player.startRadio([silentSong]));
        expect(player.currentSong?.id).toBe(song.id);
        expect(player.queue).toEqual([song]);
        expect(player.isShuffling).toBe(false);
        expect(player.isRepeating).toBe(false);
        expect(log).toHaveBeenCalledOnce();
    });

    it("toggles shuffle without interrupting playback and restores the original order", async () => {
        vi.spyOn(Math, "random").mockReturnValue(0);
        const thirdSong = { ...song, id: "song-3", audio_path: "/third.mp3" };
        const songs = [song, nextSong, thirdSong];
        await act(async () => player.playSong(song, songs));
        loadMetadata(120);
        act(() => player.seekTo(35));
        const shuffle = host.querySelector<HTMLButtonElement>('button[aria-label="Shuffle"]')!;
        expect(shuffle.getAttribute("aria-pressed")).toBe("false");
        click(shuffle);
        expect(shuffle.getAttribute("aria-pressed")).toBe("true");
        expect(shuffle.classList.contains("btn-primary")).toBe(true);
        expect(player.isShuffling).toBe(true);
        expect(player.queue).toEqual([song, thirdSong, nextSong]);
        expect(songs).toEqual([song, nextSong, thirdSong]);
        expect(player.currentTime).toBe(35);
        expect(player.isPlaying).toBe(true);
        expect(audio.play).toHaveBeenCalledOnce();
        await act(async () => player.playNext());
        expect(player.currentSong?.id).toBe(thirdSong.id);
        click(shuffle);
        expect(player.queue).toEqual(songs);
        expect(player.currentSong?.id).toBe(thirdSong.id);
        expect(player.isShuffling).toBe(false);
        expect(player.hasNext).toBe(false);
        expect(audio.play).toHaveBeenCalledTimes(2);
        await act(async () => player.playPrevious());
        expect(player.currentSong?.id).toBe(nextSong.id);
    });

    it("automatically plays the shuffled queue once and previous follows the same order", async () => {
        vi.spyOn(Math, "random").mockReturnValue(0);
        const thirdSong = { ...song, id: "song-3", audio_path: "/third.mp3" };
        await act(async () => player.playSong(song, [song, nextSong, thirdSong, silentSong]));
        act(() => player.toggleShuffle());
        expect(player.queue).toEqual([song, thirdSong, silentSong, nextSong]);
        await act(async () => audio.dispatchEvent(new Event("ended")));
        expect(player.currentSong?.id).toBe(thirdSong.id);
        await act(async () => player.playPrevious());
        expect(player.currentSong?.id).toBe(song.id);
        await act(async () => audio.dispatchEvent(new Event("ended")));
        expect(player.currentSong?.id).toBe(thirdSong.id);
        await act(async () => audio.dispatchEvent(new Event("ended")));
        expect(player.currentSong?.id).toBe(nextSong.id);
        expect(player.hasNext).toBe(false);
        await act(async () => audio.dispatchEvent(new Event("ended")));
        expect(player.isPlaying).toBe(false);
        expect(player.currentSong?.id).toBe(nextSong.id);
    });

    it("retains shuffle order on resume and navigation, and reshuffles new list selections", async () => {
        vi.spyOn(Math, "random").mockReturnValue(0);
        await act(async () => player.playSong(nextSong, [song, nextSong, silentSong]));
        act(() => player.toggleShuffle());
        const shuffled = [...player.queue];
        expect(shuffled[0]).toEqual(nextSong);
        click(host.querySelector('section button[aria-label="Pause"]'));
        await act(async () => click(host.querySelector('section button[aria-label="Play"]')));
        click(host.querySelector('a[href="/next"]'));
        expect(player.isShuffling).toBe(true);
        expect(player.queue).toEqual(shuffled);
        const thirdSong = { ...song, id: "song-3", audio_path: "/third.mp3" };
        await act(async () => player.playSong(song, [song, nextSong, thirdSong]));
        expect(player.queue).toEqual([song, thirdSong, nextSong]);
        act(() => player.toggleShuffle());
        expect(player.queue).toEqual([song, nextSong, thirdSong]);
    });

    it("supports single-track shuffle and resets it when closing", async () => {
        act(() => player.toggleShuffle());
        expect(player.isShuffling).toBe(false);
        await startSong();
        act(() => player.toggleShuffle());
        expect(player.queue).toEqual([song]);
        expect(player.hasNext).toBe(false);
        expect(player.hasPrevious).toBe(false);
        click(host.querySelector('section button[aria-label="Close player"]'));
        expect(player.isShuffling).toBe(false);
        await startSong();
        expect(player.queue).toEqual([song]);
        expect(player.isShuffling).toBe(false);
    });

    it("ignores pending playback rejection after closing", async () => {
        let rejectPlay: (error: Error) => void = () => {};
        vi.mocked(audio.play).mockImplementationOnce(
            () =>
                new Promise<void>((_resolve, reject) => {
                    rejectPlay = reject;
                }),
        );
        await startSong();
        click(host.querySelector('section button[aria-label="Close player"]'));
        await act(async () => rejectPlay(new Error("Playback interrupted")));
        expect(player.currentSong).toBeNull();
        expect(player.isPlaying).toBe(false);
        expect(player.playbackError).toBe(false);
    });

    it("reports a rejected playback request and allows retry", async () => {
        const log = vi.spyOn(console, "error").mockImplementation(() => {});
        vi.mocked(audio.play).mockRejectedValueOnce(new DOMException("Blocked", "NotAllowedError"));
        await startSong();
        expect(player.isPlaying).toBe(false);
        expect(host.querySelector('[role="alert"]')?.textContent).toContain("Could not play this audio");
        expect(log).toHaveBeenCalledOnce();
        await act(async () => click(host.querySelector('section button[aria-label="Play"]')));
        expect(player.isPlaying).toBe(true);
        expect(host.querySelector('[role="alert"]')).toBeNull();
    });

    it("reports audio loading errors", async () => {
        const log = vi.spyOn(console, "error").mockImplementation(() => {});
        await startSong();
        act(() => audio.dispatchEvent(new Event("error")));
        expect(player.isPlaying).toBe(false);
        expect(player.playbackError).toBe(true);
        expect(host.querySelector('[role="alert"]')).not.toBeNull();
        expect(log).toHaveBeenCalledOnce();
    });

    it("ignores a superseded playback rejection", async () => {
        let rejectPlay: (error: Error) => void = () => {};
        vi.mocked(audio.play).mockImplementationOnce(
            () =>
                new Promise<void>((_resolve, reject) => {
                    rejectPlay = reject;
                }),
        );
        await startSong();
        await act(async () => player.playSong(nextSong));
        await act(async () => rejectPlay(new Error("Old playback interrupted")));
        expect(player.currentSong?.id).toBe(nextSong.id);
        expect(player.isPlaying).toBe(true);
        expect(player.playbackError).toBe(false);
    });
});
