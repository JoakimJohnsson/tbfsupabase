import type { ChangeEvent } from "react";
import { SelectOption } from "../../types";

interface IFormSelect {
    id: string;
    label: string;
    options: SelectOption[];
    value: string;
    onChange: (value: string) => void;
    ariaLabel?: string;
    containerClassName?: string;
    disabled?: boolean;
    hideLabel?: boolean;
    labelClassName?: string;
    name?: string;
    placeholder?: string;
    required?: boolean;
    selectClassName?: string;
}

export const FormSelect = ({
    id,
    label,
    options,
    value,
    onChange,
    ariaLabel,
    containerClassName = "mb-3",
    disabled = false,
    hideLabel = false,
    labelClassName = "form-label",
    name,
    placeholder,
    required = false,
    selectClassName = "form-select",
}: IFormSelect) => {
    const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
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
            <select
                aria-label={ariaLabel}
                className={selectClassName}
                disabled={disabled}
                id={id}
                name={name ?? id}
                onChange={handleChange}
                required={required}
                value={value}
            >
                {placeholder && <option value="">{placeholder}</option>}
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};
