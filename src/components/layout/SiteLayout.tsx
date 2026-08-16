import {Link, Outlet} from "react-router";
import {useTranslation} from "react-i18next";

export const SiteLayout = () => {

    const {t} = useTranslation();

    return (
        <>
            <header>
                <nav>
                    <Link className="me-2" to="/">{t("navigation.home")}</Link>
                    <Link className="me-2" to="/artists">{t("navigation.artists")}</Link>
                    <Link className="me-2" to="/login">{t("navigation.login")}</Link>
                    <Link to="/admin">{t("navigation.admin")}</Link>
                </nav>
            </header>

            <main id="main-content">
                <Outlet/>
            </main>
        </>
    );
};
