import type { ComponentPropsWithoutRef, ReactNode } from "react";

interface ICardMedia extends ComponentPropsWithoutRef<"div"> {
    children: ReactNode;
    ratio?: "1x1" | "4x3" | "16x9";
}

export const CardMedia = ({ children, ratio = "1x1", className, ...props }: ICardMedia) => {
    return (
        <div {...props} className={["tbf-card-media", `tbf-card-media--${ratio}`, className].filter(Boolean).join(" ")}>
            {children}
        </div>
    );
};
