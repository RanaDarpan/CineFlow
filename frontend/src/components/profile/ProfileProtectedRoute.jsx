import { useSelector } from "react-redux";
import { Navigate } from "react-router";

export default function ProfileProtectedRoute({ children }) {
    const { loading, activeProfile } = useSelector(state => state.profile);

    if (loading)
        return <div>Loading...</div>;

    if (activeProfile === null)
        return <Navigate to="/profile-select" />;

    return children;
}