import {useTranslation} from "react-i18next";
import {Link, Navigate, Outlet} from "react-router";
import {useAuth} from "../../features/auth/hooks/useAuth";
import SimpleSpinner from "../spinners/SimpleSpinner";

export const AdminLayout = () => {
    const {t} = useTranslation();
    const {user, profile, isLoading} = useAuth();

    if (isLoading) {
        return <SimpleSpinner/>;
    }

    // Not logged in...
    if (!user) {
        return <Navigate replace to="/login"/>;
    }

    // Logged in, but not admin...
    if (!profile?.is_admin) {
        return <Navigate replace to="/"/>;
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