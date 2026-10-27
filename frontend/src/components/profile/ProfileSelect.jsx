import { useDispatch, useSelector } from "react-redux";
import { setActiveProfile, setProfiles, deleteProfileInList } from "../../slices/profileSlice";
import { useNavigate } from "react-router";
import getAllActiveMovie from "../../axios/getAllActiveMovieAPI";
import { upsertManyMovies } from "../../slices/movieSlice";
import getAllActiveSeries from "../../axios/getAllActiveSeriesAPI";
import { upsertManySeries } from "../../slices/seriesSlice";
import { useEffect } from "react";
import getAllActiveGenre from "../../axios/getAllActiveGenre";
import { genreFail, genreSuccess, genreLoading } from "../../slices/genreSlice";
import getAllProfile from "../../axios/getAllProfile";
import deleteProfileAPI from "../../axios/deleteProfile";
import toast from "react-hot-toast";

export default function ProfileSelect() {
  const { profiles } = useSelector((state) => state.profile);
  const { user } = useSelector((state) => state.auth);
  const data = profiles
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const hasProfiles = data?.length > 0;

useEffect(() => {
    getAllProfile()
    .then((res) => {
        dispatch(setProfiles(res));
    })
    .catch((err) => {
        console.log(err);
    })
}, [dispatch])


  useEffect(() => {
    const fetchGenres = async () => {
      try {
        dispatch(genreLoading());
        const res = await getAllActiveGenre();
        dispatch(genreSuccess(res));
      } catch (error) {
        dispatch(genreFail(error.message));
      }
    };

    fetchGenres();
  }, [dispatch]);

  const handleClick = async (profile) => {
    dispatch(setActiveProfile(profile));
  
    const movies = await getAllActiveMovie(profile._id);
    dispatch(upsertManyMovies(movies));
  
    const series = await getAllActiveSeries(profile._id);
    dispatch(upsertManySeries(series));
    navigate(`/${profile._id}/movies`);
  };
  

  const createProfile = () => {
    navigate("/create-profile");
  };

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center">
      <h1 className="mb-12 text-3xl font-medium text-white md:text-5xl">Who's watching?</h1>
      
      <div className="flex flex-wrap items-center justify-center gap-8">
        {hasProfiles &&
          data.map((profile) => (
            <div key={profile._id} className="flex flex-col items-center gap-4">
               <div 
                   onClick={() => handleClick(profile)}
                   className="group flex flex-col items-center gap-4 cursor-pointer transition-transform hover:scale-105"
               >
                 <div className="h-24 w-24 overflow-hidden rounded-md border-2 border-transparent group-hover:border-white md:h-32 md:w-32">
                     <img
                       src={profile.avatar}
                       alt={profile.name}
                       className="h-full w-full object-cover"
                     />
                 </div>
                 <h3 className="text-lg text-neutral-400 group-hover:text-white md:text-xl">{profile.name}</h3>
               </div>
               <button 
                 onClick={async (e) => {
                   e.stopPropagation();
                   if (window.confirm("Are you sure you want to delete this profile?")) {
                     try {
                       await deleteProfileAPI(profile._id);
                       dispatch(deleteProfileInList(profile._id));
                       toast.success("Profile removed");
                     } catch (error) {
                       toast.error("Failed to remove profile");
                     }
                   }
                 }}
                 className="text-sm text-red-500 hover:text-red-400 transition-colors"
               >
                 Remove Profile
               </button>
            </div>
        ))}
        
        <div 
            onClick={createProfile}
            className="group flex flex-col items-center gap-4 cursor-pointer transition-transform hover:scale-105"
        >
             <div className="flex h-24 w-24 items-center justify-center rounded-md border-2 border-neutral-700 bg-neutral-800 text-neutral-400 group-hover:border-white group-hover:text-white md:h-32 md:w-32">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
             </div>
            <h3 className="text-lg text-neutral-400 group-hover:text-white md:text-xl">Add Profile</h3>
        </div>
      </div>
    </div>
  );
}
