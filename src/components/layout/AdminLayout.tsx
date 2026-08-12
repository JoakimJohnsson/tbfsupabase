import {Outlet} from "react-router";

export const AdminLayout = () => {
    return (
        <>
            <header>
                TBF Admin header - if we want
            </header>

            <main id="main-content">
                <Outlet/>
            </main>
        </>
    );
};