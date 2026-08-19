import {Navigate, Outlet, useLocation} from "react-router";
import {useAuth} from "../../features/auth/hooks/useAuth";
import SimpleSpinner from "../spinners/SimpleSpinner";

export const AuthenticatedLayout = () => {
    const {user, isLoading} = useAuth();
    const location = useLocation();

    if (isLoading) {
        return <SimpleSpinner/>;
    }

    if (!user) {
        return (
            <Navigate
                replace
                to="/login"
                state={{from: location}}
            />
        );
    }

    return <Outlet/>;
};