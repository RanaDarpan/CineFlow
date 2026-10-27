import axios from "axios";
import { server } from "../../config";

const searchSeries = async(profile_id) => {
    const res = await axios.get(`${server}/${profile_id}/series/search-series`, 
    {
        withCredentials: true
    })
    return res.data.data;
}

export default searchSeries
