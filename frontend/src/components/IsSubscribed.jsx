import { useSelector } from "react-redux";
import { Navigate } from "react-router";

export default function IsSubscribed({ children }) {
    const { user } = useSelector((state) => state.auth);

    if (!user || !user.subscription) {
        return <Navigate to="/subscriptions" />;
    }

    const { status, e_date, s_date } = user.subscription;
    const now = new Date();

    const endDate = new Date(e_date);
    const startDate = new Date(s_date);

    const isAdmin = user.type === true;
    const isActive = status && endDate > now && startDate <= now;

    if (isAdmin || isActive) {
        return children;
    } else {
        return <Navigate to="/subscriptions" />;
    }
}