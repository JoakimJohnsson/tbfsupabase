import type { ReactNode } from "react";
import { ToolButtonGroup } from "../buttons";
interface ListRowItemProps {
    children: ReactNode;
    actions?: ReactNode;
    className?: string;
    contentClassName?: string;
    actionsClassName?: string;
}
const buildClassName = (...classNames: Array<string | undefined>): string => {
    return classNames.filter(Boolean).join(" ");
};
export const ListRowItem = ({ children, actions, className, contentClassName, actionsClassName }: ListRowItemProps) => {
    return (
        <li className={buildClassName("list-group-item d-flex justify-content-between align-items-center", className)}>
            <div className={buildClassName("flex-grow-1 min-w-0 me-3", contentClassName)}>{children}</div>
            {actions && (
                <ToolButtonGroup className={buildClassName("ms-auto flex-shrink-0", actionsClassName)}>
                    {actions}
                </ToolButtonGroup>
            )}
        </li>
    );
};
