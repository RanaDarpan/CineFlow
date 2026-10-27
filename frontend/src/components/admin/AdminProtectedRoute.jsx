import { useSelector } from "react-redux";
import { Navigate } from "react-router";

export default function AdminProtectedRoute({ children }) {
  const user = useSelector(state => state.auth.user);

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.type !== "true") {
    return <Navigate to="/not-authorized" />;
  }

  return children;
}
