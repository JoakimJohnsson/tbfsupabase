import {createBrowserRouter} from "react-router";
import {AdminArtistsPage} from "../features/admin/pages/AdminArtistsPage";
import {AdminPage} from "../features/admin/pages/AdminPage";
import {ArtistPage} from "../features/artists/pages/ArtistPage";
import {ArtistsPage} from "../features/artists/pages/ArtistsPage";
import {LoginPage} from "../features/auth/pages/LoginPage";

const HomePage = () => {
    return (
        <main id="home-page">
            <h1>TBF</h1>
            <p>Home page placeholder.</p>
        </main>
    );
};

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
]);

