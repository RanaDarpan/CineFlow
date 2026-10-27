import axios from "axios";
import { server } from "../../config";

const deleteSeries = async(profile_id,series_id) => {
    const res = await axios.delete(`${server}/${profile_id}/series/delete-series/${series_id}`,
    {
        withCredentials: true
    })
    return res.data.data;
}

export default deleteSeries
