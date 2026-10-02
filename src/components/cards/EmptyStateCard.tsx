import type { ReactNode } from "react";

interface IEmptyStateCard {
    message: ReactNode;
    className?: string;
}

const buildClassName = (...classNames: Array<string | undefined>): string => {
    return classNames.filter(Boolean).join(" ");
};

export const EmptyStateCard = ({ message, className }: IEmptyStateCard) => {
    return (
        <div className={buildClassName("card border-0 bg-body-tertiary p-4 text-center text-muted", className)}>
            {message}
        </div>
    );
};
