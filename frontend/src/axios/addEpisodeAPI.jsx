import axios from "axios";
import { server } from "../../config";

const addEpisode = async(profile_id, series_id,season_id,data) => {
    const res = await axios.post(`${server}/${profile_id}/series/${series_id}/seasons/${season_id}/episodes/add-episode`,
        data ,
    {
        withCredentials: true
    })
    return res.data.data;
}

export default addEpisode
