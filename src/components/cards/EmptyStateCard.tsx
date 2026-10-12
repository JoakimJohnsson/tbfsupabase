import type { ReactNode } from "react";
import { Card } from "./Card";
import { CardBody } from "./CardBody";

interface IEmptyStateCard {
    message: ReactNode;
    className?: string;
}

const buildClassName = (...classNames: Array<string | undefined>): string => {
    return classNames.filter(Boolean).join(" ");
};

export const EmptyStateCard = ({ message, className }: IEmptyStateCard) => {
    return (
        <Card variant="flat" background={"tertiary"} className={buildClassName("text-center text-muted", className)}>
            <CardBody padding="comfortable">{message}</CardBody>
        </Card>
    );
};
