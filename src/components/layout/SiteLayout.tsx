import {Link, Outlet} from "react-router";

export const SiteLayout = () => {
    return (
        <>
            <header>
                <nav>
                    <Link to="/">Home</Link>
                    {" | "}
                    <Link to="/artists">Artists</Link>
                    {" | "}
                    <Link to="/login">Login</Link>
                    {" | "}
                    <Link to="/admin">Admin</Link>
                </nav>
            </header>

            <main id="main-content">
                <Outlet/>
            </main>
        </>
    );
};