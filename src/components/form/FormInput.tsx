import type { ChangeEvent, HTMLInputTypeAttribute } from "react";

interface IFormInput {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    ariaLabel?: string;
    autoComplete?: string;
    containerClassName?: string;
    disabled?: boolean;
    hideLabel?: boolean;
    inputClassName?: string;
    labelClassName?: string;
    name?: string;
    placeholder?: string;
    required?: boolean;
    type?: HTMLInputTypeAttribute;
}

export const FormInput = ({
    id,
    label,
    value,
    onChange,
    ariaLabel,
    autoComplete,
    containerClassName = "mb-3",
    disabled = false,
    hideLabel = false,
    inputClassName = "form-control",
    labelClassName = "form-label",
    name,
    placeholder,
    required = false,
    type = "text",
}: IFormInput) => {
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        onChange(event.target.value);
    };

    const resolvedLabelClassName = [labelClassName, hideLabel ? "visually-hidden" : undefined]
        .filter(Boolean)
        .join(" ");

    return (
        <div className={containerClassName}>
            <label className={resolvedLabelClassName} htmlFor={id}>
                {label}
            </label>
            <input
                aria-label={ariaLabel}
                autoComplete={autoComplete}
                className={inputClassName}
                disabled={disabled}
                id={id}
                name={name ?? id}
                onChange={handleChange}
                placeholder={placeholder}
                required={required}
                type={type}
                value={value}
            />
        </div>
    );
};
