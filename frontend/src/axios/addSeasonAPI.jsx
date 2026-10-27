import axios from "axios";
import { server } from "../../config";

const addSeason = async(profile_id, series_id,data) => {
    const res = await axios.post(`${server}/${profile_id}/series/${series_id}/seasons/add-season`, 
        data ,
    {
        withCredentials: true
    })
    return res.data.data;
}

export default addSeason
