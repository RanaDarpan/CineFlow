import { useDispatch, useSelector } from "react-redux";
import { getErrorMessage } from "../../utils/errorHandler";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import Button from "../Button";
import getSeasonInfo from "../../axios/getSeasonInfoAPI"
import deleteSeasonAPI from "../../axios/deleteSeasonAPI";
import { upsertSeason, removeSeason, selectSeasonById, upsertManyEpisode } from "../../slices/seriesSlice";
import getActiveSeasonEpisode from "../../axios/getActiveSeasonEpisodeAPI";

export default function SelectedSeason() {
  const { series_id, season_id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const season = useSelector(state => selectSeasonById(state, season_id));
  const [episodes, setEpisodes] = useState([])
  let preview = episodes?.length > 0 ? true : false;

  const { activeProfile } = useSelector(state => state.profile);
  const profile_id = activeProfile._id
  const { user } = useSelector(state => state.auth);
  const isAdmin = user?.type === true;

  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState(false);

  useEffect(() => {
    if (!season) {
      (async () => {
        try {
          const res = await getSeasonInfo(activeProfile._id, series_id, season_id);
          dispatch(upsertSeason(res));
        } catch (error) {
          toast.error(getErrorMessage(error, "We're having trouble loading this content right now."));
        }
      })();
    }
  }, [season_id, season, dispatch, activeProfile._id, series_id]);

  useEffect(()=> {
      (async ()=> {
        try {   
          const epi = await getActiveSeasonEpisode(profile_id, series_id, season_id)
          setEpisodes(epi)
          dispatch(upsertManyEpisode(epi))
        } catch (error) {
          // ignore error if no episodes
        } finally {
          setLoading(false)
        }
      })()
  }, [season_id, dispatch, profile_id, series_id])

  if (!season) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-black">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-700 border-t-white"></div>
        </div>
    );
  }

  const deleteSeason = async () => {
    try {
      setLoading(true);
      await deleteSeasonAPI(activeProfile._id, series_id, season._id);
      dispatch(removeSeason(season._id));
      toast.success("Season deleted successfully");
      navigate(`/${profile_id}/series/${series_id}`);
    } catch(error) {
      toast.error(getErrorMessage(error, "Failed to delete season."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 font-sans">
      <div className="mx-auto max-w-5xl">
        
        {/* Header Section */}
        <div className="mb-12 border-b border-neutral-800 pb-8">
            <button 
                onClick={() => navigate(`/${profile_id}/series/${series_id}`)}
                className="mb-6 text-sm text-neutral-400 hover:text-white flex items-center transition-colors"
            >
                &larr; Back to Series
            </button>
            <h1 className="text-5xl md:text-6xl font-black tracking-tight text-white mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>
                Season {season.season_number}
            </h1>
            <p className="text-lg text-neutral-300 max-w-3xl leading-relaxed font-light">
                {season.description || "No description available for this season."}
            </p>
            <div className="mt-6 flex items-center gap-4 text-sm font-medium text-neutral-400">
                <span className="bg-neutral-900 px-4 py-1.5 rounded-full border border-neutral-800 shadow-sm">
                    {season.total_episodes} {season.total_episodes === 1 ? 'Episode' : 'Episodes'}
                </span>
            </div>
        </div>

        {/* Admin Controls */}
        {isAdmin && (
          <div className="mb-12 bg-neutral-900/50 border border-neutral-800 p-6 rounded-2xl flex flex-wrap gap-4 items-center backdrop-blur-md">
            <h3 className="w-full text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">Admin Controls</h3>
            <Button variant="primary" onClick={() => navigate(`/${profile_id}/series/${series_id}/season/${season._id}/episodes/add-episode`)}>Add Episode</Button>
            <Button variant="secondary" onClick={() => navigate(`/${profile_id}/series/${series_id}/season/${season._id}/episodes/all-episode`)}>Manage Episodes</Button>
            <Button variant="secondary" onClick={() => navigate(`/${profile_id}/series/${series_id}/season/${season._id}/update-season`)}>Edit Season</Button>
            <Button variant="danger" onClick={() => setConfirm(true)}>Delete Season</Button>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {confirm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-2xl max-w-md w-full mx-4 shadow-2xl">
                    <h2 className="text-2xl font-bold mb-4 text-white">Delete Season?</h2>
                    <p className="text-neutral-400 mb-8">This action cannot be undone. All episodes within this season will be permanently removed.</p>
                    <div className="flex gap-4 justify-end">
                        <Button variant="ghost" onClick={() => setConfirm(false)}>Cancel</Button>
                        <Button variant="danger" onClick={deleteSeason} disabled={loading}>
                            {loading ? "Deleting..." : "Yes, delete season"}
                        </Button>
                    </div>
                </div>
            </div>
        )}

        {/* Episodes Section */}
        <div>
            <h2 className="text-3xl font-bold mb-8 text-white tracking-tight" style={{ fontFamily: "'Inter', sans-serif" }}>Episodes</h2>
            
            {preview ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {episodes.map((g) => (
                        <Link 
                            key={g._id} 
                            to={`/${profile_id}/series/${series_id}/season/${season_id}/episodes/${g._id}`} 
                            className="group relative flex flex-col bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:bg-neutral-800 hover:border-neutral-600 transition-all duration-300"
                        >
                            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                            <div className="relative z-10 flex items-center justify-between mb-4">
                                <span className="text-5xl font-black text-neutral-800 group-hover:text-neutral-700 transition-colors" style={{ fontFamily: "'Inter', sans-serif" }}>
                                    {String(g.episode_no).padStart(2, '0')}
                                </span>
                            </div>
                            <h3 className="relative z-10 text-xl font-bold text-white mb-2 line-clamp-1 group-hover:text-white transition-colors" style={{ fontFamily: "'Inter', sans-serif" }}>
                                {g.title}
                            </h3>
                            <p className="relative z-10 text-sm text-neutral-400 line-clamp-2">
                                {g.description || "No description provided."}
                            </p>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-24 bg-neutral-900/30 border border-neutral-800 rounded-3xl text-neutral-500">
                    <svg className="w-16 h-16 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"></path></svg>
                    <p className="text-xl font-medium text-white mb-2">No episodes yet</p>
                    <p className="text-sm">Episodes added to this season will appear here.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
