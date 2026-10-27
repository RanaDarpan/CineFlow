import axios from "axios";
import { server } from "../../config";

const deleteFromWatchList = async(profile_id, data) => {
    const res = await axios.delete(`${server}/${profile_id}/watchList/remove-from-watchList`,
    {
        data: data,
        withCredentials: true
    })
    return res.data.data;
}

export default deleteFromWatchList
