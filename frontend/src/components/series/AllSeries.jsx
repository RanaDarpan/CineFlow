import { useDispatch, useSelector } from "react-redux";
import Button from "../Button";
import { Link, useNavigate } from "react-router";
import { selectAllSeries, upsertManySeries } from "../../slices/seriesSlice";
import { selectGenreById } from "../../slices/genreSlice";
import { useEffect } from "react";
import getAllSeries from "../../axios/getAllSeriesAPI.jsx";

export default function AllSeries()
{
    const profile_id = useSelector(state=>state.profile.activeProfile._id)
    const {user} = useSelector(state=>state.auth)
    const series = useSelector(selectAllSeries);
    const isAdmin = user?.type === true;
    const navigate = useNavigate()
    const dispatch = useDispatch()

      const genreNameById = useSelector((state) => {
            const map = {}
            series?.forEach((m)=> {
                m.genres?.forEach((id)=> {
                    if(!map[id])
                    {
                        map[id] = selectGenreById(state,id);
                    }
                })
            })
            return map
        })

    useEffect(() => {
        const fetchData = async () => {
            if (isAdmin) {
                try {
                    const res = await getAllSeries(profile_id);
                    dispatch(upsertManySeries(res));
                } catch (e) {
                    console.error("Failed to fetch all series", e);
                }
            }
        }
        fetchData();
    }, [isAdmin, profile_id, dispatch]);

    return(
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
                <h1 className="text-2xl font-bold text-white">All Series</h1>
                {isAdmin && (
                    <div className="flex gap-2">
                        <Button variant="primary" onClick = {()=> (navigate(`/${profile_id}/series/add-series`))}>Add Series</Button>
                        <Button variant="secondary" onClick = {()=> (navigate(`/${profile_id}/series`))}>Active Series</Button>
                    </div>
                )}
            </div>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {series.map((g)=> (
                <Link key={g._id} to= {`/${profile_id}/series/${g._id}`} className="group relative overflow-hidden rounded-lg bg-neutral-800 shadow-md transition-all hover:bg-neutral-700 hover:shadow-xl hover:-translate-y-1">
                    <div className="aspect-square w-full overflow-hidden bg-neutral-900 xl:aspect-[3/4]">
                        <img src={g.thumbnail} alt={g.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                    </div>
                    <div className="p-4">
                        <h3 className="text-lg font-medium text-white mb-1 truncate">{g.title}</h3>
                         <p className="text-sm text-neutral-400 mb-1 line-clamp-1">{g.genres?.map((id)=> genreNameById[id]).join(", ") || "Unknown"}</p>
                         <div className="flex items-center gap-2 text-xs text-neutral-500">
                            <span>{g.total_seasons} Seasons</span>
                            <span>•</span>
                            <span className="border border-neutral-600 rounded px-1">{g.age_rating}</span>
                         </div>
                    </div>
                </Link>
                 ))}
            </div>
        </div>
    )
} 