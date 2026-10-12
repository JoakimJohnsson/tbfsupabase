import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";

interface IConfirmModal {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    confirmVariant?: "danger" | "primary" | "warning";
    isPending?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

const OpenConfirmModal = ({
    title,
    message,
    confirmText,
    confirmVariant = "danger",
    isPending = false,
    onConfirm,
    onCancel,
}: Omit<IConfirmModal, "isOpen">) => {
    const { t } = useTranslation();
    const titleId = useId();
    const messageId = useId();
    const containerRef = useRef<HTMLDivElement>(null);
    const dialogRef = useRef<HTMLDivElement>(null);
    const cancelRef = useRef<HTMLButtonElement>(null);
    const confirmationRequested = useRef(false);

    useEffect(() => {
        if (!isPending) confirmationRequested.current = false;
    }, [isPending]);

    useEffect(() => {
        const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        const fallbackFocus = previousFocus?.closest("main");
        const previousOverflow = document.body.style.overflow;
        const hadModalOpen = document.body.classList.contains("modal-open");
        const siblings = Array.from(document.body.children).filter(
            (element): element is HTMLElement => element instanceof HTMLElement && element !== containerRef.current,
        );
        const previousInert = siblings.map((element) => element.inert);

        siblings.forEach((element) => {
            element.inert = true;
        });
        document.body.classList.add("modal-open");
        document.body.style.overflow = "hidden";
        cancelRef.current?.focus();

        const keepFocusInDialog = (event: FocusEvent) => {
            if (event.target instanceof Node && !dialogRef.current?.contains(event.target)) {
                dialogRef.current?.focus();
            }
        };
        document.addEventListener("focusin", keepFocusInDialog);

        return () => {
            document.removeEventListener("focusin", keepFocusInDialog);
            siblings.forEach((element, index) => {
                element.inert = previousInert[index];
            });
            document.body.style.overflow = previousOverflow;
            if (!hadModalOpen) document.body.classList.remove("modal-open");
            if (previousFocus?.isConnected) {
                previousFocus.focus();
            } else if (fallbackFocus?.isConnected) {
                const tabIndex = fallbackFocus.getAttribute("tabindex");
                fallbackFocus.setAttribute("tabindex", "-1");
                fallbackFocus.focus();
                if (tabIndex === null) fallbackFocus.removeAttribute("tabindex");
                else fallbackFocus.setAttribute("tabindex", tabIndex);
            }
        };
    }, []);

    const cancel = () => {
        if (!isPending && !confirmationRequested.current) onCancel();
    };

    return createPortal(
        <div ref={containerRef}>
            <div
                className="modal show d-block"
                ref={dialogRef}
                tabIndex={-1}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                aria-describedby={messageId}
                aria-busy={isPending}
                onClick={(event) => {
                    if (event.target === event.currentTarget) cancel();
                }}
                onKeyDown={(event) => {
                    if (event.key === "Escape") {
                        event.preventDefault();
                        event.stopPropagation();
                        cancel();
                    } else if (event.key === "Tab") {
                        const buttons = Array.from(
                            event.currentTarget.querySelectorAll<HTMLButtonElement>("button"),
                        ).filter((button) => !button.disabled);
                        const first = buttons[0];
                        const last = buttons[buttons.length - 1];
                        if (!first) {
                            event.preventDefault();
                            dialogRef.current?.focus();
                        } else if (
                            event.shiftKey &&
                            (document.activeElement === first || document.activeElement === dialogRef.current)
                        ) {
                            event.preventDefault();
                            last.focus();
                        } else if (
                            !event.shiftKey &&
                            (document.activeElement === last || document.activeElement === dialogRef.current)
                        ) {
                            event.preventDefault();
                            first.focus();
                        }
                    }
                }}
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content shadow">
                        <div className="modal-header">
                            <h2 className="modal-title fs-5" id={titleId}>
                                {title}
                            </h2>
                            <button
                                type="button"
                                className="btn-close"
                                aria-label={t("common.close")}
                                disabled={isPending}
                                onClick={cancel}
                            />
                        </div>
                        <div className="modal-body">
                            <p className="mb-0" id={messageId}>
                                {message}
                            </p>
                        </div>
                        <div className="modal-footer">
                            <button
                                ref={cancelRef}
                                type="button"
                                className="btn btn-secondary"
                                disabled={isPending}
                                onClick={cancel}
                            >
                                {t("common.cancel")}
                            </button>
                            <button
                                type="button"
                                className={`btn btn-${confirmVariant}`}
                                disabled={isPending}
                                onClick={() => {
                                    if (isPending || confirmationRequested.current) return;
                                    confirmationRequested.current = true;
                                    onConfirm();
                                }}
                            >
                                {isPending ? t("common.loading") : (confirmText ?? t("common.delete"))}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal-backdrop fade show" aria-hidden="true" onClick={cancel} />
        </div>,
        document.body,
    );
};

export const ConfirmModal = ({ isOpen, ...props }: IConfirmModal) => {
    return isOpen ? <OpenConfirmModal {...props} /> : null;
};
