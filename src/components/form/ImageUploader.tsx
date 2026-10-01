import { ChangeEvent, useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faTrashCan, faUpload } from "@fortawesome/pro-solid-svg-icons";
import { useTranslation } from "react-i18next";
import { ToolButton } from "../buttons";

interface ImageUploaderProps {
    id: string;
    label: string;
    currentImageUrl?: string | null;
    onFileSelect: (file: File | null) => void;
    selectedFile: File | null;
    onRemoveCurrent?: () => void;
    disabled?: boolean;
}

export const ImageUploader = ({
    id,
    label,
    currentImageUrl,
    onFileSelect,
    selectedFile,
    onRemoveCurrent,
    disabled = false,
}: ImageUploaderProps) => {
    const { t } = useTranslation();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl ?? null);

    useEffect(() => {
        if (!selectedFile) {
            setPreviewUrl(currentImageUrl ?? null);
            return;
        }

        const objectUrl = URL.createObjectURL(selectedFile);
        setPreviewUrl(objectUrl);

        return () => {
            URL.revokeObjectURL(objectUrl);
        };
    }, [selectedFile, currentImageUrl]);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        onFileSelect(file);
    };

    const handleClear = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        onFileSelect(null);
        if (onRemoveCurrent) {
            onRemoveCurrent();
        }
    };

    return (
        <div className="tbf-image-uploader mb-3">
            <label className="form-label" htmlFor={id}>
                {label}
            </label>

            <div className="tbf-image-uploader__content">
                {previewUrl ? (
                    <div className="tbf-image-uploader__preview">
                        <img
                            alt={t("forms.imagePreviewAlt")}
                            className="tbf-image-uploader__image img-thumbnail"
                            src={previewUrl}
                        />
                    </div>
                ) : (
                    <div className="tbf-image-uploader__placeholder">
                        <FontAwesomeIcon icon={faImage} size="xl" />
                    </div>
                )}

                <div className="tbf-image-uploader__body">
                    <div className="tbf-image-uploader__actions">
                        <ToolButton
                            icon={faUpload}
                            onClick={() => fileInputRef.current?.click()}
                            disabled={disabled}
                            variant="outline-secondary"
                            size="sm"
                            text={previewUrl ? t("forms.changeImage") : t("forms.uploadImage")}
                        />
                        {(selectedFile || currentImageUrl) && (
                            <ToolButton
                                icon={faTrashCan}
                                onClick={handleClear}
                                disabled={disabled}
                                variant="outline-danger"
                                size="sm"
                                text={t("common.delete")}
                            />
                        )}
                    </div>

                    <span className="tbf-image-uploader__meta">{t("forms.imageUploadHelp")}</span>
                </div>
            </div>

            <input
                accept="image/jpeg,image/png,image/webp"
                className="d-none"
                disabled={disabled}
                id={id}
                onChange={handleFileChange}
                ref={fileInputRef}
                type="file"
            />
        </div>
    );
};
