// @vitest-environment jsdom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { FavoritesProvider } from "./FavoritesProvider";
import { useFavorites } from "./hooks/useFavorites";

const { addFavorite, getFavoriteSongIds, removeFavorite } = vi.hoisted(() => ({
    addFavorite: vi.fn(),
    getFavoriteSongIds: vi.fn(),
    removeFavorite: vi.fn(),
}));

vi.mock("../auth/hooks/useAuth", () => ({ useAuth: () => ({ user: { id: "user-1" } }) }));
vi.mock("./api/addFavorite", () => ({ addFavorite }));
vi.mock("./api/getFavoriteSongIds", () => ({ getFavoriteSongIds }));
vi.mock("./api/removeFavorite", () => ({ removeFavorite }));

const FavoriteControl = () => {
    const { isFavorite, toggleFavorite } = useFavorites();
    const favorite = isFavorite("song-1");

    return (
        <button aria-pressed={favorite} onClick={() => void toggleFavorite("song-1").catch(() => undefined)}>
            Toggle
        </button>
    );
};

describe("FavoritesProvider", () => {
    let host: HTMLDivElement;
    let root: Root;

    beforeEach(() => {
        vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
        getFavoriteSongIds.mockResolvedValue([]);
        addFavorite.mockResolvedValue(undefined);
        removeFavorite.mockResolvedValue(undefined);
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

    it("updates favorite state immediately and rolls back when the request fails", async () => {
        let rejectRequest: (error: Error) => void = () => undefined;
        addFavorite.mockImplementation(
            () =>
                new Promise<void>((_resolve, reject) => {
                    rejectRequest = reject;
                }),
        );

        await act(async () => {
            root.render(
                <FavoritesProvider>
                    <FavoriteControl />
                </FavoritesProvider>,
            );
        });
        const button = host.querySelector("button")!;
        expect(button.getAttribute("aria-pressed")).toBe("false");

        act(() => button.dispatchEvent(new MouseEvent("click", { bubbles: true })));
        expect(button.getAttribute("aria-pressed")).toBe("true");

        await act(async () => {
            rejectRequest(new Error("Request failed"));
            await Promise.resolve();
        });
        expect(button.getAttribute("aria-pressed")).toBe("false");
        expect(addFavorite).toHaveBeenCalledWith("user-1", "song-1");
    });
});
