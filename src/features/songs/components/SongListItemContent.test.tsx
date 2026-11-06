import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { SongWithArtists, SongWithRecordAndArtists } from "../../../types";
import { RecordSongsToolRow } from "../../records/components/songs/RecordSongsToolRow";
import { SongListItem } from "./SongListItem";
import { SongListItemContent } from "./SongListItemContent";

const { playerHook } = vi.hoisted(() => ({ playerHook: vi.fn() }));

vi.mock("react-i18next", () => ({
    useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("../../player/hooks/usePlayer", () => ({
    usePlayer: () => {
        playerHook();
        return { currentSong: null, isPlaying: false, togglePlay: vi.fn() };
    },
}));

const song: SongWithArtists = {
    id: "song-1",
    created_at: "2026-10-12T00:00:00Z",
    name: "Example Song",
    record_id: "record-1",
    track_number: 3,
    audio_path: "/song.mp3",
    song_artists: [
        {
            song_id: "song-1",
            artist_id: "artist-1",
            is_primary: true,
            artists: { id: "artist-1", name: "Example Artist", slug: "example-artist" },
        },
    ],
};

const songWithRecord: SongWithRecordAndArtists = {
    ...song,
    records: { id: "record-1", name: "Example Record", year: 2026, cover_path: "/cover.jpg" },
};

beforeEach(() => {
    playerHook.mockClear();
});

describe("SongListItemContent", () => {
    it("renders track, title and artists without player controls or a list row", () => {
        const markup = renderToStaticMarkup(<SongListItemContent song={song} />);

        expect(markup).toContain(">3.</span>");
        expect(markup).toContain(">Example Song</div>");
        expect(markup).toContain("Example Artist");
        expect(markup).toContain("text-success");
        expect(markup).not.toContain("<li");
        expect(markup).not.toContain("<button");
        expect(playerHook).not.toHaveBeenCalled();
    });

    it("renders cover and record metadata instead of the track number when requested", () => {
        const markup = renderToStaticMarkup(<SongListItemContent showCover showRecordInfo song={songWithRecord} />);

        expect(markup).toContain('src="/cover.jpg"');
        expect(markup).toContain('alt="Example Record"');
        expect(markup).toContain(">Example Record</span>");
        expect(markup).toContain("(2026)");
        expect(markup).not.toContain(">3.</span>");
    });

    it("handles missing cover, artists and track number", () => {
        const markup = renderToStaticMarkup(
            <SongListItemContent showCover showRecordInfo song={{ ...song, track_number: null, song_artists: [] }} />,
        );

        expect(markup).toContain("tbf-song-record-thumb");
        expect(markup).not.toContain("<img");
        expect(markup).not.toContain("Example Artist");
        expect(markup).not.toContain(">3.</span>");
    });

    it.each(["", "   "])("does not mark an audio path of %j as playable", (audio_path) => {
        const markup = renderToStaticMarkup(<SongListItemContent song={{ ...song, audio_path }} />);

        expect(markup).not.toContain("text-success");
    });
});

describe("song row wrappers", () => {
    it("keeps playback in the public row and reuses the shared content", () => {
        const markup = renderToStaticMarkup(<SongListItem song={songWithRecord} />);

        expect(markup).toContain(renderToStaticMarkup(<SongListItemContent song={songWithRecord} />));
        expect(markup).toContain('aria-label="common.play"');
        expect(playerHook).toHaveBeenCalledOnce();
    });

    it.each([false, true])("keeps admin actions independent of the player when isEditing is %s", (isEditing) => {
        const markup = renderToStaticMarkup(
            <RecordSongsToolRow
                song={song}
                isEditing={isEditing}
                handleStartEdit={vi.fn()}
                handleCancelEdit={vi.fn()}
                handleDeleteSong={vi.fn()}
            />,
        );

        expect(markup).toContain(renderToStaticMarkup(<SongListItemContent song={song} />));
        expect(markup).toContain(`aria-label="${isEditing ? "common.cancel" : "common.edit example song"}"`);
        expect(markup).toContain('aria-label="common.delete example song"');
        expect(markup).not.toContain('aria-label="common.play"');
        expect(markup.includes('disabled=""')).toBe(isEditing);
        expect(markup.includes("bg-primary-subtle")).toBe(isEditing);
        expect(playerHook).not.toHaveBeenCalled();
    });
});
