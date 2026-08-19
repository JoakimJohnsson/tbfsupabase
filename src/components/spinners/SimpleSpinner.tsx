import {useTranslation} from "react-i18next";

interface SimpleSpinnerProps {
    className?: string;
    message?: string;
    variant?: "spinner-border" | "spinner-grow";
}

const SimpleSpinner = ({
                           className,
                           message,
                           variant = "spinner-grow"
                       }: SimpleSpinnerProps) => {

    const {t} = useTranslation();
    const defaultMessage = t("common.loading");
    const trimmedMessage = message?.trim();
    const messageToShow = trimmedMessage ? trimmedMessage : defaultMessage;

    return (
        <div className="w-100 text-center">
            <div
                role="status"
                className={`${variant}${className ? ` ${className}` : ""}`}
            >
                <span className="visually-hidden">{messageToShow}</span>
            </div>
        </div>
    );
};

export default SimpleSpinner;
