import {useTranslation} from "react-i18next";
import {Navigate, Outlet, useLocation} from "react-router";
import {useAuth} from "../../features/auth/hooks/useAuth";

export const AuthenticatedLayout = () => {
    const {t} = useTranslation();
    const {user, isLoading} = useAuth();
    const location = useLocation();

    if (isLoading) {
        return <p>{t("common.loading")}</p>;
    }

    if (!user) {
        return (
            <Navigate
                replace
                to="/login"
                state={{from: location}}
            />
        );
    }

    return <Outlet/>;
};