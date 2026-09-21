import { useTranslation } from "react-i18next";

export const RecordsPage = () => {
    const { t } = useTranslation();

    return (
        <div className="container-fluid">
            <h1 className="mb-4">{t("features.records.title")}</h1>
        </div>
    );
};
