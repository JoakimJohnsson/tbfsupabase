import type { ReactNode } from "react";

interface ToolButtonGroupProps {
    children: ReactNode;
    className?: string;
}

const buildClassName = (...classNames: Array<string | undefined>): string => {
    return classNames.filter(Boolean).join(" ");
};

export const ToolButtonGroup = ({ children, className }: ToolButtonGroupProps) => {
    return <div className={buildClassName("d-flex gap-2 align-items-center", className)}>{children}</div>;
};

