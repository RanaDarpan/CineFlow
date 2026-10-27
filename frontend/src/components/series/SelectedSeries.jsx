import { useDispatch, useSelector } from "react-redux";
import { getErrorMessage } from "../../utils/errorHandler";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router";


import { act, useEffect, useState } from "react";
import Button from "../Button";

import addWatchListAPI from "../../axios/addToWatchListAPI";
import deleteFromWatchListAPI from "../../axios/deleteFromWatchListAPI";
import getSeriesDetails from "../../axios/getSeriesDetailsAPI";
import deleteSeriesAPI from "../../axios/deleteSeriesAPI";
import getActiveSeriesSeason from "../../axios/getActiveSeriesSeasonAPI"
import { selectSeriesById, selectIsInWatchlist, upsertSeries, removeFromWatchlist, addToWatchlist, removeSeries, upsertManySeason, selectActiveSeasonsBySeries, selectSeasonsBySeries } from "../../slices/seriesSlice";
import { selectGenreById } from "../../slices/genreSlice";
import addToWatchList from "../../axios/addToWatchListAPI";
import getContentReview from "../../axios/getContentReviewAPI";
import Comment from "../comments/Comment";

export default function SelectedSeries() {
  const { series_id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const series = useSelector(state => selectSeriesById(state, series_id));
  const inWatchlist = useSelector(state => selectIsInWatchlist(state, series_id));
  let seasons = useSelector(state => selectActiveSeasonsBySeries(state,series_id))
  console.log(series)
  console.log(seasons)
  let preview = seasons.length > 0 ? true : false;

  const { activeProfile } = useSelector(state => state.profile);
  const profile_id = activeProfile._id
  const { user } = useSelector(state => state.auth);
  const isAdmin = user?.type === true;



  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState(false);

  const [comments, setComments] = useState([]);

  useEffect(() => {
    if (!series) {
      (async () => {
        try {
          const res = await getSeriesDetails(activeProfile._id,series_id);
          dispatch(upsertSeries(res));
        } catch (error) {
          toast.error(getErrorMessage(error, "We're having trouble loading this content right now."));
        }
      })();
    }
  }, [series_id, series, seasons, dispatch]);

  useEffect(()=> {
    if(seasons.length === 0) {
      (async () => {
        try {
          const sea = await getActiveSeriesSeason(activeProfile._id, series_id);
          console.log("Seasonss",sea)
          if(sea.length > 0) {
            dispatch(upsertManySeason(sea))
          }else
          {
            seasons = []
          }

        }
         catch (error) {
          toast.error(getErrorMessage(error, "We're having trouble loading this content right now."));
        } finally {
          setLoading(false)
        }
      })();
    }
  }, [series_id, series, dispatch]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await getContentReview(profile_id, "Series", series_id);
        setComments(res);

      } catch (error) {
        toast.error(getErrorMessage(error, "We're having trouble loading this content right now."));
      } finally {
        setLoading(false);
      }
    })();
}, [profile_id, series_id]);

  const genreNameById = useSelector((state) => {
    const map = {};
      series?.genres?.forEach((id) => {
        if (!map[id]) {
          map[id] = selectGenreById(state, id);
        }
      });
    return map;
  });

  if (!series) return <p>Loading series...</p>;
  if (!seasons) return <p>Loading seasons...</p>;


  
  
  const addToWL = async () => {
    try {
      setLoading(true);
      await addWatchListAPI(profile_id, {
        content_type: "Series",
        content_id: series._id
      });
      dispatch(addToWatchlist(series._id));
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
        content_id: series._id,
        content_type: "Series"
      });
      dispatch(removeFromWatchlist(series._id));
    } catch (error) {
      toast.error(getErrorMessage(error, "We're having trouble loading this content right now."));
    } finally {
      setLoading(false);
    }
  };

  const deleteSeries = async () => {
    try {
      setLoading(true);
      await deleteSeriesAPI(activeProfile._id, series._id);
      dispatch(removeSeries(series._id));
      navigate(`/${profile_id}/series`);
    } catch (error) {
      toast.error(getErrorMessage(error, "We're having trouble loading this content right now."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">


      <div className="grid gap-12 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-8">
            {/* Hero Section */}
            <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-neutral-900 shadow-2xl">
                <img src={series.thumbnail} alt={series.title} className="h-full w-full object-cover opacity-60" />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 p-8">
                    <h1 className="text-4xl font-bold text-white mb-2">{series.title}</h1>
                    <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-neutral-300">
                         <span className="rounded bg-neutral-800 px-2 py-0.5 text-white/90 backdrop-blur">{series.age_rating}</span>
                         <span>•</span>
                         <span>{series.r_date?.split("-")[0] || "2024"}</span>
                         <span>•</span>
                         <span className="text-yellow-500">★ {series.rating}</span>
                         <span>•</span>
                         <span>{series.total_seasons} Seasons</span>
                    </div>
                </div>
            </div>

            <p className="text-neutral-300 leading-relaxed text-lg">
                {series.description}
            </p>
             <div className="text-sm text-neutral-500">
                Genres: {series.genres?.map((g=>genreNameById[g] || "Unknown")).join(", ")}
            </div>
            
            <div className="flex flex-wrap gap-4">
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
                 <Button variant="ghost" onClick={() => navigate(`/${profile_id}/comments/add-comment/Series/${series._id}`)}>
                    Write a Review
                 </Button>
            </div>

            {/* Seasons Section */}
            <div>
                <h2 className="text-2xl font-semibold text-white mb-6">Seasons</h2>
                {preview ? (
                     <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                        {seasons.map((g) => (
                            <Link key={g._id} to= {`/${profile_id}/series/${series_id}/season/${g._id}`} className="group block rounded-lg bg-neutral-900 p-4 hover:bg-neutral-800 transition-colors border border-neutral-800 hover:border-neutral-700">
                                <h3 className="text-lg font-medium text-white mb-1">Season {g.season_number}</h3>
                                <p className="text-sm text-neutral-500">{g.total_episode} Episodes</p>
                            </Link>
                        ))}
                    </div>
                ): (
                   <p className="text-neutral-500 italic">No seasons available yet.</p>
                )}
            </div>

            {/* Comments Section */}
            <div className="border-t border-neutral-800 pt-8">
                 <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-white">Reviews</h2>
                     <Button variant="ghost" className="text-sm" onClick={() => navigate(`/${profile_id}/my-reviews`, { state: { filter_content_id: series._id } })}>See My Reviews</Button>
                </div>
                {comments && comments.length > 0 ? (
                    <div className="space-y-6">
                        {comments.map(c => (
                            <Comment key={c._id} comment={c.comment} profile={c.profile.name} avatar={c.profile.avatar}/>
                        ))}
                    </div>
                ) : (
                    <p className="text-neutral-500 italic">No reviews yet.</p>
                )}
            </div>
        </div>

        {/* Admin Controls */}
        <div className="space-y-6">
             {isAdmin && (
                <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 sticky top-24">
                    <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-neutral-500">Admin Controls</h3>
                     <div className="flex flex-col gap-3">
                        <Button variant="primary" onClick={() => navigate(`/${profile_id}/series/${series._id}/seasons/add-season`)}>Add Season</Button>
                        <Button variant="secondary" onClick={() => navigate(`/${profile_id}/series/${series._id}/update-series`)}>Update Series</Button>
                        <Button variant="ghost" onClick={() => navigate(`/${profile_id}/series/${series._id}/seasons/all-season`)}>Manage All Seasons</Button>
                        <Button variant="danger" onClick={() => setConfirm(true)}>Delete Series</Button>
                    </div>
                </div>
            )}
        </div>
      </div>

       {confirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"> 
          <div className="w-full max-w-sm rounded-lg bg-neutral-900 p-6 border border-neutral-800">
             <h3 className="mb-2 text-lg font-bold text-white">Delete Series?</h3>
             <p className="mb-6 text-neutral-400">This action cannot be undone.</p>
             <div className="flex justify-end gap-3">
                 <Button variant="ghost" onClick={() => setConfirm(false)}>Cancel</Button>
                 <Button variant="danger" onClick={deleteSeries} disabled={loading}>
                    {loading ? "Deleting..." : "Delete"}
                 </Button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
