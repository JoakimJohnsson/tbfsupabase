import { createBrowserRouter } from "react-router";
import { AdminLayout } from "../components/layout/AdminLayout";
import { AuthenticatedLayout } from "../components/layout/AuthenticatedLayout";
import { SiteLayout } from "../components/layout/SiteLayout";
import { AdminArtistsPage } from "../features/admin/pages/AdminArtistsPage";
import { AdminPage } from "../features/admin/pages/AdminPage";
import { ArtistPage } from "../features/artists/pages/ArtistPage";
import { ArtistsPage } from "../features/artists/pages/ArtistsPage";
import { LoginPage } from "../features/auth/pages/LoginPage";
import { HomePage } from "../features/home/pages/HomePage";
import { NotFoundPage } from "../features/notfound/pages/NotFoundPage";
import { AdminArtistPage } from "../features/admin/pages/AdminArtistPage";
import { AdminRecordsPage } from "../features/admin/pages/AdminRecordsPage";
import { RecordsPage } from "../features/records/pages/RecordsPage";
import { SongsPage } from "../features/songs/pages/SongsPage";

export const router = createBrowserRouter([
    {
        // Global layout shell with top header navigation for all views
        element: <SiteLayout />,
        children: [
            // Public routes accessible to all visitors
            {
                index: true,
                element: <HomePage />,
            },
            {
                path: "login",
                element: <LoginPage />,
            },
            {
                path: "artists",
                element: <ArtistsPage />,
            },
            {
                path: "artists/:artistSlug",
                element: <ArtistPage />,
            },

            // Protected member routes requiring authenticated session
            {
                element: <AuthenticatedLayout />,
                children: [
                    {
                        path: "records",
                        element: <RecordsPage />,
                    },
                    {
                        path: "songs",
                        element: <SongsPage />,
                    },
                ],
            },

            // Protected administration routes requiring admin privileges
            {
                path: "admin",
                element: <AdminLayout />,
                children: [
                    {
                        index: true,
                        element: <AdminPage />,
                    },
                    {
                        path: "artists",
                        element: <AdminArtistsPage />,
                    },
                    {
                        path: "artists/:artistSlug",
                        element: <AdminArtistPage />,
                    },
                    {
                        path: "records",
                        element: <AdminRecordsPage />,
                    },
                ],
            },

            // Catch-all route for non-existent paths
            {
                path: "*",
                element: <NotFoundPage />,
            },
        ],
    },
]);
