import { useSelector, useDispatch} from "react-redux";
import { Link, useNavigate, useParams } from "react-router";
import { selectSeasonsBySeries, upsertManySeason } from "../../slices/seriesSlice";
import getAllSeriesSeason from "../../axios/getAllSeriesSeasonAPI"
import Button from "../Button";
import { useEffect, useState } from "react";

export default function AllSeason()
{
    const profile_id = useSelector(state=>state.profile.activeProfile._id)
    const {series_id} = useParams()
    const {user} = useSelector(state=>state.auth)
    let season = useSelector(state => selectSeasonsBySeries(state, series_id));
    let preview = season.length > 0 ? true : false;
    const isAdmin = user?.type === true;
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(true);

    useEffect(()=> {
        if(season.length === 0) {
            (async () => {
                try {
                    const res = await getAllSeriesSeason(profile_id, series_id);
                    if(res.length > 0) {
                        dispatch(upsertManySeason(res))
                    }
                } catch (error) {
                    // silently fail or handle error
                } finally {
                    setLoading(false)
                }
            })();
        } else {
            setLoading(false);
        }
    }, [series_id, season.length, dispatch, profile_id]);

    return(
        <div className="min-h-screen bg-black text-white p-6 md:p-12 font-sans">
            <div className="mx-auto max-w-7xl">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 border-b border-neutral-800 pb-8">
                    <div>
                        <button 
                            onClick={() => navigate(`/${profile_id}/series/${series_id}`)}
                            className="mb-4 text-sm text-neutral-400 hover:text-white flex items-center transition-colors"
                        >
                            &larr; Back to Series
                        </button>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
                            All Seasons
                        </h1>
                    </div>
                    {isAdmin && (
                        <div className="flex gap-3">
                            <Button variant="primary" onClick={() => navigate(`/${profile_id}/series/${series_id}/seasons/add-season`)}>Add Season</Button>
                        </div>
                    )}
                </div>

                {/* Seasons Grid */}
                {loading ? (
                    <div className="flex items-center justify-center min-h-[400px]">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-700 border-t-white"></div>
                    </div>
                ) : (
                    <>
                        {preview ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {season.map((g)=> (
                                    <Link 
                                        key={g._id} 
                                        to={`/${profile_id}/series/${series_id}/season/${g._id}`} 
                                        className="group relative flex flex-col items-center justify-center p-8 min-h-[220px] bg-neutral-900 border border-neutral-800 rounded-2xl hover:bg-neutral-800 hover:border-neutral-600 transition-all duration-300 overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                        
                                        <h3 className="relative z-10 text-4xl font-black text-white tracking-tight mb-2 group-hover:scale-105 transition-transform" style={{ fontFamily: "'Inter', sans-serif" }}>
                                            Season {g.season_number}
                                        </h3>
                                        <div className="relative z-10 inline-flex items-center px-4 py-1.5 rounded-full bg-neutral-950 border border-neutral-800 text-sm font-medium text-neutral-400 mt-4">
                                            {g.total_episodes} {g.total_episodes === 1 ? 'Episode' : 'Episodes'}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-24 bg-neutral-900/30 border border-neutral-800 rounded-3xl text-neutral-500">
                                <svg className="w-16 h-16 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                                <p className="text-xl font-medium text-white mb-2">No seasons found</p>
                                <p className="text-sm">This series doesn't have any seasons yet.</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}