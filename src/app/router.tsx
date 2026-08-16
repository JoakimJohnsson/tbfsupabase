import {createBrowserRouter} from "react-router";
import {AdminLayout} from "../components/layout/AdminLayout";
import {AuthenticatedLayout} from "../components/layout/AuthenticatedLayout";
import {SiteLayout} from "../components/layout/SiteLayout";
import {AdminArtistsPage} from "../features/admin/pages/AdminArtistsPage";
import {AdminPage} from "../features/admin/pages/AdminPage";
import {ArtistPage} from "../features/artists/pages/ArtistPage";
import {ArtistsPage} from "../features/artists/pages/ArtistsPage";
import {LoginPage} from "../features/auth/pages/LoginPage";
import {HomePage} from "../features/home/pages/HomePage";
import {NotFoundPage} from "../features/notfound/pages/NotFoundPage";

export const router = createBrowserRouter([
    {
        element: <SiteLayout/>,
        children: [
            {
                index: true,
                element: <HomePage/>,
            },
            {
                path: "login",
                element: <LoginPage/>,
            },
            {
                element: <AuthenticatedLayout/>,
                children: [
                    {
                        path: "artists",
                        element: <ArtistsPage/>,
                    },
                    {
                        path: "artists/:artistSlug",
                        element: <ArtistPage/>,
                    },
                ],
            },
            {
                path: "*",
                element: <NotFoundPage/>,
            },
        ],
    },
    {
        path: "admin",
        element: <AdminLayout/>,
        children: [
            {
                index: true,
                element: <AdminPage/>,
            },
            {
                path: "artists",
                element: <AdminArtistsPage/>,
            },
        ],
    },
]);