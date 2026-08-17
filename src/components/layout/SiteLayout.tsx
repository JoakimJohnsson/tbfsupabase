import {Link, Outlet} from "react-router";
import {useTranslation} from "react-i18next";
import {signOut} from "../../features/auth/api/signOut.ts";

export const SiteLayout = () => {

    const {t} = useTranslation();

    const handleSignOut = async () => {
        try {
            await signOut();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
            <header>
                <nav className="d-flex align-items-center">
                    <Link className="me-2" to="/">{t("navigation.home")}</Link>
                    <Link className="me-2" to="/artists">{t("navigation.artists")}</Link>
                    <Link className="me-2" to="/login">{t("navigation.login")}</Link>
                    <Link className="me-2" to="/admin">{t("navigation.admin")}</Link>
                    <button
                        className="btn btn-link p-0"
                        onClick={() => {
                            void handleSignOut();
                        }}
                        type="button"
                    >
                        {t("common.logout")}
                    </button>
                </nav>

            </header>

            <main id="main-content">
                <Outlet/>
            </main>
        </>
    );
};
