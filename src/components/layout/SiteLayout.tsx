import { useEffect, useRef, useState } from "react";
import { Link, NavLink, Outlet } from "react-router";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faHeart,
    faListMusic,
    faMoon,
    faRightFromBracket,
    faSun,
    faUser,
    faUserGear,
} from "@fortawesome/pro-solid-svg-icons";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { signOut } from "../../features/auth/api/signOut";
import { BottomPlayer } from "../../features/player/components/BottomPlayer";
import { ThemeToggle } from "../buttons/ThemeToggle";
import { useTheme } from "../../theme/theme";

export const SiteLayout = () => {
    const { t } = useTranslation();
    const { user, profile } = useAuth();
    const { theme, toggleTheme } = useTheme();

    // State for mobile navbar collapse
    const [isNavOpen, setIsNavOpen] = useState(false);

    // State for dropdown menus
    const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const adminDropdownRef = useRef<HTMLLIElement>(null);
    const userDropdownRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLElement>(null);

    // Close menus and dropdowns when clicking outside relevant areas
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const targetNode = event.target as Node;

            if (adminDropdownRef.current && !adminDropdownRef.current.contains(targetNode)) {
                setIsAdminMenuOpen(false);
            }

            if (userDropdownRef.current && !userDropdownRef.current.contains(targetNode)) {
                setIsUserMenuOpen(false);
            }

            if (headerRef.current && !headerRef.current.contains(targetNode)) {
                setIsNavOpen(false);
                setIsAdminMenuOpen(false);
                setIsUserMenuOpen(false);
            }
        };

        if (isAdminMenuOpen || isUserMenuOpen || isNavOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isAdminMenuOpen, isUserMenuOpen, isNavOpen]);

    // Close mobile nav when clicking a link
    const handleNavigation = () => {
        setIsNavOpen(false);
        setIsAdminMenuOpen(false);
        setIsUserMenuOpen(false);
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
            <header className="navbar navbar-expand-md border-bottom bg-body-tertiary px-3 py-2" ref={headerRef}>
                <div className="container-fluid">
                    <Link className="navbar-brand fw-bold me-4" onClick={handleNavigation} to="/">
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
                    <div className={`collapse navbar-collapse ${isNavOpen ? "show" : ""}`} id="topNavbarContent">
                        {/* Primary navigation links */}
                        <ul className="navbar-nav me-auto mb-2 mb-md-0 gap-1">
                            {/* Public artist browsing for all users */}
                            <li className="nav-item">
                                <NavLink className="nav-link" onClick={handleNavigation} to="/artists">
                                    {t("navigation.artists")}
                                </NavLink>
                            </li>

                            {/* Additional links for logged in members */}
                            {user && (
                                <>
                                    <li className="nav-item">
                                        <NavLink className="nav-link" onClick={handleNavigation} to="/records">
                                            {t("navigation.records")}
                                        </NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink className="nav-link" onClick={handleNavigation} to="/songs">
                                            {t("navigation.songs")}
                                        </NavLink>
                                    </li>
                                </>
                            )}

                            {/* Admin dropdown managed by React state */}
                            {profile?.is_admin && (
                                <li
                                    className={`nav-item dropdown ${isAdminMenuOpen ? "show" : ""}`}
                                    ref={adminDropdownRef}
                                >
                                    <button
                                        aria-expanded={isAdminMenuOpen}
                                        className={`nav-link dropdown-toggle btn btn-link text-decoration-none ${isAdminMenuOpen ? "show" : ""}`}
                                        id="adminDropdown"
                                        onClick={() => setIsAdminMenuOpen((prev) => !prev)}
                                        type="button"
                                    >
                                        {t("navigation.admin")}
                                    </button>
                                    <ul
                                        aria-labelledby="adminDropdown"
                                        className={`dropdown-menu shadow-sm ${isAdminMenuOpen ? "show" : ""}`}
                                    >
                                        <li>
                                            <Link className="dropdown-item" onClick={handleNavigation} to="/admin">
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
                                        <li>
                                            <Link
                                                className="dropdown-item"
                                                onClick={handleNavigation}
                                                to="/admin/persons"
                                            >
                                                {t("navigation.adminPersons")}
                                            </Link>
                                        </li>
                                    </ul>
                                </li>
                            )}
                        </ul>

                        {/* User actions and authentication state */}
                        <div className="d-flex align-items-center gap-3">
                            {user ? (
                                <div className="dropdown" ref={userDropdownRef}>
                                    <button
                                        aria-expanded={isUserMenuOpen}
                                        aria-haspopup="true"
                                        className={`btn btn-outline-secondary btn-sm dropdown-toggle${isUserMenuOpen ? " show" : ""}`}
                                        onClick={() => setIsUserMenuOpen((prev) => !prev)}
                                        type="button"
                                    >
                                        <FontAwesomeIcon aria-hidden="true" className="me-2" icon={faUser} />
                                        {profile?.display_name || user.email}
                                    </button>
                                    <ul
                                        className={`dropdown-menu dropdown-menu-end shadow-sm${isUserMenuOpen ? " show" : ""}`}
                                    >
                                        <li>
                                            <h6 className="dropdown-header">
                                                {user.email || t("navigation.userMenu")}
                                            </h6>
                                        </li>
                                        <li>
                                            <Link className="dropdown-item" onClick={handleNavigation} to="/profile">
                                                <FontAwesomeIcon
                                                    aria-hidden="true"
                                                    className="me-2"
                                                    icon={faUserGear}
                                                />
                                                {t("navigation.myProfile")}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link className="dropdown-item" onClick={handleNavigation} to="/playlists">
                                                <FontAwesomeIcon
                                                    aria-hidden="true"
                                                    className="me-2"
                                                    icon={faListMusic}
                                                />
                                                {t("navigation.myPlaylists")}
                                            </Link>
                                        </li>
                                        <li>
                                            <Link className="dropdown-item" onClick={handleNavigation} to="/favorites">
                                                <FontAwesomeIcon aria-hidden="true" className="me-2" icon={faHeart} />
                                                {t("navigation.favorites")}
                                            </Link>
                                        </li>
                                        <li>
                                            <hr className="dropdown-divider" />
                                        </li>
                                        <li>
                                            <button
                                                className="dropdown-item d-flex align-items-center justify-content-between gap-3"
                                                onClick={() => {
                                                    toggleTheme();
                                                    setIsUserMenuOpen(false);
                                                }}
                                                type="button"
                                            >
                                                <span>
                                                    <FontAwesomeIcon
                                                        aria-hidden="true"
                                                        className="me-2"
                                                        icon={theme === "dark" ? faSun : faMoon}
                                                    />
                                                    {t(theme === "dark" ? "theme.switchToLight" : "theme.switchToDark")}
                                                </span>
                                                <span className="badge text-bg-secondary">
                                                    {t(theme === "dark" ? "theme.dark" : "theme.light")}
                                                </span>
                                            </button>
                                        </li>
                                        <li>
                                            <hr className="dropdown-divider" />
                                        </li>
                                        <li>
                                            <button
                                                className="dropdown-item text-danger"
                                                onClick={() => void handleSignOut()}
                                                type="button"
                                            >
                                                <FontAwesomeIcon
                                                    aria-hidden="true"
                                                    className="me-2"
                                                    icon={faRightFromBracket}
                                                />
                                                {t("common.logout")}
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            ) : (
                                <>
                                    <ThemeToggle />
                                    <Link className="btn btn-primary btn-sm" onClick={handleNavigation} to="/login">
                                        {t("navigation.login")}
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Main application outlet */}
            <main className="container-fluid px-3 px-md-5 py-5 flex-grow-1" id="main-content">
                <Outlet />
            </main>
            <BottomPlayer />
        </div>
    );
};
