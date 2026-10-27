import axios from "axios";
import { server } from "../../config";

const getAllActiveMovie = async(profile_id) => {
    const res = await axios.get(`${server}/${profile_id}/movies/get-all-active-movies`,
    {
        withCredentials: true
    })
    console.log(res.data.data.data)
    return res.data.data.data;
}

export default getAllActiveMovie
