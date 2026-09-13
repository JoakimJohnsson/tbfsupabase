import { useEffect, useRef, useState } from "react";
import { Link, NavLink, Outlet } from "react-router";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { signOut } from "../../features/auth/api/signOut";

export const SiteLayout = () => {
    const { t } = useTranslation();
    const { user, profile } = useAuth();

    // State for mobile navbar collapse
    const [isNavOpen, setIsNavOpen] = useState(false);

    // State for admin dropdown menu
    const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
    const dropdownRef = useRef<HTMLLIElement>(null);

    // Close admin dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsAdminMenuOpen(false);
            }
        };

        if (isAdminMenuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isAdminMenuOpen]);

    // Close mobile nav when clicking a link
    const handleNavigation = () => {
        setIsNavOpen(false);
        setIsAdminMenuOpen(false);
    };

    const handleSignOut = async () => {
        try {
            await signOut();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="d-flex flex-column min-vh-100">
            {/* Main Header / Top Navigation */}
            <header className="navbar navbar-expand-md border-bottom bg-body-tertiary px-3 py-2">
                <div className="container-fluid">
                    <Link
                        className="navbar-brand fw-bold me-4"
                        onClick={handleNavigation}
                        to="/"
                    >
                        The Baseball Field
                    </Link>

                    {/* Mobile toggle button */}
                    <button
                        aria-controls="topNavbarContent"
                        aria-expanded={isNavOpen}
                        aria-label="Toggle navigation"
                        className="navbar-toggler"
                        onClick={() => setIsNavOpen((prev) => !prev)}
                        type="button"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    {/* Responsive collapsible container */}
                    <div
                        className={`collapse navbar-collapse ${isNavOpen ? "show" : ""}`}
                        id="topNavbarContent"
                    >
                        {/* Primary navigation links */}
                        <ul className="navbar-nav me-auto mb-2 mb-md-0 gap-1">
                            <li className="nav-item">
                                <NavLink
                                    className="nav-link"
                                    onClick={handleNavigation}
                                    to="/"
                                >
                                    {t("navigation.home")}
                                </NavLink>
                            </li>

                            {/* Public artist browsing for all users */}
                            <li className="nav-item">
                                <NavLink
                                    className="nav-link"
                                    onClick={handleNavigation}
                                    to="/artists"
                                >
                                    {t("navigation.artists")}
                                </NavLink>
                            </li>

                            {/* Additional links for logged in members */}
                            {user && (
                                <>
                                    <li className="nav-item">
                                        <NavLink
                                            className="nav-link"
                                            onClick={handleNavigation}
                                            to="/records"
                                        >
                                            {t("navigation.records")}
                                        </NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink
                                            className="nav-link"
                                            onClick={handleNavigation}
                                            to="/songs"
                                        >
                                            {t("navigation.songs")}
                                        </NavLink>
                                    </li>
                                </>
                            )}

                            {/* Admin dropdown managed by React state */}
                            {profile?.is_admin && (
                                <li
                                    className={`nav-item dropdown ${isAdminMenuOpen ? "show" : ""}`}
                                    ref={dropdownRef}
                                >
                                    <button
                                        aria-expanded={isAdminMenuOpen}
                                        className={`nav-link dropdown-toggle btn btn-link text-decoration-none ${isAdminMenuOpen ? "show" : ""}`}
                                        id="adminDropdown"
                                        onClick={() =>
                                            setIsAdminMenuOpen((prev) => !prev)
                                        }
                                        type="button"
                                    >
                                        {t("navigation.admin")}
                                    </button>
                                    <ul
                                        aria-labelledby="adminDropdown"
                                        className={`dropdown-menu shadow-sm ${isAdminMenuOpen ? "show" : ""}`}
                                    >
                                        <li>
                                            <Link
                                                className="dropdown-item"
                                                onClick={handleNavigation}
                                                to="/admin"
                                            >
                                                {t("navigation.admin")}
                                            </Link>
                                        </li>
                                        <li>
                                            <hr className="dropdown-divider" />
                                        </li>
                                        <li>
                                            <Link
                                                className="dropdown-item"
                                                onClick={handleNavigation}
                                                to="/admin/artists"
                                            >
                                                {t("navigation.adminArtists")}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                className="dropdown-item"
                                                onClick={handleNavigation}
                                                to="/admin/records"
                                            >
                                                {t("navigation.adminRecords")}
                                            </Link>
                                        </li>
                                    </ul>
                                </li>
                            )}
                        </ul>

                        {/* User actions and authentication state */}
                        <div className="d-flex align-items-center gap-3">
                            {user ? (
                                <div className="d-flex align-items-center gap-2">
                                    <span className="small text-muted">
                                        {profile?.display_name || user.email}
                                    </span>
                                    <button
                                        className="btn btn-outline-secondary btn-sm"
                                        onClick={() => void handleSignOut()}
                                        type="button"
                                    >
                                        {t("common.logout")}
                                    </button>
                                </div>
                            ) : (
                                <Link
                                    className="btn btn-primary btn-sm"
                                    onClick={handleNavigation}
                                    to="/login"
                                >
                                    {t("navigation.login")}
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Main application outlet */}
            <div className="container-fluid py-4 flex-grow-1">
                <Outlet />
            </div>
        </div>
    );
};
