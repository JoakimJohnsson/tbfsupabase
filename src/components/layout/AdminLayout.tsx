import { Navigate, Outlet } from "react-router";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { SimpleSpinner } from "../spinners";

export const AdminLayout = () => {
    const { user, profile, isLoading } = useAuth();

    if (isLoading) {
        return <SimpleSpinner />;
    }

    if (!user) {
        return <Navigate replace to="/login" />;
    }

    if (!profile?.is_admin) {
        return <Navigate replace to="/" />;
    }

    return <Outlet />;
};
