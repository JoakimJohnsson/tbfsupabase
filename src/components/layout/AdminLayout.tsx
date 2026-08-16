import {Link, Navigate, Outlet} from "react-router";
import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";
import {supabase} from "../../lib/supabase/client";
import {getProfile} from "../../features/auth/api/getProfile";
import {ADMIN_STATE, AdminState, Profile} from "../../types";
import {signOut} from "../../features/auth/api/signOut";
import {useMountedRef} from "../../lib/hooks/useMountedRef";
import {useLatestRequestGuard} from "../../lib/hooks/useLatestRequestGuard";

export const AdminLayout = () => {

    const {t} = useTranslation();
    const isMountedRef = useMountedRef();
    const {beginRequest, isLatestRequest} = useLatestRequestGuard();

    const [adminState, setAdminState] = useState<AdminState>(ADMIN_STATE.LOADING);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        // Track session on startup and on auth changes.
        let applySessionTimeout: ReturnType<typeof setTimeout> | null = null;

        const applySession = (sessionUserId: string | null) => {
            if (!isMountedRef.current) {
                return;
            }

            if (!sessionUserId) {
                setUserId(null);
                setAdminState(ADMIN_STATE.UNAUTHORIZED);
                return;
            }

            setUserId(sessionUserId);
            setAdminState(ADMIN_STATE.LOADING);
        };

        const initializeSession = async () => {
            const {data, error} = await supabase.auth.getSession();

            if (!isMountedRef.current) {
                return;
            }

            if (error || !data.session) {
                applySession(null);
                return;
            }

            applySession(data.session.user.id);
        };

        // Listen to auth changes.
        const {data: {subscription}} = supabase.auth.onAuthStateChange(
            (_event, session) => {
                // Defer writes so callback stays lightweight.
                if (applySessionTimeout !== null) {
                    clearTimeout(applySessionTimeout);
                }

                applySessionTimeout = setTimeout(() => {
                    applySession(session?.user.id ?? null);
                }, 0);
            },
        );

        void initializeSession();

        return () => {
            if (applySessionTimeout !== null) {
                clearTimeout(applySessionTimeout);
            }

            subscription.unsubscribe();
        };
    }, []);

    useEffect(() => {
        // Resolve admin role whenever an authenticated user id is available.
        if (!userId) {
            return;
        }

        // Use request ids so only the latest profile lookup can update state.
        const requestId = beginRequest();

        const resolveAdminState = async () => {
            try {
                const profile: Profile = await getProfile(userId);

                if (!isMountedRef.current || !isLatestRequest(requestId)) {
                    return;
                }

                setAdminState(
                    profile.is_admin
                        ? ADMIN_STATE.AUTHORIZED
                        : ADMIN_STATE.UNAUTHORIZED,
                );
            } catch (err) {
                console.error(err);

                if (!isMountedRef.current || !isLatestRequest(requestId)) {
                    return;
                }

                setAdminState(ADMIN_STATE.UNAUTHORIZED);
            }
        };

        void resolveAdminState();
    }, [beginRequest, isLatestRequest, isMountedRef, userId]);

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
