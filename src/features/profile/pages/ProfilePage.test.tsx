// @vitest-environment jsdom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "../../../i18n/i18n";
import { ProfilePage } from "./ProfilePage";
import { useAuth } from "../../auth/hooks/useAuth";
import { updateProfileImage } from "../api/updateProfileImage";
import { uploadImage } from "../../../lib/supabase/storage";

vi.mock("../../auth/hooks/useAuth", () => ({ useAuth: vi.fn() }));
vi.mock("../api/updateProfileImage", () => ({ updateProfileImage: vi.fn() }));
vi.mock("../../../lib/supabase/storage", () => ({
    uploadImage: vi.fn(),
    deleteImageFromStorage: vi.fn(),
}));

describe("ProfilePage", () => {
    let host: HTMLDivElement;
    let root: Root;

    beforeEach(() => {
        vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
        host = document.createElement("div");
        document.body.append(host);
        root = createRoot(host);
        vi.mocked(useAuth).mockReturnValue({
            user: { id: "user-1", email: "member@example.com" } as NonNullable<ReturnType<typeof useAuth>["user"]>,
            profile: {
                id: "user-1",
                image_path: null,
            } as NonNullable<ReturnType<typeof useAuth>["profile"]>,
            setProfile: vi.fn(),
            session: null,
            isLoading: false,
        });
        vi.mocked(uploadImage).mockResolvedValue("https://example.com/profile.png");
        vi.mocked(updateProfileImage).mockResolvedValue({
            id: "user-1",
            image_path: "https://example.com/profile.png",
        } as NonNullable<ReturnType<typeof useAuth>["profile"]>);
    });

    afterEach(() => {
        act(() => root.unmount());
        host.remove();
        vi.unstubAllGlobals();
        vi.clearAllMocks();
    });

    it("renders the profile page and saves an uploaded profile image", async () => {
        const setProfile = vi.fn();
        vi.mocked(useAuth).mockReturnValue({
            user: { id: "user-1", email: "member@example.com" } as NonNullable<ReturnType<typeof useAuth>["user"]>,
            profile: { id: "user-1", image_path: null } as NonNullable<ReturnType<typeof useAuth>["profile"]>,
            setProfile,
            session: null,
            isLoading: false,
        });

        act(() => root.render(<ProfilePage />));

        expect(host.querySelector("h1")?.textContent).toBe("My profile");
        expect(host.textContent).toContain("member@example.com");

        const input = host.querySelector<HTMLInputElement>("#profile-image-upload")!;
        const imageFile = new File(["image"], "profile.png", { type: "image/png" });
        await act(async () => {
            Object.defineProperty(input, "files", { configurable: true, value: [imageFile] });
            input.dispatchEvent(new Event("change", { bubbles: true }));
        });

        await act(async () => {
            host.querySelector("form")!.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
        });

        expect(uploadImage).toHaveBeenCalledWith(imageFile, "profiles", "user-1");
        expect(updateProfileImage).toHaveBeenCalledWith("user-1", "https://example.com/profile.png");
        expect(setProfile).toHaveBeenCalledWith(
            expect.objectContaining({ image_path: "https://example.com/profile.png" }),
        );
        expect(host.textContent).toContain("Profile picture updated.");
    });
});
