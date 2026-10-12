import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { ReactNode } from "react";
import { Card } from "./Card";
import { CardBody } from "./CardBody";

interface IFormCard {
    title: string;
    icon?: IconDefinition;
    children: ReactNode;
}

export const FormCard = ({ title, icon, children }: IFormCard) => {
    return (
        <Card>
            <CardBody>
                <h2 className="h5 card-title fw-bold mb-3 d-flex align-items-center gap-2">
                    {icon && <FontAwesomeIcon className="text-primary" icon={icon} />}
                    {title}
                </h2>
                {children}
            </CardBody>
        </Card>
    );
};
