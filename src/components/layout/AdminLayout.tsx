import {Link, Outlet} from "react-router";
import {useTranslation} from "react-i18next";

export const AdminLayout = () => {

    const {t} = useTranslation();

    return (
        <>
            <header>
                <nav>
                    <Link to="/">{t("navigation.home")}</Link>
                    {" | "}
                    <Link to="/admin">{t("navigation.admin")}</Link>
                    {" | "}
                    <Link to="/admin/artists">{t("navigation.adminArtists")}</Link>
                </nav>
            </header>

            <main id="main-content">
                <Outlet/>
            </main>
        </>
    );
};