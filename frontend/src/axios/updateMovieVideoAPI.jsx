import axios from "axios";
import { server } from "../../config";

const updateMovieVideo = async(profile_id, movie_id, video) => {
    const res = await axios.patch(`${server}/${profile_id}/movies/update-video/${movie_id}`,
        video,
    {
        withCredentials: true
    })
    return res.data.data;
}

export default updateMovieVideo
