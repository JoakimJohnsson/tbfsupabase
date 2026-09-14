import { useTranslation } from "react-i18next";

export const SongsPage = () => {
    const { t } = useTranslation();

    return (
        <div className="container-fluid">
            <h1 className="mb-4">{t("features.songs.title")}</h1>
        </div>
    );
};
