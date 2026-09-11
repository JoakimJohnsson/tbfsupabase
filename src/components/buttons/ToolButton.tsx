import { type IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router";

type ToolButtonVariant = string;

type ToolButtonBaseProps = {
    icon: IconDefinition;
    className?: string;
    iconClassName?: string;
    iconPosition?: "start" | "end";
    size?: "sm" | "lg";
    variant?: ToolButtonVariant;
};

type ToolButtonWithTextProps = ToolButtonBaseProps & {
    text: string;
    ariaLabel?: string;
};

type ToolButtonIconOnlyProps = ToolButtonBaseProps & {
    text?: undefined;
    ariaLabel: string;
};

type ToolButtonButtonProps = {
    onClick: () => void;
    type?: "button" | "submit" | "reset";
    href?: never;
    to?: never;
    target?: never;
    rel?: never;
};

type ToolButtonLinkProps = {
    to: string;
    href?: never;
    onClick?: never;
    type?: never;
    target?: never;
    rel?: never;
};

type ToolButtonAnchorProps = {
    href: string;
    to?: never;
    onClick?: never;
    type?: never;
    target?: string;
    rel?: string;
};

export type ToolButtonProps =
    | (ToolButtonWithTextProps & ToolButtonButtonProps)
    | (ToolButtonIconOnlyProps & ToolButtonButtonProps)
    | (ToolButtonWithTextProps & ToolButtonLinkProps)
    | (ToolButtonIconOnlyProps & ToolButtonLinkProps)
    | (ToolButtonWithTextProps & ToolButtonAnchorProps)
    | (ToolButtonIconOnlyProps & ToolButtonAnchorProps);

const buildClassName = (...classNames: Array<string | undefined>): string => {
    return classNames.filter(Boolean).join(" ");
};

const renderContent = ({
    icon,
    iconClassName,
    iconPosition = "start",
    text,
}: {
    icon: IconDefinition;
    iconClassName?: string;
    iconPosition?: "start" | "end";
    text?: string;
}) => {
    const iconNode = (
        <span
            aria-hidden="true"
            className={buildClassName("tool-button__icon", iconClassName)}
        >
            <FontAwesomeIcon icon={icon} />
        </span>
    );

    const textNode = text ? (
        <span className="tool-button__text">{text}</span>
    ) : null;

    if (!textNode) {
        return iconNode;
    }

    return iconPosition === "end" ? (
        <>
            {textNode}
            {iconNode}
        </>
    ) : (
        <>
            {iconNode}
            {textNode}
        </>
    );
};

const sharedClassName = ({
    className,
    size,
    variant = "outline-secondary",
}: Pick<ToolButtonBaseProps, "className" | "size" | "variant">) => {
    return buildClassName(
        "btn",
        `btn-${variant}`,
        size ? `btn-${size}` : undefined,
        "tool-button",
        className,
    );
};

export const ToolButton = (props: ToolButtonProps) => {
    const {
        icon,
        className,
        iconClassName,
        iconPosition,
        size,
        text,
        variant,
    } = props;

    const commonContent = renderContent({
        icon,
        iconClassName,
        iconPosition,
        text,
    });
    const classNames = sharedClassName({
        className,
        size,
        variant,
    });
    const accessibleLabel = "ariaLabel" in props ? props.ariaLabel : text;

    if (props.to !== undefined) {
        const { to } = props;

        return (
            <Link aria-label={accessibleLabel} className={classNames} to={to}>
                {commonContent}
            </Link>
        );
    }

    if (props.href !== undefined) {
        const { href, rel, target } = props;
        const safeRel =
            target === "_blank" && !rel ? "noopener noreferrer" : rel;

        return (
            <a
                aria-label={accessibleLabel}
                className={classNames}
                href={href}
                rel={safeRel}
                target={target}
            >
                {commonContent}
            </a>
        );
    }

    const { onClick, type = "button" } = props;

    return (
        <button
            aria-label={accessibleLabel}
            className={classNames}
            onClick={onClick}
            type={type}
        >
            {commonContent}
        </button>
    );
};
