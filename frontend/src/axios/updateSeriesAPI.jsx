import axios from "axios";
import { server } from "../../config";

const updateSeries = async(profile_id, series_id,data) => {
    console.log(profile_id, series_id,data)
    const res = await axios.patch(`${server}/${profile_id}/series/update-series/${series_id}`,
        data,
    {
        withCredentials: true
    })
    return res.data.data;
}

export default updateSeries
 