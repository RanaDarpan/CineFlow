import axios from "axios";
import { server } from "../../config";

const getMovieDetails = async(profile_id, movie_id) => {
    const res = await axios.get(`${server}/${profile_id}/movies/get-movie-detail/${movie_id}`,
    {
        withCredentials: true
    })
    return res.data.data;
}

export default getMovieDetails
