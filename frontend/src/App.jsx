import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { authSuccess, authFail, authLoading } from "./slices/authSlice";
import { setProfiles, clearProfiles } from "./slices/profileSlice";
import { genreFail, genreLoading, genreSuccess } from "./slices/genreSlice";
import getUser from "./axios/getUser";
import getAllProfile from "./axios/getAllProfile";
import getAllGenre from "./axios/getAllGenre";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Outlet } from "react-router";

export default function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state => state.auth);

  useEffect(() => {
    const bootstrap = async () => {
      try {
       

        const res = await getUser();
        dispatch(authSuccess(res.data));
      } catch (err) {
        console.log("Error: ", err)
        if(err.response.status === 401 || err.response.status === 403){
            dispatch(authFail());
        }
      }
    };

    bootstrap();
  }, [dispatch]);

  useEffect(() => {
    if (!isAuthenticated) return;
    
    const fetchProfiles = async () => {
      try {
        dispatch(genreLoading());
        const genres = await getAllGenre();
        console.log(genres)
        dispatch(genreSuccess(genres)); 

        const profiles = await getAllProfile();
        dispatch(setProfiles(profiles));
      } catch (err) {
        console.error("Failed to fetch profiles/genres", err);
        // dispatch(clearProfiles()); // Don't clear profiles immediately on partial failure, let persistence hold.
        dispatch(genreFail(err.message));
      }
    };

    fetchProfiles();
  }, [isAuthenticated, dispatch]);

  return (
    <div className="flex min-h-screen flex-col bg-[#0a0a0a] text-neutral-200 font-sans">
      <Toaster position="top-right" />
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
