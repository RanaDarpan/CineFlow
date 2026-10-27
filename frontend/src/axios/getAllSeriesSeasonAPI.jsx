import axios from "axios";
import { server } from "../../config";

const getAllSeriesSeason = async(profile_id, series_id) => {
    const res = await axios.get(`${server}/${profile_id}/series/${series_id}/seasons/get-series-season`,
    {
        withCredentials: true
    })
    return res.data.data.data;
}

export default getAllSeriesSeason
