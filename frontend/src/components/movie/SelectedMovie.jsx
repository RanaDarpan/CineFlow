import { useDispatch, useSelector } from "react-redux";
import { getErrorMessage } from "../../utils/errorHandler";
import toast from "react-hot-toast";
import { useNavigate, useParams, useLocation } from "react-router";
import {
  selectMovieById,
  selectIsInWatchlist,
  selectWatchProgress,
  updateWatchHistory,
  addToWatchlist,
  removeFromWatchlist,
  removeMovie,
  upsertMovie
} from "../../slices/movieSlice";

import { useEffect, useRef, useState } from "react";
import Button from "../Button";

import getMovieDetails from "../../axios/getMovieDetailsAPI";
import deleteMovieAPI from "../../axios/deleteMovieAPI";
import addWatchListAPI from "../../axios/addToWatchListAPI";
import deleteFromWatchListAPI from "../../axios/deleteFromWatchListAPI";
import createORupdateWatchHistory from "../../axios/createORupdateWatchHistoryAPI";
import getProfileWatchList from "../../axios/getProfileWatchListAPI";
import { selectGenreById } from "../../slices/genreSlice";
import getContentReview from "../../axios/getContentReviewAPI";
import Comment from "../comments/Comment";


export default function SelectedMovie() {
  const { movie_id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { activeProfile } = useSelector(state => state.profile);
  const { type } = useSelector(state => state.auth.user );
  const [comments, setComments] = useState([]);



  const profile_id = activeProfile?._id;
  const isAdmin = type;

  const movie = useSelector(state => selectMovieById(state, movie_id));
  const inWatchlist = useSelector(state =>
    selectIsInWatchlist(state, movie_id)
  );
  const savedProgress = useSelector(state =>
    selectWatchProgress(state, movie_id)
  );

  const videoRef = useRef(null);
  const lastUpdate = useRef(0);

  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState(false);


  useEffect(() => {
    if (!profile_id) return;

    (async () => {
      try {
        const res = await getProfileWatchList(profile_id);


        if (!Array.isArray(res.data)) {
          throw new Error("Watchlist API did not return an array");
        }
        
        res.data.forEach(item => {
          dispatch(addToWatchlist(item.content_id));
        });
      } catch (err) {
        console.error("Failed to fetch watchlist", err);
      }
    })();
  }, [profile_id, dispatch]);

  useEffect(() => {
    if (!movie && profile_id) {
      (async () => {
        try {
          const res = await getMovieDetails(profile_id, movie_id);
          dispatch(upsertMovie(res));
        } catch (error) {
          toast.error(getErrorMessage(error, "We're having trouble loading this content right now."));
        }
      })();
    }
  }, [movie_id, movie, profile_id, dispatch]);

  useEffect(() => {
      (async () => {
        try {
          setLoading(true);
          console.log("E")
          const res = await getContentReview(profile_id, "Movies", movie_id);
          console.log(res)
          setComments(res);
        } catch (error) {
          toast.error(getErrorMessage(error, "We're having trouble loading this content right now."));
        } finally {
          setLoading(false);
        }
      })();
  }, [profile_id]);

  if (!movie) return <p>Loading movie...</p>;
  if (!movie.video) return <p>Video unavailable</p>;

  const genreNameById = useSelector(state => {
    const map = {};
    movie.genres?.forEach(id => {
      map[id] = selectGenreById(state, id);
    });
    return map;
  });

  console.log(comments)
  const location = useLocation();
  const historyProgress = location.state?.progress; // Percentage from WatchHistory

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;

    let startProgress = 0;
    
    // Priority 1: Navigation State (from Watch History)
    if (historyProgress) {
        startProgress = (historyProgress / 100) * videoRef.current.duration;
    } 
    // Priority 2: Redux/LocalStorage (Last session)
    else if (savedProgress > 5 && savedProgress < videoRef.current.duration * 0.95) {
        startProgress = savedProgress;
    }

    if (startProgress > 0) {
        videoRef.current.currentTime = startProgress;
    }
  };

  const saveWatchProgress = async (force = false) => {
    const video = videoRef.current;
    if (!video) return;

    const now = Date.now();
    if (!force && now - lastUpdate.current < 5000) return;
    lastUpdate.current = now;

    dispatch(
      updateWatchHistory({
        movieId: movie._id,
        progress: video.currentTime,
        duration: video.duration,
        lastWatchedAt: new Date().toISOString()
      })
    );

    await createORupdateWatchHistory(profile_id, {
      content_type: "Movies",
      content_id: movie._id,
      progress_percentage: (video.currentTime/video.duration)*100
    });
  };

  const handleEnded = async () => {
    const video = videoRef.current;

    dispatch(
      updateWatchHistory({
        movieId: movie._id,
        progress: video.duration,
        duration: video.duration,
        lastWatchedAt: new Date().toISOString()
      })
    );

    await createORupdateWatchHistory(profile_id, {
      content_type: "Movies",
      content_id: movie._id,
      progress_percentage: (video.currentTime/video.duration)*100
    });
  };

  const addToWL = async () => {
    try {
      setLoading(true);
      await addWatchListAPI(profile_id, {
        content_type: "Movies",
        content_id: movie._id
      });
      dispatch(addToWatchlist(movie._id));
    } catch (error) {
      toast.error(getErrorMessage(error, "We're having trouble loading this content right now."));
    } finally {
      setLoading(false);
    }
  };

  const removeFromWL = async () => {
    try {
      setLoading(true);
      await deleteFromWatchListAPI(profile_id, {
        content_id: movie._id,
        content_type: "Movies"
      });
      dispatch(removeFromWatchlist(movie._id));
    } catch (error) {
      toast.error(getErrorMessage(error, "We're having trouble loading this content right now."));
    } finally {
      setLoading(false);
    }
  };

  const deleteMovie = async () => {
    try {
      setLoading(true);
      await deleteMovieAPI(profile_id, movie._id);
      dispatch(removeMovie(movie._id));
      navigate(`/${profile_id}/movies`);
    } catch (error) {
      toast.error(getErrorMessage(error, "We're having trouble loading this content right now."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">


      <div className="mb-8 overflow-hidden rounded-xl bg-black shadow-2xl ring-1 ring-white/10">
        <video
            ref={videoRef}
            controls
            className="aspect-video w-full"
            src={movie.video.hls_master_url}
            onLoadedMetadata={handleLoadedMetadata}
            onTimeUpdate={() => saveWatchProgress(false)}
            onPause={() => saveWatchProgress(true)}
            onEnded={handleEnded}
        />
      </div>

      <div className="grid gap-12 lg:grid-cols-[2fr_1fr]">
        <div>
            <h1 className="text-4xl font-bold text-white mb-2">{movie.title}</h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-neutral-400 mb-6">
                <span className="rounded bg-neutral-800 px-2 py-0.5 text-neutral-200 backdrop-blur">{movie.age_rating}</span> 
                <span>•</span>
                 <span> {movie.release_date?.split("-")[0] || "2024"} </span>
                <span>•</span>
                <span className="text-yellow-500">★ {movie.rating}</span>
                <span>•</span>
                 <span>
                    {movie.genres
                        ?.map(id => genreNameById[id] || "Unknown")
                        .join(", ")}
                 </span>
            </div>

            <p className="mb-8 text-neutral-300 leading-relaxed text-lg max-w-3xl">
                {movie.description}
            </p>
            
            <div className="flex flex-wrap gap-4 mb-10">
                 {!inWatchlist ? (
                    <Button variant="secondary" onClick={addToWL} className="flex items-center gap-2">
                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Add to watchlist
                    </Button>
                 ) : (
                    <Button variant="secondary" onClick={removeFromWL} className="flex items-center gap-2 bg-neutral-800 border-neutral-700 hover:bg-neutral-700">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                             <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                        Remove from watchlist
                    </Button>
                 )}
                 
                 <Button variant="ghost" onClick={() => navigate(`/${profile_id}/comments/add-comment/Movies/${movie._id}`)}>
                    Write a Review
                 </Button>
            </div>


            {/* Comments Section */}
            <div className="border-t border-neutral-800 pt-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-white">Reviews</h2>
                     <Button variant="ghost" className="text-sm" onClick={() => navigate(`/${profile_id}/my-reviews`, { state: { filter_content_id: movie._id } })}>See My Reviews</Button>
                </div>
                
                {comments && comments.length > 0 ? (
                    <div className="space-y-6">
                        {comments.map(c => (
                            <Comment key={c._id} comment={c.comment} profile={c.profile.name} avatar={c.profile.avatar}/>
                        ))}
                    </div>
                ) : (
                    <p className="text-neutral-500 italic">No reviews yet. Be the first to share your thoughts!</p>
                )}
            </div>
        </div>

        {/* Sidebar / Admin Controls */}
        <div className="space-y-6">
             {isAdmin && (
                <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6">
                    <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-neutral-500">Admin Controls</h3>
                    <div className="flex flex-col gap-3">
                        <Button variant="primary" onClick={() => navigate(`/${profile_id}/movies/add-movies`)}>
                            Add New Movie
                        </Button>
                        <Button variant="secondary" onClick={() => navigate(`/${profile_id}/movies/update-movie/${movie._id}`)}>
                            Update Metadata
                        </Button>
                        <Button variant="danger" onClick={() => setConfirm(true)}>
                            Delete Movie
                        </Button>
                    </div>
                </div>
            )}
        </div>
      </div>

      {confirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"> 
          <div className="w-full max-w-sm rounded-lg bg-neutral-900 p-6 border border-neutral-800">
             <h3 className="mb-2 text-lg font-bold text-white">Delete Movie?</h3>
             <p className="mb-6 text-neutral-400">This action cannot be undone. Are you sure you want to delete this content permanently?</p>
             <div className="flex justify-end gap-3">
                 <Button variant="ghost" onClick={() => setConfirm(false)}>Cancel</Button>
                 <Button variant="danger" onClick={deleteMovie} disabled={loading}>
                    {loading ? "Deleting..." : "Delete"}
                 </Button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
