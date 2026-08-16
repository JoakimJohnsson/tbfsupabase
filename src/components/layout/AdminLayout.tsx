import {Link, Navigate, Outlet} from "react-router";
import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";
import {supabase} from "../../lib/supabase/client";
import {getProfile} from "../../features/auth/api/getProfile";
import {ADMIN_STATE, AdminState, Profile} from "../../types";
import {signOut} from "../../features/auth/api/signOut";

export const AdminLayout = () => {

    const {t} = useTranslation();

    const [adminState, setAdminState] = useState<AdminState>(ADMIN_STATE.LOADING);

    useEffect(() => {
        // Prevent state updates after unmount.
        let isMounted = true;
        // Store timeout id so it can be cleared in cleanup.
        let adminCheckTimeout: ReturnType<typeof setTimeout> | null = null;

        const checkAdmin = async (userId: string) => {
            try {
                const profile: Profile = await getProfile(userId);

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

        // Resolve admin access for a known authenticated user.
        // Keeps auth callback synchronous and delegates profile lookup.
        const resolveSession = (userId: string) => {
            // Show loading while we resolve admin rights from the profile.
            setAdminState(ADMIN_STATE.LOADING);

            // Run profile admin check after the auth callback to keep callback work minimal.
            // This ensures the supabase query - getProfile() - is run outside of auth callback.
            // Clear timeout before setting a new one.
            if (adminCheckTimeout) {
                clearTimeout(adminCheckTimeout);
            }
            adminCheckTimeout = setTimeout(() => {
                if (!isMounted) {
                    return;
                }

                void checkAdmin(userId);
            }, 0);
        };

        // Perform one explicit startup check so loading state is always resolved,
        // even if auth listener does not emit an initial session event.
        const initializeSession = async () => {
            const {data, error} = await supabase.auth.getSession();

            if (!isMounted) {
                return;
            }

            if (error || !data.session) {
                setAdminState(ADMIN_STATE.UNAUTHORIZED);
                return;
            }

            resolveSession(data.session.user.id);
        };

        // Listen to auth (login/logoff) changes.
        const {data: {subscription}} = supabase.auth.onAuthStateChange(
            (_event, session) => {

                // Early exit if not mounted.
                if (!isMounted) {
                    return;
                }

                // Early exit if no session - treat as unauthorized.
                if (!session) {
                    setAdminState(ADMIN_STATE.UNAUTHORIZED);
                    return;
                }

                resolveSession(session.user.id);
            },
        );

        void initializeSession();

        return () => {
            // Mark as unmounted and remove auth listener.
            isMounted = false;
            if (adminCheckTimeout !== null) {
                clearTimeout(adminCheckTimeout);
            }
            subscription.unsubscribe();
        };
    }, []);

    if (adminState === ADMIN_STATE.LOADING) {
        return <p>{t("common.loading")}</p>;
    }

    if (adminState === ADMIN_STATE.UNAUTHORIZED) {
        return <Navigate replace to="/login"/>;
    }

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
                    <Link className="me-2" to="/admin">{t("navigation.admin")}</Link>
                    <Link className="me-2" to="/admin/artists">{t("navigation.adminArtists")}</Link>
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
