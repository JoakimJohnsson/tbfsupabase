import {createBrowserRouter} from "react-router";
import {AdminArtistsPage} from "../features/admin/pages/AdminArtistsPage";
import {AdminPage} from "../features/admin/pages/AdminPage";
import {ArtistPage} from "../features/artists/pages/ArtistPage";
import {ArtistsPage} from "../features/artists/pages/ArtistsPage";
import {LoginPage} from "../features/auth/pages/LoginPage";
import {HomePage} from "../features/home/pages/HomePage.tsx";
import {NotFoundPage} from "../features/notfound/pages/NotFoundPage.tsx";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <HomePage/>,
    },
    {
        path: "/artists",
        element: <ArtistsPage/>,
    },
    {
        path: "/artists/:artistSlug",
        element: <ArtistPage/>,
    },
    {
        path: "/login",
        element: <LoginPage/>,
    },
    {
        path: "/admin",
        element: <AdminPage/>,
    },
    {
        path: "/admin/artists",
        element: <AdminArtistsPage/>,
    },
    {
        path: "*",
        element: <NotFoundPage/>,
    },
]);

