import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectActiveMovies, setActiveMovies } from "../../slices/movieSlice";
import Button from "../Button";
import { useNavigate, Link } from "react-router";
import getAllActiveMovie from "../../axios/getAllActiveMovieAPI";
import { selectGenreById } from "../../slices/genreSlice";

export default function Movie() {
  const activeProfile = useSelector((state) => state.profile.activeProfile);
  const { user, loading: authLoading } = useSelector((state) => state.auth);
  const activeMovies = useSelector(selectActiveMovies) || [];
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loadingMovies, setLoadingMovies] = useState(true);

  if (authLoading || !activeProfile) return <div>Loading...</div>;

  const userData = user?.user || user;
  const type = userData?.type;
  const profile_id = activeProfile?._id;
  if (!profile_id) return <div>No profile selected</div>;

  useEffect(() => {
    const fetchActiveMovies = async () => {
      try {
        if (!activeMovies || activeMovies.length === 0) {
          const res = await getAllActiveMovie(profile_id);
          if (res && res.length > 0) {
            dispatch(setActiveMovies(res));
          }
        }
      } catch (error) {
        console.error("Error fetching active movies:", error);
      } finally {
        setLoadingMovies(false);
      }
    };
    fetchActiveMovies();
  }, [dispatch, profile_id]);

  const genreNameById = useSelector((state) => {
    const map = {};
    activeMovies.forEach((m) => {
      m.genres?.forEach((id) => {
        if (!map[id]) {
          map[id] = selectGenreById(state, id);
        }
      });
    });
    return map; 
  });

  if (loadingMovies) return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
      </div>
  );

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      {type && (
        <div className="flex justify-end gap-2 mb-8">
          <Button variant="secondary" onClick={() => navigate(`/${profile_id}/movies/add-movies`)}>
            Add Movie
          </Button>
          <Button variant="ghost" onClick={() => navigate(`/${profile_id}/movies/all-movies`)}>
            All Movies
          </Button>
        </div>
      )}

      <div className="mx-auto max-w-7xl">
        <h2 className="mb-6 text-xl font-semibold text-white md:text-2xl">Movies</h2>
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:gap-x-8">
            {activeMovies
              .filter((g) => g && g._id)
              .map((movie) => (
                <Link
                  key={movie._id}
                  to={`/${profile_id}/movies/${movie._id}`}
                  className="group relative flex flex-col gap-2"
                >
                  <div className="aspect-[2/3] w-full overflow-hidden rounded-md bg-neutral-800 transition-transform duration-300 group-hover:scale-105 group-hover:shadow-xl group-hover:shadow-black/50">
                    <img
                      src={movie.thumbnail}
                      alt={movie.description || movie.title}
                      className="h-full w-full object-cover object-center"
                      loading="lazy"
                    />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <h3 className="text-sm font-medium text-neutral-200 group-hover:text-white transition-colors truncate">
                        {movie.title}
                    </h3>
                    <p className="text-xs text-neutral-500 truncate">
                        {movie.genres
                          ?.map((id) => genreNameById[id] || "")
                          .filter(Boolean)
                          .join(" • ")}
                    </p>
                  </div>
                </Link>
              ))}
        </div>
        
        {activeMovies.length === 0 && (
             <div className="flex min-h-[40vh] items-center justify-center text-neutral-500">
                No movies found.
             </div>
        )}
      </div>
    </div>
  );
}
