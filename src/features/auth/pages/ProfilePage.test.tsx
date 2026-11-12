// @vitest-environment jsdom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { MemoryRouter } from "react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "../../../i18n/i18n";
import { ProfilePage } from "./ProfilePage";
import { useAuth } from "../hooks/useAuth";
import { updateProfile } from "../api/updateProfile";
import { uploadImage, deleteImageFromStorage } from "../../../lib/supabase/storage";
import type { Profile } from "../../../types";

vi.mock("../hooks/useAuth", () => ({ useAuth: vi.fn() }));
vi.mock("../api/updateProfile", () => ({ updateProfile: vi.fn() }));
vi.mock("../../../lib/supabase/storage", () => ({
    uploadImage: vi.fn(),
    deleteImageFromStorage: vi.fn(),
}));

describe("ProfilePage", () => {
    let host: HTMLDivElement;
    let root: Root;
    const profile: Profile = {
        id: "user-1",
        display_name: "Member",
        first_name: "First",
        last_name: "Last",
        image_path: null,
        is_admin: false,
        created_at: "2026-01-01T00:00:00Z",
    };

    const renderPage = () => {
        act(() =>
            root.render(
                <MemoryRouter>
                    <ProfilePage />
                </MemoryRouter>,
            ),
        );
    };

    const submit = async () => {
        await act(async () => {
            host.querySelector("form")!.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
        });
    };

    const changeInput = (id: string, value: string) => {
        act(() => {
            const input = host.querySelector<HTMLInputElement>(`#${id}`)!;
            Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!.call(input, value);
            input.dispatchEvent(new Event("input", { bubbles: true }));
        });
    };

    beforeEach(() => {
        vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
        host = document.createElement("div");
        document.body.append(host);
        root = createRoot(host);
        vi.mocked(useAuth).mockReturnValue({
            user: { id: "user-1", email: "member@example.com" } as NonNullable<ReturnType<typeof useAuth>["user"]>,
            profile,
            setProfile: vi.fn(),
            session: null,
            isLoading: false,
        });
        vi.mocked(uploadImage).mockResolvedValue("https://example.com/profile.png");
        vi.mocked(updateProfile).mockResolvedValue(profile);
        vi.mocked(deleteImageFromStorage).mockResolvedValue(undefined);
    });

    afterEach(() => {
        act(() => root.unmount());
        host.remove();
        vi.unstubAllGlobals();
        vi.restoreAllMocks();
        vi.clearAllMocks();
    });

    it("renders the profile page and saves an uploaded profile image", async () => {
        const setProfile = vi.fn();
        vi.mocked(useAuth).mockReturnValue({
            user: { id: "user-1", email: "member@example.com" } as NonNullable<ReturnType<typeof useAuth>["user"]>,
            profile,
            setProfile,
            session: null,
            isLoading: false,
        });

        const updatedProfile = { ...profile, image_path: "https://example.com/profile.png" };
        vi.mocked(updateProfile).mockResolvedValue(updatedProfile);
        renderPage();

        expect(host.querySelector("h1")?.textContent).toBe("My profile");
        expect(host.querySelector<HTMLInputElement>("#profile-email")?.value).toBe("member@example.com");

        const input = host.querySelector<HTMLInputElement>("#profile-image-upload")!;
        const imageFile = new File(["image"], "profile.png", { type: "image/png" });
        await act(async () => {
            Object.defineProperty(input, "files", { configurable: true, value: [imageFile] });
            input.dispatchEvent(new Event("change", { bubbles: true }));
        });

        await submit();

        expect(uploadImage).toHaveBeenCalledWith(imageFile, "profiles", "user-1");
        expect(updateProfile).toHaveBeenCalledWith("user-1", {
            display_name: "Member",
            first_name: "First",
            last_name: "Last",
            image_path: "https://example.com/profile.png",
        });
        expect(setProfile).toHaveBeenCalledWith(
            expect.objectContaining({ image_path: "https://example.com/profile.png" }),
        );
        expect(host.textContent).toContain("Profile updated.");
    });

    it("shows account details, read-only email and breadcrumbs", () => {
        renderPage();
        expect(host.querySelector<HTMLInputElement>("#profile-email")?.disabled).toBe(true);
        expect(host.querySelector<HTMLInputElement>("#profile-display-name")?.value).toBe("Member");
        expect(host.querySelector<HTMLInputElement>("#profile-first-name")?.value).toBe("First");
        expect(host.querySelector<HTMLInputElement>("#profile-last-name")?.value).toBe("Last");
        expect(host.querySelector(".breadcrumb a")?.getAttribute("href")).toBe("/");
        expect(host.querySelector('[aria-current="page"]')?.textContent).toBe("My profile");
    });

    it("saves trimmed names and immediately updates the auth profile", async () => {
        const updatedProfile = { ...profile, display_name: "New name", first_name: "New first", last_name: null };
        vi.mocked(updateProfile).mockResolvedValue(updatedProfile);
        renderPage();
        changeInput("profile-display-name", "  New name  ");
        changeInput("profile-first-name", " New first ");
        changeInput("profile-last-name", "   ");

        await submit();

        expect(updateProfile).toHaveBeenCalledWith("user-1", {
            display_name: "New name",
            first_name: "New first",
            last_name: null,
            image_path: null,
        });
        expect(useAuth().setProfile).toHaveBeenCalledWith(updatedProfile);
        expect(uploadImage).not.toHaveBeenCalled();
        expect(deleteImageFromStorage).not.toHaveBeenCalled();
        expect(host.textContent).toContain("Profile updated.");
    });

    it("supports clearing an optional display name", async () => {
        renderPage();
        changeInput("profile-display-name", "");
        await submit();
        expect(updateProfile).toHaveBeenCalledWith("user-1", expect.objectContaining({ display_name: null }));
    });

    it("shows errors without changing the auth profile and allows retry", async () => {
        vi.spyOn(console, "error").mockImplementation(() => {});
        vi.mocked(updateProfile).mockRejectedValueOnce(new Error("Update failed"));
        renderPage();
        changeInput("profile-display-name", "Try again");
        await submit();

        expect(host.textContent).toContain("Could not update your profile. Please try again.");
        expect(useAuth().setProfile).not.toHaveBeenCalled();
        expect(host.querySelector<HTMLInputElement>("#profile-display-name")?.value).toBe("Try again");
        expect(host.querySelector<HTMLButtonElement>('button[type="submit"]')?.disabled).toBe(false);

        await submit();
        expect(host.textContent).toContain("Profile updated.");
        expect(host.textContent).not.toContain("Could not update your profile.");
    });

    it("disables the form and shows progress while saving", async () => {
        let resolveUpdate!: (value: Profile) => void;
        vi.mocked(updateProfile).mockReturnValueOnce(
            new Promise((resolve) => {
                resolveUpdate = resolve;
            }),
        );
        renderPage();
        await submit();
        expect(host.querySelector<HTMLButtonElement>('button[type="submit"]')?.disabled).toBe(true);
        expect(host.querySelector<HTMLInputElement>("#profile-display-name")?.disabled).toBe(true);
        expect(host.textContent).toContain("Saving profile...");
        await submit();
        expect(updateProfile).toHaveBeenCalledOnce();

        await act(async () => resolveUpdate(profile));
        expect(host.querySelector<HTMLButtonElement>('button[type="submit"]')?.disabled).toBe(false);
    });

    it("shows a spinner while the profile is unavailable", () => {
        vi.mocked(useAuth).mockReturnValue({ ...useAuth(), profile: null, isLoading: true });
        renderPage();
        expect(host.querySelector('[role="status"]')).not.toBeNull();
        expect(host.querySelector("form")).toBeNull();
    });

    it("preserves the current profile image when saving names", async () => {
        vi.mocked(useAuth).mockReturnValue({
            ...useAuth(),
            profile: { ...profile, image_path: "https://example.com/existing.png" },
        });
        renderPage();
        await submit();
        expect(updateProfile).toHaveBeenCalledWith(
            "user-1",
            expect.objectContaining({
                image_path: "https://example.com/existing.png",
            }),
        );
        expect(deleteImageFromStorage).not.toHaveBeenCalled();
    });

    it("removes the previous image only after saving its removal", async () => {
        vi.mocked(useAuth).mockReturnValue({
            ...useAuth(),
            profile: { ...profile, image_path: "https://example.com/existing.png" },
        });
        renderPage();
        act(() => {
            Array.from(host.querySelectorAll("button"))
                .find((button) => button.textContent === "Delete")!
                .click();
        });
        await submit();
        expect(updateProfile).toHaveBeenCalledWith("user-1", expect.objectContaining({ image_path: null }));
        expect(deleteImageFromStorage).toHaveBeenCalledWith("https://example.com/existing.png");
    });
});
