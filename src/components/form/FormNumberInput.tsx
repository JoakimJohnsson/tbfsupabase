import type { ChangeEvent, InputHTMLAttributes } from "react";

interface IFormNumberInput {
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
    inputMode?: InputHTMLAttributes<HTMLInputElement>["inputMode"];
    labelClassName?: string;
    max?: InputHTMLAttributes<HTMLInputElement>["max"];
    min?: InputHTMLAttributes<HTMLInputElement>["min"];
    name?: string;
    placeholder?: string;
    required?: boolean;
    step?: InputHTMLAttributes<HTMLInputElement>["step"];
}

export const FormNumberInput = ({
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
    inputMode = "numeric",
    labelClassName = "form-label",
    max,
    min,
    name,
    placeholder,
    required = false,
    step,
}: IFormNumberInput) => {
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
                inputMode={inputMode}
                max={max}
                min={min}
                name={name ?? id}
                onChange={handleChange}
                placeholder={placeholder}
                required={required}
                step={step}
                type="number"
                value={value}
            />
        </div>
    );
};
