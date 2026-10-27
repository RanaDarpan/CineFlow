import axios from "axios";
import { server } from "../../config";

const updateSeason = async(profile_id, series_id,season_id,data) => {
    const res = await axios.patch(`${server}/${profile_id}/series/${series_id}/seasons/update-season/${season_id}`,
        data, 
    {
        withCredentials: true
    })
    return res.data.data;
}

export default updateSeason
