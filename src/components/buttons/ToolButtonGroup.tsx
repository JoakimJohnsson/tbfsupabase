import type { ReactNode } from "react";

interface IToolButtonGroup {
    children: ReactNode;
    className?: string;
}

const buildClassName = (...classNames: Array<string | undefined>): string => {
    return classNames.filter(Boolean).join(" ");
};

export const ToolButtonGroup = ({ children, className }: IToolButtonGroup) => {
    return <div className={buildClassName("d-flex gap-2 align-items-center", className)}>{children}</div>;
};
