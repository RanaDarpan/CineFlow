import axios from "axios";
import { server } from "../../config";

const getProfileWatchList = async(profile_id) => {
    const res = await axios.get(`${server}/${profile_id}/watchList/get-profile-watchList`, 
    {
        withCredentials: true
    })
    return res.data.data.data;
}

export default getProfileWatchList
