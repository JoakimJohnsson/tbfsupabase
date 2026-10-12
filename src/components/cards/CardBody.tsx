import type { ComponentPropsWithoutRef } from "react";

const cardBodyPadding = {
    normal: "p-3",
    comfortable: "p-4",
};

type CardBodyProps = ComponentPropsWithoutRef<"div"> & {
    padding?: keyof typeof cardBodyPadding;
};

export const CardBody = ({ padding = "normal", className, ...props }: CardBodyProps) => {
    return <div {...props} className={["card-body", cardBodyPadding[padding], className].filter(Boolean).join(" ")} />;
};
