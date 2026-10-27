import axios from "axios";
import { server } from "../../config";

const addSeries = async(profile_id, data) => {
    const res = await axios.post(`${server}/${profile_id}/series/create-series`, 
        data,
    {
        withCredentials: true
    })
    return res.data.data;
}

export default addSeries
