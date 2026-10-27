import axios from "axios";
import { server } from "../../config";

const getProfileSeries= async(profile_id) => {
    const res = await axios.get(`${server}/${profile_id}/series/get-profile-series`,
    {
        withCredentials: true
    })
    return res.data.data;
}

export default getProfileSeries
