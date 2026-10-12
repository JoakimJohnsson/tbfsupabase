import type { ComponentPropsWithoutRef } from "react";

const cardVariants = {
    default: "border-0 shadow-sm",
    outlined: "border shadow-none",
    flat: "border-0 shadow-none",
};

const cardBackgrounds = {
    body: "bg-body",
    secondary: "bg-body-secondary",
    tertiary: "bg-body-tertiary",
};

type CardProps = ComponentPropsWithoutRef<"div"> & {
    variant?: keyof typeof cardVariants;
    background?: keyof typeof cardBackgrounds;
};

export const Card = ({ variant = "default", background = "secondary", className, ...props }: CardProps) => {
    return (
        <div
            {...props}
            className={["card", cardBackgrounds[background], cardVariants[variant], className]
                .filter(Boolean)
                .join(" ")}
        />
    );
};
