import axios from "axios";
import { server } from "../../config";

const continueWatchingWatchHistory = async(profile_id) => {
    const res = await axios.get(`${server}/${profile_id}/watchHistory/continue`, 
    {
        withCredentials: true
    })
    return res.data.data.data;
}

export default continueWatchingWatchHistory
