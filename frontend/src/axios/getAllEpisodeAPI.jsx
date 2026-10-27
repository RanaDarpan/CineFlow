import axios from "axios";
import { server } from "../../config";

const getAllEpisode = async(profile_id, series_id,season_id) => {
    const res = await axios.get(`${server}/${profile_id}/series/${series_id}/seasons/${season_id}/episodes/get-all-episodes`,
    {
        withCredentials: true
    })
    return res.data.data.data;
}

export default getAllEpisode
