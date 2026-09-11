import type { ChangeEvent } from "react";

interface FormTextAreaProps {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    containerClassName?: string;
    disabled?: boolean;
    labelClassName?: string;
    name?: string;
    required?: boolean;
    rows?: number;
    textAreaClassName?: string;
}

export const FormTextArea = ({
    id,
    label,
    value,
    onChange,
    containerClassName = "mb-3",
    disabled = false,
    labelClassName = "form-label",
    name,
    required = false,
    rows = 3,
    textAreaClassName = "form-control",
}: FormTextAreaProps) => {
    const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        onChange(event.target.value);
    };

    return (
        <div className={containerClassName}>
            <label className={labelClassName} htmlFor={id}>
                {label}
            </label>
            <textarea
                className={textAreaClassName}
                disabled={disabled}
                id={id}
                name={name ?? id}
                onChange={handleChange}
                required={required}
                rows={rows}
                value={value}
            />
        </div>
    );
};
