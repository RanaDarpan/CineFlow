import axios from "axios";
import { server } from "../../config";

const searchSeason = async(profile_id, series_id) => {
    const res = await axios.get(`${server}/${profile_id}/series/${series_id}/seasons/search-seasons`, 
    {
        withCredentials: true
    })
    return res.data.data;
}

export default searchSeason
