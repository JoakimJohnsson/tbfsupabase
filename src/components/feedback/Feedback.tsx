import { useEffect, useState } from "react";
import { getMapKeyFromString } from "../../lib/helpers/stringHelpers";
import type { SimpleMessageList } from "../../types";
import { FeedbackItem, type AlertItem } from "./FeedbackItem";

interface FeedbackProps {
    errors?: SimpleMessageList;
    successes?: SimpleMessageList;
    warnings?: SimpleMessageList;
}

const toMessages = (messages?: SimpleMessageList): string[] => {
    return (messages ?? []).reduce<string[]>((acc, message) => {
        if (typeof message !== "string") {
            return acc;
        }

        const trimmed = message.trim();

        if (trimmed) {
            acc.push(trimmed);
        }

        return acc;
    }, []);
};

export const Feedback = ({ errors, successes, warnings }: FeedbackProps) => {
    const [items, setItems] = useState<AlertItem[]>([]);

    // Normalize incoming props to primitive string representations to prevent re-render loops ( [] !== [] )
    const errorMessages = toMessages(errors);
    const warningMessages = toMessages(warnings);
    const successMessages = toMessages(successes);

    const errorKey = errorMessages.join("\0");
    const warningKey = warningMessages.join("\0");
    const successKey = successMessages.join("\0");

    // Synchronize incoming messages into internal state only when text content changes
    useEffect(() => {
        const errorList = errorMessages.map((text, i) => ({
            id: `err-${getMapKeyFromString(text, i)}`,
            text,
            type: "danger" as const,
        }));

        const warningList = warningMessages.map((text, i) => ({
            id: `warn-${getMapKeyFromString(text, i)}`,
            text,
            type: "warning" as const,
        }));

        const successList = successMessages.map((text, i) => ({
            id: `succ-${getMapKeyFromString(text, i)}`,
            text,
            type: "success" as const,
        }));

        setItems([...errorList, ...warningList, ...successList]);
    }, [errorKey, warningKey, successKey]);

    const handleDismiss = (id: string) => {
        setItems((current) => current.filter((item) => item.id !== id));
    };

    if (items.length === 0) {
        return null;
    }

    return (
        <>
            {items.map((item) => (
                <FeedbackItem item={item} key={item.id} onDismiss={handleDismiss} />
            ))}
        </>
    );
};

export default Feedback;
