import type { ChangeEvent, HTMLInputTypeAttribute } from "react";

interface FormInputProps {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    autoComplete?: string;
    containerClassName?: string;
    disabled?: boolean;
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
    autoComplete,
    containerClassName = "mb-3",
    disabled = false,
    inputClassName = "form-control",
    labelClassName = "form-label",
    name,
    placeholder,
    required = false,
    type = "text",
}: FormInputProps) => {
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        onChange(event.target.value);
    };

    return (
        <div className={containerClassName}>
            <label className={labelClassName} htmlFor={id}>
                {label}
            </label>
            <input
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
