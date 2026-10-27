import { useSelector } from "react-redux";
import Button from "../Button";
import { useNavigate, useParams } from "react-router";
import { selectActiveSeason } from "../../slices/seriesSlice";
import { Link } from "react-router";

export default function Season()
{
    const profile_id = useSelector(state => state.profile.activeProfile._id)
    const {series_id} = useParams()
    const {user} = useSelector(state=>state.auth)
    const activeSeason = useSelector(selectActiveSeason);
    const type = user.type;
    const navigate = useNavigate()


    return(
        <>
            {type && 
            <div>
                <Button type="button" onClick = {()=> (navigate(`/${profile_id}/series/${series_id}/seasons/add-season`))}>Add Season</Button>
            </div>}

            {type && 
            <div>
                <Button type="button" onClick = {()=> (navigate(`/${profile_id}/series/${series_id}/seasons/all-seasons`))}>All Seasons</Button>
            </div>}
            
            <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
            <h2 className="sr-only">Season</h2>

           
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {activeSeason.map((g)=> (
                <Link to= {`/${profile_id}/series/${series_id}/seasons/${g._id}`} className="group">
                    <h3 className="mt-4 text-sm text-gray-700">{g.season_number}</h3>
                    <p className="mt-1 text-lg font-medium text-gray-900">{g.total_episodes}</p>
                </Link>
                 ))}
            </div>
        </div>
        </div>
        </>
    )

} 