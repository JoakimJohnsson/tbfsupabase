// @vitest-environment jsdom
import { act, type ReactNode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { MemoryRouter, Route, Routes } from "react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "../../i18n/i18n";
import { SiteLayout } from "./SiteLayout";
import { AdminPageLayout } from "./AdminPageLayout";
import { AdminLayout } from "./AdminLayout";
import { AuthenticatedLayout } from "./AuthenticatedLayout";
import { AdminPage } from "../../features/admin/pages/AdminPage";
import { ArtistPage } from "../../features/artists/pages/ArtistPage";
import { ArtistsPage } from "../../features/artists/pages/ArtistsPage";
import { LoginPage } from "../../features/auth/pages/LoginPage";
import { HomePage } from "../../features/home/pages/HomePage";
import { NotFoundPage } from "../../features/notfound/pages/NotFoundPage";
import { RecordsPage } from "../../features/records/pages/RecordsPage";
import { SongsPage } from "../../features/songs/pages/SongsPage";
import { useArtist } from "../../features/artists/hooks/useArtist";
import { useAuth } from "../../features/auth/hooks/useAuth";

vi.mock("../../features/auth/hooks/useAuth", () => ({
    useAuth: vi.fn(),
}));
vi.mock("../../features/auth/api/signOut", () => ({ signOut: vi.fn() }));
vi.mock("../../features/auth/api/signIn", () => ({ signIn: vi.fn() }));
vi.mock("../../features/artists/hooks/useArtist", () => ({ useArtist: vi.fn() }));
vi.mock("../../features/artists/hooks/useArtists", () => ({
    useArtists: () => ({ artists: [], loading: false, loadError: null }),
}));
vi.mock("../../features/records/hooks/useRecords", () => ({
    useRecords: () => ({ records: [], loading: false, loadError: null }),
}));
vi.mock("../../features/songs/hooks/useSongs", () => ({
    useSongs: () => ({ songs: [], loading: false, loadError: null }),
}));
vi.mock("../../features/artists/hooks/useArtistMembers", () => ({
    useArtistMembers: () => ({ members: [], loading: false, loadError: null }),
}));
vi.mock("../../features/records/hooks/useArtistRecords", () => ({
    useArtistRecords: () => ({ records: [], recordsLoading: false, recordsLoadError: null }),
}));
vi.mock("../../features/songs/hooks/useArtistSongs", () => ({
    useArtistSongs: () => ({ songs: [], loading: false, loadError: null }),
}));

describe("SiteLayout page landmarks", () => {
    let host: HTMLDivElement;
    let root: Root;

    beforeEach(() => {
        vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
        host = document.createElement("div");
        document.body.append(host);
        root = createRoot(host);
        vi.mocked(useAuth).mockReturnValue({ user: null, profile: null, session: null, isLoading: false });
        vi.mocked(useArtist).mockReturnValue({
            artist: {
                id: "artist-1",
                name: "Example Artist",
                slug: "example-artist",
                description: "Artist biography",
                image_path: null,
                created_at: "2026-10-12T00:00:00Z",
            },
            loading: false,
            loadError: null,
            setArtist: vi.fn(),
        });
    });

    afterEach(() => {
        act(() => root.unmount());
        host.remove();
        vi.unstubAllGlobals();
    });

    const renderPage = (page: ReactNode) => {
        act(() =>
            root.render(
                <MemoryRouter>
                    <Routes>
                        <Route element={<SiteLayout />}>
                            <Route index element={page} />
                        </Route>
                    </Routes>
                </MemoryRouter>,
            ),
        );
        expect(host.querySelectorAll("main")).toHaveLength(1);
        expect(host.querySelectorAll("#main-content")).toHaveLength(1);
        const main = host.querySelector("main#main-content")!;
        expect(main.className).toBe("container-fluid py-3 flex-grow-1");
        expect(main.contains(host.querySelector("header"))).toBe(false);
        expect(main.querySelector(".container-fluid")).toBeNull();
        for (const column of main.querySelectorAll('[class*="col-"], .col')) {
            expect(column.parentElement?.classList.contains("row")).toBe(true);
        }
        return main;
    };

    it.each([
        ["home", <HomePage />],
        ["artists", <ArtistsPage />],
        ["records", <RecordsPage />],
        ["songs", <SongsPage />],
        ["login", <LoginPage />],
        ["admin dashboard", <AdminPage />],
        ["not found", <NotFoundPage />],
    ])("keeps the %s page heading inside a single main landmark", (_name, page) => {
        const main = renderPage(page);
        expect(main.querySelectorAll("h1")).toHaveLength(1);
    });

    it("keeps the login form in its intentionally constrained container", () => {
        const main = renderPage(<LoginPage />);
        expect(
            main.querySelector(":scope > .container.my-5 > .row.justify-content-center > .col-12 form"),
        ).not.toBeNull();
    });

    it("aligns the home hero and artist grid with the shared page container", () => {
        const main = renderPage(<HomePage />);
        expect(main.querySelector(":scope > .row.g-0 > .col-xxl-8")).not.toBeNull();

        renderPage(<ArtistPage />);
        expect(main.querySelector(':scope > .row.g-4 > section[aria-labelledby="artist-heading"]')).not.toBeNull();
    });

    it("includes the admin title, introduction, editor, and list in main", () => {
        const main = renderPage(
            <AdminPageLayout
                title="Manage artists"
                lead="Create and update artists"
                sidebar={
                    <form>
                        <h2>Create artist</h2>
                    </form>
                }
            >
                <h2>Existing artists</h2>
                <ul>
                    <li>Example Artist</li>
                </ul>
            </AdminPageLayout>,
        );

        expect(main.querySelector("h1")?.textContent).toBe("Manage artists");
        expect(main.querySelector(".lead")?.textContent).toBe("Create and update artists");
        const editor = main.querySelector('section[aria-label="Create or edit"]');
        expect(editor?.className).toBe("col-12 col-lg-5 col-xl-4");
        expect(editor?.querySelector("form")).not.toBeNull();
        expect(main.querySelector(".col-12.col-lg-7.col-xl-8 li")?.textContent).toBe("Example Artist");
        expect(main.querySelector("aside")).toBeNull();
    });

    it("includes artist identity, biography, members, and releases area in main", () => {
        const main = renderPage(<ArtistPage />);
        const details = main.querySelector('section[aria-labelledby="artist-heading"]');

        expect(details?.querySelector("h1#artist-heading")?.textContent).toBe("Example Artist");
        expect(details?.textContent).toContain("Artist biography");
        expect(details?.querySelector("h2")).not.toBeNull();
        expect(main.querySelector(".col-12.col-lg-8.col-xl-9")).not.toBeNull();
        expect(main.querySelector("aside")).toBeNull();
    });

    it("preserves main while the artist page is loading", () => {
        vi.mocked(useArtist).mockReturnValue({
            artist: null,
            loading: true,
            loadError: null,
            setArtist: vi.fn(),
        });
        expect(renderPage(<ArtistPage />).querySelector('[role="status"]')).not.toBeNull();
    });

    it("preserves main when the artist page fails to load", () => {
        vi.mocked(useArtist).mockReturnValue({
            artist: null,
            loading: false,
            loadError: "Could not load artist",
            setArtist: vi.fn(),
        });
        expect(renderPage(<ArtistPage />).querySelector('[role="alert"]')?.textContent).toContain(
            "Could not load artist",
        );
    });

    it("preserves main when the artist is missing", () => {
        vi.mocked(useArtist).mockReturnValue({
            artist: null,
            loading: false,
            loadError: null,
            setArtist: vi.fn(),
        });
        expect(renderPage(<ArtistPage />).querySelector('[role="status"]')).not.toBeNull();
    });

    it.each([
        ["admin", <AdminLayout />],
        ["member", <AuthenticatedLayout />],
    ])("preserves main while the %s route guard is loading", (_name, layout) => {
        vi.mocked(useAuth).mockReturnValue({ user: null, profile: null, session: null, isLoading: true });
        expect(renderPage(layout).querySelector('[role="status"]')).not.toBeNull();
    });
});
