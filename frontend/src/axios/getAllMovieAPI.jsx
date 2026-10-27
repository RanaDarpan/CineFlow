import axios from "axios";
import { server } from "../../config";

const getAllMovie = async(profile_id) => {
    const res = await axios.get(`${server}/${profile_id}/movies/get-all-movies`,
    {
        withCredentials: true
    })
    console.log(res.data.data.data)
    return res.data.data.data;
}

export default getAllMovie
