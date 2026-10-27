import { useDispatch, useSelector } from "react-redux";
import addEpisode from "../../axios/addEpisodeAPI.jsx";
import EpisodeForm from "./EpisodeForm.jsx";
import { upsertEpisode } from "../../slices/seriesSlice.js";
import { useParams } from "react-router";
import { useNavigate } from "react-router";
export default function AddEpisode()
{
    const {series_id,season_id} = useParams()
    const {activeProfile} = useSelector(state=>state.profile)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const onSubmit= async (data) => {
        const formData = new FormData()
        formData.append("episode_no",data.episode_no)
        formData.append("title",data.title)
        formData.append("description",data.description)
        formData.append("r_date",data.r_date)
        formData.append("video",data.video[0])
        const res = await addEpisode(activeProfile._id,series_id,season_id,formData)
        dispatch(upsertEpisode(res))
        navigate(`/${activeProfile._id}/series/${series_id}/season/${season_id}`)
    }

    return(
        <>
            <EpisodeForm onSubmit={onSubmit} isMultipart={true}/>
        </>
    )
}