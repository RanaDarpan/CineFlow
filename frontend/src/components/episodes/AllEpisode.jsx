import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router";
import Button from "../Button";
import getAllEpisode from "../../axios/getAllEpisodeAPI"
import { useEffect, useState } from "react";

export default function AllEpisode()
{

    const {series_id,season_id} = useParams()
    const {user} = useSelector(state=>state.auth)
    const [episodes, setEpisodes] = useState([])
    const isAdmin = user?.type === true;
    let preview = episodes?.length > 0 ? true : false;
    const profile_id = useSelector(state => state.profile.activeProfile._id)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()


    useEffect(()=> {
      (async ()=> {
        try {   
          const epi = await getAllEpisode(profile_id, series_id, season_id)
          setEpisodes([...episodes, ...epi])
          dispatch(upsertManyEpisode(episodes))
          preview = true
        } catch (error) {
          preview = false
        } finally {
          setLoading(false)
        }
      })()
  }, [season_id, dispatch])

    return(
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
             {loading && 
                <div className="flex min-h-[50vh] items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
                </div>
             }
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
                <h1 className="text-2xl font-bold text-white">All Episodes</h1>
                {isAdmin && (
                    <div className="flex gap-2">
                        <Button variant="primary" onClick={() => navigate(`/${profile_id}/series/${series_id}/season/${season_id}/episodes/add-episode`)}>Add Episode</Button>
                        <Button variant="secondary" onClick={() => navigate(`/${profile_id}/series/${series_id}/season/${season_id}`)}>Back to Season</Button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 gap-4">
            {preview && episodes.map((g)=> (
                <Link key={g._id} to= {`/${profile_id}/series/${series_id}/season/${season_id}/episodes/${g._id}`} className="group relative overflow-hidden rounded-lg bg-neutral-800 p-4 shadow-md transition-all hover:bg-neutral-750 hover:shadow-lg flex items-center justify-between">
                   <div className="flex items-center gap-4">
                       <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-700 text-white font-bold">
                           {g.episode_no}
                       </div>
                       <div>
                           <h3 className="text-lg font-medium text-white group-hover:text-neutral-300 transition-colors">{g.title}</h3>
                       </div>
                   </div>
                   <div className="text-neutral-500">
                       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                        </svg>
                   </div>
               </Link>
                 ))}
            </div>
             {!preview && !loading && (
                 <div className="flex min-h-[20vh] items-center justify-center rounded-lg bg-neutral-900 p-8 text-neutral-500">
                    <p>No episodes found.</p>
                </div>
            )}
        </div>
    )
} 