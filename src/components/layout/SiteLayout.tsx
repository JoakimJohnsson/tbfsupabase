import {Outlet} from "react-router";

export const SiteLayout = () => {
    return (
        <>
            <header>
                TBF site header - if we want
            </header>

            <main id="main-content">
                <Outlet/>
            </main>
        </>
    );
};