import {Link, Outlet} from "react-router";
import {useTranslation} from "react-i18next";

export const SiteLayout = () => {

    const {t} = useTranslation();

    return (
        <>
            <header>
                <nav>
                    <Link to="/">{t("navigation.home")}</Link>
                    {" | "}
                    <Link to="/artists">{t("navigation.artists")}</Link>
                    {" | "}
                    <Link to="/login">{t("navigation.login")}</Link>
                    {" | "}
                    <Link to="/admin">{t("navigation.admin")}</Link>
                </nav>
            </header>

            <main id="main-content">
                <Outlet/>
            </main>
        </>
    );
};