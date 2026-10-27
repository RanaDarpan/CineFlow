import axios from "axios";
import { server } from "../../config";

const watchedWatchHistory = async(profile_id) => {
    const res = await axios.get(`${server}/${profile_id}/watchHistory/watched`, 
    {
        withCredentials: true
    })
    return res.data.data.data;
}

export default watchedWatchHistory
