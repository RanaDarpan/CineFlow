import axios from "axios";
import { server } from "../../config";

const addMovie = async(profile_id, data) => {
    console.log(data)
    const res = await axios.post(`${server}/${profile_id}/movies/add-movie`,
        data, 
    {
        withCredentials: true
    })
    console.log(res.data.data)
    return res.data.data
}

export default addMovie
