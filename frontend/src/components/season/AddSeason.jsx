import { useDispatch, useSelector } from "react-redux";
import addSeason from "../../axios/addSeasonAPI.jsx";

import { upsertSeason } from "../../slices/seriesSlice.js";
import SeasonForm from "./SeasonForm.jsx";
import { useParams } from "react-router";
import { useNavigate } from "react-router";

export default function AddSeason()
{
    const {series_id} = useParams()
    const {activeProfile} = useSelector(state=>state.profile)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const onSubmit= async (data) => {
        const res = await addSeason(activeProfile._id,series_id,data)
        console.log(res)
        dispatch(upsertSeason(res))
        navigate(`/${activeProfile._id}/series/${series_id}`)
    }

    return(
        <>
            <SeasonForm onSubmit={onSubmit} />
        </>
    )
}