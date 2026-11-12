import { RouterProvider } from "react-router";
import { router } from "./router";
import { AuthProvider } from "../features/auth/AuthProvider";
import { PlayerProvider } from "../features/player/PlayerProvider";
import { FavoritesProvider } from "../features/favorites/FavoritesProvider";

export const App = () => {
    return (
        <AuthProvider>
            <FavoritesProvider>
                <PlayerProvider>
                    <RouterProvider router={router} />
                </PlayerProvider>
            </FavoritesProvider>
        </AuthProvider>
    );
};
