import { useEffect } from "react"
import getContinueWatchingWatchHistory from "../../axios/getContinueWatchingWatchHistoryAPI"
import { useState } from "react"
import { useSelector } from "react-redux"
import { Link, useNavigate } from "react-router"
import Button from "../Button"

export default function ContinueWatchingHistory() {

    const {activeProfile} = useSelector(state=> state.profile)
    const profile_id = activeProfile._id
    const [watchHistory, setWatchHistory] = useState([])
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    useEffect(()=> {
        (async()=> {
            try {
                setLoading(true)
                const data = await getContinueWatchingWatchHistory(profile_id)
                console.log(data)
                setWatchHistory(data)
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        })()
    }, [])

    if (loading) return (
       <div className="flex min-h-[50vh] items-center justify-center">
         <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
       </div>
    );

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
             <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
                <h1 className="text-2xl font-bold text-white">Continue Watching</h1>
                 <div className="flex gap-2">
                     <Button variant="ghost" onClick = {()=> {navigate(`/${profile_id}/watch-history/all`)}}>
                        All
                    </Button>
                    <Button variant="ghost" onClick = {()=> {navigate(`/${profile_id}/watch-history/watched`)}}>
                        Completed
                    </Button>
                 </div>
            </div>

            {watchHistory.length === 0 ? (
                 <div className="flex min-h-[20vh] items-center justify-center rounded-lg bg-neutral-900 p-8 text-neutral-500">
                    <p>No titles in continue watching.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {watchHistory.map((item)=> {
                    const isEpisode = item.content_type === "Episodes";
                    const linkPath = isEpisode 
                        ? `/${profile_id}/series/${item.series_id}/season/${item.season_id}/episodes/${item.content_id._id}`
                        : `/${profile_id}/movies/${item.content_id._id}`;
                    
                    const progress = item.progress_percentage || 0;

                    return (
                     <div key={item.content_id._id || item._id} className="group relative overflow-hidden rounded-lg bg-neutral-800 shadow-md transition-all hover:bg-neutral-700 hover:shadow-xl hover:-translate-y-1 hover:shadow-black/50">
                        <Link to={linkPath} state={{ progress: item.progress_percentage }} className="flex flex-col h-full">
                            <div className="relative aspect-video w-full overflow-hidden">
                                {item.content_id?.thumbnail || item.content_id?.series_id?.thumbnail ? (
                                    <img 
                                        src={item.content_id?.thumbnail || item.content_id?.series_id?.thumbnail} 
                                        alt={item.content_id.title} 
                                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-neutral-700 text-neutral-500">
                                        No Image
                                    </div>
                                )}
                                
                                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-white drop-shadow-lg">
                                      <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                
                                {/* Progress Bar */}
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-neutral-700">
                                    <div 
                                        className="h-full bg-red-600" 
                                        style={{ width: `${progress}%` }}
                                    ></div>
                                </div>
                            </div>
                            
                            <div className="p-4 flex-1 flex flex-col justify-between">
                                <div>
                                    <h3 className="text-lg font-medium text-neutral-200 line-clamp-1 mb-1 group-hover:text-white transition-colors">{item.content_id.title}</h3>
                                    <p className="text-xs text-neutral-400 uppercase tracking-wider mb-2">{item.content_type}</p>
                                </div>
                                <div className="flex justify-between items-end text-xs text-neutral-500 mt-2">
                                     <span>{Math.round(progress)}% Watched</span>
                                     <span>{new Date(item.last_watched_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </Link>
                    </div>
                    )
                })}
                </div>
            )}
        </div>
    )
}