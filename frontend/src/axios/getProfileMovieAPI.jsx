import axios from "axios";
import { server } from "../../config";

const getProfileMovie = async(profile_id) => {
    const res = await axios.get(`${server}/${profile_id}/movies/get-profile-movies`,
    {
        withCredentials: true
    })
    return res.data.data;
}

export default getProfileMovie
