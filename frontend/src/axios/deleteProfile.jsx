import axios from "axios";
import { server } from "../../config";

const deleteProfile = async(profile_id) => {
    const res = await axios.delete(`${server}/profiles/delete-profile/${profile_id}`, 
    {   
        withCredentials: true
    })
    return res.data;
}

export default deleteProfile
