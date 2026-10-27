import axios from "axios";
import { server } from "../../config";

const updateProfile = async({profile_id, data}) => {
    const res = await axios.patch(`${server}/profiles/update-profile/${profile_id}`,
       data,
    {   
        withCredentials: true
    })
    return res.data;
}

export default updateProfile
