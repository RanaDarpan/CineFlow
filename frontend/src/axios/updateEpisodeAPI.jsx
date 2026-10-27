import axios from "axios";
import { server } from "../../config";

const updateEpisode = async(profile_id, series_id,season_id,episode_id,data) => {
    const res = await axios.patch(`${server}/${profile_id}/series/${series_id}/seasons/${season_id}/episodes/update-episode/${episode_id}`, 
        data,
    {
        withCredentials: true
    })
    return res.data.data;
}

export default updateEpisode
