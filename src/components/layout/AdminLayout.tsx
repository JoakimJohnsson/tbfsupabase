import {useTranslation} from "react-i18next";
import {Link, Navigate, Outlet} from "react-router";
import {signOut} from "../../features/auth/api/signOut";
import {useAuth} from "../../features/auth/hooks/useAuth.ts";

export const AdminLayout = () => {
    const {t} = useTranslation();
    const {user, profile, isLoading} = useAuth();

    if (isLoading) {
        return <p>{t("common.loading")}</p>;
    }

    if (!user || !profile?.is_admin) {
        return <Navigate replace to="/login"/>;
    }



    return (
        <>
            <header>
                <nav className="d-flex align-items-center">
                    <Link className="me-2" to="/">
                        {t("navigation.home")}
                    </Link>

                    <Link className="me-2" to="/admin">
                        {t("navigation.admin")}
                    </Link>

                    <Link className="me-2" to="/admin/artists">
                        {t("navigation.adminArtists")}
                    </Link>
                </nav>
            </header>

            <main id="main-content">
                <Outlet/>
            </main>
        </>
    );
};