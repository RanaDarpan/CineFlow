import axios from "axios";
import { server } from "../../config";

const getEpisode = async(profile_id, series_id,season_id,episode_id) => {
    const res = await axios.get(`${server}/${profile_id}/series/${series_id}/seasons/${season_id}/episodes/get-episode/${episode_id}`,
    {
        withCredentials: true
    })
    return res.data.data;
}

export default getEpisode
