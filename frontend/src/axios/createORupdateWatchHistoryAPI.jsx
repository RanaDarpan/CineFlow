import axios from "axios";
import { server } from "../../config";

const createORupdateWatchHistory = async(profile_id, data) => {
    console.log(data)
    const res = await axios.patch(`${server}/${profile_id}/watchHistory/update-watch-History`,
        data,
    {
        withCredentials: true
    })
    console.log("Executed watch history")
    return res.data.data;
}

export default createORupdateWatchHistory
 