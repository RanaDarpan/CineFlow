import { useDispatch, useSelector } from "react-redux";
import Button from "../Button";
import { useNavigate } from "react-router";
import { selectActiveSeries, upsertManySeries } from "../../slices/seriesSlice";
import { Link } from "react-router";
import getAllSeries from "../../axios/getAllSeriesAPI";
import { useEffect, useState } from "react";
import { selectGenreById } from "../../slices/genreSlice";

export default function Series()
{
    const {user} = useSelector(state=>state.auth)
    const activeSeries = useSelector(selectActiveSeries);
    const profile_id = useSelector(state=>state.profile.activeProfile._id)
    const [loadingSeries, setLoadingSeries] = useState(true);
    const dispatch = useDispatch();
    const type = user.type;
    const navigate = useNavigate()

    useEffect(() => {
    const fetchActiveSeries = async () => {
      try {
        if (!activeSeries || activeSeries.length === 0) {
          const res = await getAllSeries(profile_id);
          console.log("E")
          if (res.length > 0) {
            dispatch(upsertManySeries(res));
          }
        }
      } catch (error) {
        console.error("Error fetching active series:", error);
      } finally {
        setLoadingSeries(false);
      }
    };
    fetchActiveSeries();
  }, [dispatch, profile_id]);

  console.log(activeSeries)

    const genreNameById = useSelector((state) => {
      const map = {};
      activeSeries.forEach((m) => {
        m.genres?.forEach((id) => {
          if (!map[id]) {
            map[id] = selectGenreById(state, id);
          }
        });
      });
      return map;
    });
  
    if (loadingSeries) return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
      </div>
    );
    
    return(
        <div className="px-4 py-8 sm:px-6 lg:px-8">
            {type && 
            <div className="flex justify-end gap-2 mb-8">
                <Button variant="secondary" type="button" onClick = {()=> (navigate(`/${profile_id}/series/add-series`))}>Add Series</Button>
                <Button variant="ghost" type="button" onClick = {()=> (navigate(`/${profile_id}/series/all-series`))}>All Series</Button>
            </div>}
            
            <div className="mx-auto max-w-7xl">
                <h2 className="mb-6 text-xl font-semibold text-white md:text-2xl">Series</h2>
                
                <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:gap-x-8">
                    {activeSeries.map((g)=> (
                        <Link key={g._id} to= {`/${profile_id}/series/${g._id}`} className="group relative flex flex-col gap-2">
                             <div className="aspect-[2/3] w-full overflow-hidden rounded-md bg-neutral-800 transition-transform duration-300 group-hover:scale-105 group-hover:shadow-xl group-hover:shadow-black/50">
                                <img 
                                    src={g.thumbnail} 
                                    alt={g.title} 
                                    className="h-full w-full object-cover object-center"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                            </div>
                            
                            <div className="flex flex-col gap-1">
                                <h3 className="truncate text-sm font-medium text-neutral-200 group-hover:text-white transition-colors">{g.title}</h3>
                                <p className="truncate text-xs text-neutral-500">
                                    {g.genres?.map((id)=> genreNameById[id]).filter(Boolean).join(" • ")}
                                </p>
                                <div className="flex gap-2 text-[10px] text-neutral-400">
                                    <span>{g.total_seasons} Seasons</span>
                                    <span>•</span>
                                    <span>{g.age_rating}</span>
                                </div>
                            </div>
                        </Link>
                     ))}
                </div>
            </div>
        </div>
    )

} 