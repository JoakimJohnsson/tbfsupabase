// @vitest-environment jsdom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ConfirmModal } from "./ConfirmModal";

vi.mock("react-i18next", () => ({
    useTranslation: () => ({ t: (key: string) => key }),
}));

let root: Root;
let host: HTMLDivElement;
let trigger: HTMLButtonElement;
const onConfirm = vi.fn();
const onCancel = vi.fn();

const renderModal = (isOpen = true, isPending = false) => {
    act(() => {
        root.render(
            <ConfirmModal
                isOpen={isOpen}
                isPending={isPending}
                title="Delete song"
                message="Delete Example Song?"
                onConfirm={onConfirm}
                onCancel={onCancel}
            />,
        );
    });
};

const buttons = () => Array.from(document.querySelectorAll<HTMLButtonElement>('[role="dialog"] button'));
const pressKey = (key: string, shiftKey = false) => {
    act(() => {
        document.activeElement?.dispatchEvent(
            new KeyboardEvent("keydown", { key, shiftKey, bubbles: true, cancelable: true }),
        );
    });
};

beforeEach(() => {
    vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
    onConfirm.mockClear();
    onCancel.mockClear();
    host = document.createElement("div");
    trigger = document.createElement("button");
    document.body.append(trigger, host);
    trigger.focus();
    root = createRoot(host);
});

afterEach(() => {
    act(() => root.unmount());
    host.remove();
    trigger.remove();
    document.body.style.overflow = "";
    document.body.classList.remove("modal-open");
    vi.unstubAllGlobals();
});

describe("ConfirmModal", () => {
    it("renders nothing when closed", () => {
        renderModal(false);
        expect(document.querySelector('[role="dialog"]')).toBeNull();
        expect(document.body.classList.contains("modal-open")).toBe(false);
    });

    it("labels the dialog, focuses cancel, and isolates background content", () => {
        renderModal();
        const dialog = document.querySelector('[role="dialog"]');
        expect(dialog?.getAttribute("aria-modal")).toBe("true");
        expect(document.getElementById(dialog?.getAttribute("aria-labelledby") ?? "")?.textContent).toBe("Delete song");
        expect(document.getElementById(dialog?.getAttribute("aria-describedby") ?? "")?.textContent).toBe(
            "Delete Example Song?",
        );
        expect(document.activeElement).toBe(buttons()[1]);
        expect(host.inert).toBe(true);
        expect(document.body.style.overflow).toBe("hidden");
        expect(document.querySelector(".modal-backdrop")).not.toBeNull();
    });

    it("wraps Tab and Shift+Tab within the dialog", () => {
        renderModal();
        const [close, , confirm] = buttons();
        confirm.focus();
        pressKey("Tab");
        expect(document.activeElement).toBe(close);
        pressKey("Tab", true);
        expect(document.activeElement).toBe(confirm);
    });

    it("cancels on Escape and outside clicks but not content clicks", () => {
        renderModal();
        pressKey("Escape");
        expect(onCancel).toHaveBeenCalledTimes(1);
        act(() => document.querySelector<HTMLElement>(".modal-content")?.click());
        expect(onCancel).toHaveBeenCalledTimes(1);
        act(() => document.querySelector<HTMLElement>(".modal")?.click());
        expect(onCancel).toHaveBeenCalledTimes(2);
    });

    it("prevents duplicate confirmation and dismissal after confirmation starts", () => {
        renderModal();
        act(() => {
            buttons()[2].click();
            buttons()[2].click();
            buttons()[1].click();
        });
        pressKey("Escape");
        expect(onConfirm).toHaveBeenCalledTimes(1);
        expect(onCancel).not.toHaveBeenCalled();
    });

    it("disables actions while pending without allowing focus to escape", () => {
        renderModal();
        renderModal(true, true);
        expect(buttons().every((button) => button.disabled)).toBe(true);
        expect(buttons()[2].textContent).toBe("common.loading");
        pressKey("Escape");
        pressKey("Tab");
        expect(document.activeElement).toBe(document.querySelector('[role="dialog"]'));
        act(() => document.querySelector<HTMLElement>(".modal")?.click());
        expect(onCancel).not.toHaveBeenCalled();
    });

    it("restores focus, inert state, and previous scrolling styles on close", () => {
        document.body.style.overflow = "auto";
        renderModal();
        renderModal(false);
        expect(document.activeElement).toBe(trigger);
        expect(host.inert).toBeFalsy();
        expect(document.body.style.overflow).toBe("auto");
        expect(document.body.classList.contains("modal-open")).toBe(false);
    });
});
