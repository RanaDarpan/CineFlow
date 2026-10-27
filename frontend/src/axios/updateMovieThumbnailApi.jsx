import axios from "axios";
import { server } from "../../config";

const updateMovieThumbnail = async(profile_id, movie_id, thumbnail) => {
    const res = await axios.patch(`${server}/${profile_id}/movies/update-thumbnail/${movie_id}`,
        thumbnail,
    {
        withCredentials: true
    })
    return res.data;
}

export default updateMovieThumbnail
