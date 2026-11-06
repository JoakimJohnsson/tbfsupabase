import { RouterProvider } from "react-router";
import { router } from "./router";
import { AuthProvider } from "../features/auth/AuthProvider";
import { PlayerProvider } from "../features/player/PlayerProvider";

export const App = () => {
    return (
        <AuthProvider>
            <PlayerProvider>
                <RouterProvider router={router} />
            </PlayerProvider>
        </AuthProvider>
    );
};
