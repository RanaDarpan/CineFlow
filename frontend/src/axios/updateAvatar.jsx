import axios from "axios";
import { server } from "../../config";

const updateAvatar = async(profile_id,avatar) => {
    const res = await axios.patch(`${server}/profiles/update-avatar/${profile_id}`,
        avatar,
    {   
        withCredentials: true
    })
    return res.data;
}

export default updateAvatar
