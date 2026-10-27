import axios from "axios";
import { server } from "../../config";

const deleteMovie = async(profile_id, movie_id) => {
    const res = await axios.delete(`${server}/${profile_id}/movies/delete-movie/${movie_id}`,
    {
        withCredentials: true
    })
    return res.data.data;
}

export default deleteMovie
