import axios from "axios";
import { server } from "../../config";

const getActiveSeriesSeason = async(profile_id, series_id) => {
    const res = await axios.get(`${server}/${profile_id}/series/${series_id}/seasons/get-active-series-season`,
    {
        withCredentials: true
    })
    console.log(res.data.data.data)
    return res.data.data.data;
}

export default getActiveSeriesSeason
