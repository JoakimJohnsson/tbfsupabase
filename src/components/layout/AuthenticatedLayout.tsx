import {useTranslation} from "react-i18next";
import {Navigate, Outlet} from "react-router";
import {useAuth} from "../../features/auth/hooks/useAuth";

export const AuthenticatedLayout = () => {
    const {t} = useTranslation();
    const {user, isLoading} = useAuth();

    if (isLoading) {
        return <p>{t("common.loading")}</p>;
    }

    if (!user) {
        return <Navigate replace to="/login"/>;
    }

    return <Outlet/>;
};