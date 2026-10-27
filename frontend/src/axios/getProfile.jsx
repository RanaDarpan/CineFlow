import axios from "axios";
import { server } from "../../config";

const getProfile = async(profile_id) => {
    const res = await axios.get(`${server}/profiles/${profile_id}`, 
    {   
        withCredentials: true
    })
    console.log(res.data.data)
    return res.data.data;
}

export default getProfile
