import axios from "axios";
import { server } from "../../config";

const getAllActiveSeries = async(profile_id ) => {
    const res = await axios.get(`${server}/${profile_id}/series/get-all-active-series`,
    {
        withCredentials: true
    })
    console.log(res.data.data.data);
    return res.data.data.data;
}

export default getAllActiveSeries
