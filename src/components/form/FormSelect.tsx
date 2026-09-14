import type { ChangeEvent } from "react";

export interface SelectOption {
    label: string;
    value: string;
}

interface FormSelectProps {
    id: string;
    label: string;
    options: SelectOption[];
    value: string;
    onChange: (value: string) => void;
    containerClassName?: string;
    disabled?: boolean;
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
    containerClassName = "mb-3",
    disabled = false,
    labelClassName = "form-label",
    name,
    placeholder,
    required = false,
    selectClassName = "form-select",
}: FormSelectProps) => {
    const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
        onChange(event.target.value);
    };

    return (
        <div className={containerClassName}>
            <label className={labelClassName} htmlFor={id}>
                {label}
            </label>
            <select
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
