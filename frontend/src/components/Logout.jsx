import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import logout from "../axios/logout";
import { clearProfiles } from "../slices/profileSlice";
import { authFail } from "../slices/authSlice";
import { persistor } from "../store/store";
import { resetToDefault } from "../slices/movieSlice";

export default function Logout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    await persistor.purge();
    dispatch(authFail());
    dispatch(clearProfiles());
    dispatch(resetToDefault())
    navigate("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="inline-block px-6 py-2 hover:bg-red-200 rounded-full"
    >
      Logout
    </button>
  );
}
