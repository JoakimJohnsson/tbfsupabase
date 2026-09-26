import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { ReactNode } from "react";

interface FormCardProps {
    title: string;
    icon?: IconDefinition;
    children: ReactNode;
}

export const FormCard = ({ title, icon, children }: FormCardProps) => {
    return (
        <div className="card shadow-sm border-0 bg-body-tertiary">
            <div className="card-body">
                <h2 className="h5 card-title fw-bold mb-3 d-flex align-items-center gap-2">
                    {icon && <FontAwesomeIcon className="text-primary" icon={icon} />}
                    {title}
                </h2>
                {children}
            </div>
        </div>
    );
};
