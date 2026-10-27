import axios from "axios";
import { server } from "../../config";

const addToWatchList = async(profile_id, data) => {
    const res = await axios.post(`${server}/${profile_id}/watchList/add-to-watchList`,
        data,
    {
        withCredentials: true
    })
    return res.data.data;
}

export default addToWatchList
