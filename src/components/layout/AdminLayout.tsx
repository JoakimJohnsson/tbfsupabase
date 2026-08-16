import {Link, Navigate, Outlet} from "react-router";
import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";
import {supabase} from "../../lib/supabase/client";
import {getProfile} from "../../features/auth/api/getProfile";
import {ADMIN_STATE, AdminState, Profile} from "../../types";

export const AdminLayout = () => {

    const {t} = useTranslation();

    const [adminState, setAdminState] = useState<AdminState>(ADMIN_STATE.LOADING);

    useEffect(() => {
        let isMounted = true;

        const checkAdmin = async () => {
            const {data, error} = await supabase.auth.getSession();

            if (error || !data.session) {
                if (isMounted) {
                    setAdminState(ADMIN_STATE.UNAUTHORIZED);
                }
                return;
            }

            try {
                const profile: Profile = await getProfile(data.session.user.id);

                if (isMounted) {
                    setAdminState(
                        profile.is_admin
                            ? ADMIN_STATE.AUTHORIZED
                            : ADMIN_STATE.UNAUTHORIZED,
                    );
                }
            } catch (err) {
                console.error(err);
                if (isMounted) {
                    setAdminState(ADMIN_STATE.UNAUTHORIZED);
                }
            }
        };

        void checkAdmin();

        return () => {
            isMounted = false;
        };
    }, []);

    if (adminState === ADMIN_STATE.LOADING) {
        return <p>{t("common.loading")}</p>;
    }

    if (adminState === ADMIN_STATE.UNAUTHORIZED) {
        return <Navigate replace to="/login"/>;
    }

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
