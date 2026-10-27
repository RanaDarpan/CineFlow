import { useDispatch, useSelector } from "react-redux";
import addSeries from "../../axios/addSeriesAPI.jsx";

import { upsertSeries } from "../../slices/seriesSlice.js";
import SeriesForm from "./SeriesForm.jsx";
import { useNavigate } from "react-router";

export default function AddSeries()
{ 
    const {activeProfile} = useSelector(state=>state.profile)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const onSubmit= async (data) => {
          const formData = new FormData();
          
            formData.append("title", data.title);
            formData.append("description", data.description);
            formData.append("r_date", data.r_date);
            formData.append("age_rating", data.age_rating);
            formData.append("rating", data.rating);
            formData.append("total_seasons",data.total_seasons);
            formData.append("active", data.active);
          
            data.genres.forEach(g => formData.append("genres[]", g));
          
            formData.append("thumbnail", data.thumbnail[0]);                    
            const res = await addSeries(activeProfile._id,formData)
            dispatch(upsertSeries(res))
            navigate(`/${activeProfile._id}/series`)
    }

    return(
        <>
            <SeriesForm onSubmit={onSubmit} isMultipart={true} />
        </>
    )
}