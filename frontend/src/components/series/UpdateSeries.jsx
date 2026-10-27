import { useDispatch, useSelector} from "react-redux";
import updateSeriesAPI from "../../axios/updateSeriesAPI.jsx";
import { selectSeriesById, upsertSeries } from "../../slices/seriesSlice.js";
import SeriesForm from "./SeriesForm.jsx";
import { useNavigate, useParams } from "react-router";
import { selectAllGenres, selectGenreById } from "../../slices/genreSlice.js";



export default function updateSeries()
{
    const {series_id} = useParams()
    const selectedSeries = useSelector(state=>selectSeriesById(state,series_id))
    const {activeProfile} = useSelector(state=>state.profile)
    const profile_id = activeProfile._id
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const allGenres = useSelector(selectAllGenres)
    
    const onSubmit = async (data) => {
        const payload = {
            ...data,
            active: data.active,
            genres: data.genres,
        };

        const res = await updateSeriesAPI(profile_id, series_id, payload);

        dispatch(upsertSeries(res));
        navigate(`/${profile_id}/series/${series_id}`);
    }

    return(
        <>
            <SeriesForm onSubmit={onSubmit} isMultipart={false} initialData={selectedSeries}/>
        </>             
    )
}