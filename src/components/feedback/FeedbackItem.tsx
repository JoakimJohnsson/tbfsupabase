import { useEffect, useRef } from "react";
import { t } from "i18next";

export interface AlertItem {
    id: string;
    text: string;
    type: "danger" | "warning" | "success";
}

interface FeedbackItemProps {
    item: AlertItem;
    onDismiss: (id: string) => void;
}

const AUTO_DISMISS_SECONDS = 5;

export const FeedbackItem = ({ item, onDismiss }: FeedbackItemProps) => {
    const isAssertive = item.type === "danger";
    const isAutoDismissible = item.type !== "danger" && AUTO_DISMISS_SECONDS > 0;

    // Remaining duration in milliseconds
    const remainingTimeRef = useRef(AUTO_DISMISS_SECONDS * 1000);
    const startTimeRef = useRef(Date.now());
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isPausedRef = useRef(false);

    const startTimer = () => {
        if (!isAutoDismissible || isPausedRef.current) {
            return;
        }

        startTimeRef.current = Date.now();
        timerRef.current = setTimeout(() => {
            onDismiss(item.id);
        }, remainingTimeRef.current);
    };

    const clearTimer = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    };

    useEffect(() => {
        startTimer();

        return () => {
            clearTimer();
        };
    }, []);

    // Pause countdown timer (triggered on mouse enter or keyboard focus)
    const pauseTimer = () => {
        if (!isAutoDismissible || isPausedRef.current) {
            return;
        }

        clearTimer();
        isPausedRef.current = true;
        const elapsed = Date.now() - startTimeRef.current;
        remainingTimeRef.current = Math.max(0, remainingTimeRef.current - elapsed);
    };

    // Resume countdown timer (triggered when both mouse and focus have left)
    const resumeTimer = () => {
        if (!isAutoDismissible || !isPausedRef.current || remainingTimeRef.current <= 0) {
            return;
        }

        isPausedRef.current = false;
        startTimer();
    };

    return (
        <div
            aria-live={isAssertive ? "assertive" : "polite"}
            className={`alert alert-${item.type} alert-dismissible fade show position-relative overflow-hidden`}
            onBlur={resumeTimer}
            onFocus={pauseTimer}
            onMouseEnter={pauseTimer}
            onMouseLeave={resumeTimer}
            role={isAssertive ? "alert" : "status"}
        >
            {item.text}

            {/* Visual countdown progress bar (hidden for users who prefer reduced motion) */}
            {isAutoDismissible && (
                <span
                    aria-hidden="true"
                    className="alert-progress-bar"
                    style={{ animationDuration: `${AUTO_DISMISS_SECONDS}s` }}
                />
            )}

            <button
                aria-label={t("common.close")}
                className="btn-close"
                onClick={() => onDismiss(item.id)}
                type="button"
            />
        </div>
    );
};
