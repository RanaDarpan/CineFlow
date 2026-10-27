import { useDispatch, useSelector} from "react-redux";
import updateEpisodeAPI from "../../axios/updateEpisodeAPI.jsx";
import { selectEpisodeById, selectSeriesById, upsertEpisode } from "../../slices/seriesSlice.js";
import EpisodeForm from "./EpisodeForm.jsx";
import { useNavigate, useParams } from "react-router";


export default function updateEpisode()
{
    const navigate = useNavigate()
    const {series_id, season_id,episode_id} = useParams()
    const episode = useSelector(state=>selectEpisodeById(state,episode_id))
    const {activeProfile} = useSelector(state=>state.profile)
    const dispatch = useDispatch()
    const onSubmit= async (data) => {
        const res = await updateEpisodeAPI(activeProfile._id,series_id, season_id, episode_id ,data)
        dispatch(upsertEpisode(res))
        navigate(`/${activeProfile._id}/series/${series_id}/season/${season_id}`)
    }

    return(
        <>
            <EpisodeForm initialData={episode} onSubmit={onSubmit} isMultipart={false} />
        </>             
    )
}