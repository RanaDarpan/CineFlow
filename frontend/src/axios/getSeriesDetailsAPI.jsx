import axios from "axios";
import { server } from "../../config";

const getSeriesDetails = async(profile_id, series_id) => {
    const res = await axios.get(`${server}/${profile_id}/series/get-series-details/${series_id}`,
    {
        withCredentials: true
    })
    return res.data.data;
}

export default getSeriesDetails
