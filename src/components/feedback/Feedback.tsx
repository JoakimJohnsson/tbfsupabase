import {getMapKeyFromString} from "../../lib/helpers/stringHelpers";
import type {SimpleMessageList} from "../../types";

interface FeedbackProps {
    errors?: SimpleMessageList;
    successes?: SimpleMessageList;
    warnings?: SimpleMessageList;
}

const toMessages = (messages: SimpleMessageList): string[] => {
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

const Feedback = ({errors = [], successes = [], warnings = []}: FeedbackProps) => {

    const errorMessages = toMessages(errors);
    const warningMessages = toMessages(warnings);
    const successMessages = toMessages(successes);


    return (
        <>
            {errorMessages.map((err, i) => (
                <div key={getMapKeyFromString(err, i)} className="alert alert-danger" role="alert"
                     aria-live="assertive">
                    {err}
                </div>
            ))}

            {warningMessages.map((warning, i) => (
                <div key={getMapKeyFromString(warning, i)} className="alert alert-warning" role="status"
                     aria-live="polite">
                    {warning}
                </div>
            ))}

            {successMessages.map((success, i) => (
                <div key={getMapKeyFromString(success, i)} className="alert alert-success" role="status"
                     aria-live="polite">
                    {success}
                </div>
            ))}
        </>
    );
};

export default Feedback;
