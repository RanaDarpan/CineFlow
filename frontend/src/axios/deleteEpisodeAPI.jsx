import axios from "axios";
import { server } from "../../config";

const deleteEpisode = async(profile_id, series_id, season_id, episode_id) => {
    const res = await axios.delete(`${server}/${profile_id}/series/${series_id}/seasons/${season_id}/episodes/delete-episode/${episode_id}`,
    {
        withCredentials: true
    })
    return res.data.data;
}

export default deleteEpisode
