import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    RECORD_FORMAT_ICONS,
    RECORD_TYPE_ICONS,
    type RecordFormat,
    type RecordType,
} from "../constants";

interface RecordBadgesProps {
    format?: string | null;
    type?: string | null;
    className?: string;
}

export const RecordBadges = ({
    format,
    type,
    className = "",
}: RecordBadgesProps) => {
    const { t } = useTranslation();

    const hasFormat = Boolean(format && format in RECORD_FORMAT_ICONS);
    const formatIcon = hasFormat
        ? RECORD_FORMAT_ICONS[format as RecordFormat]
        : null;
    const hasType = Boolean(type && type in RECORD_TYPE_ICONS);
    const typeIcon = hasType ? RECORD_TYPE_ICONS[type as RecordType] : null;

    if (!format && !type) {
        return null;
    }

    return (
        <div className={`d-flex flex-wrap gap-2 ${className}`.trim()}>
            {format && (
                <span className="badge text-bg-secondary d-inline-flex align-items-center gap-1">
                    {formatIcon && <FontAwesomeIcon icon={formatIcon} />}
                    <span>
                        {hasFormat
                            ? t(`forms.formats.${format as RecordFormat}`)
                            : format}
                    </span>
                </span>
            )}

            {type && (
                <span className="badge text-bg-light border text-secondary d-inline-flex align-items-center gap-1">
                    {typeIcon && <FontAwesomeIcon icon={typeIcon} />}
                    <span>
                        {hasType
                            ? t(`forms.types.${type as RecordType}`)
                            : type}
                    </span>
                </span>
            )}
        </div>
    );
};
