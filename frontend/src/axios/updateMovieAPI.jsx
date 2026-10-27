import axios from "axios";
import { server } from "../../config";

const updateMovie = async(profile_id, movie_id, data) => {
    const res = await axios.patch(`${server}/${profile_id}/movies/update-movie-details/${movie_id}`, 
        data,
    {
        withCredentials: true
    })
    return res.data.data;
}

export default updateMovie
