import {Link, Outlet} from "react-router";

export const AdminLayout = () => {
    return (
        <>
            <header>
                <nav>
                    <Link to="/">TBF</Link>
                    {" | "}
                    <Link to="/admin">Admin</Link>
                    {" | "}
                    <Link to="/admin/artists">Artists</Link>
                </nav>
            </header>

            <main id="main-content">
                <Outlet/>
            </main>
        </>
    );
};