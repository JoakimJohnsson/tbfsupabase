import {RouterProvider} from "react-router";
import {router} from "./router";
import {AuthProvider} from "../features/auth/AuthProvider.tsx";

export const App = () => {
    return (
        <AuthProvider>
            <RouterProvider router={router}/>
        </AuthProvider>
    );
};