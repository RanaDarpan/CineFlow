import axios from "axios";
import { server } from "../../config";

const getSeasonInfo = async(profile_id, series_id,season_id) => {
    const res = await axios.get(`${server}/${profile_id}/series/${series_id}/seasons/get-season/${season_id}`,
    {
        withCredentials: true
    })
    return res.data.data;
}

export default getSeasonInfo
