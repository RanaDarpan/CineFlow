import axios from "axios";
import { server } from "../../config";

const deleteGenre = async(genre_id) => {
    const res = await axios.delete(`${server}/genres/delete-genre/${genre_id}`,
    {   
        withCredentials: true
    })
    return res.data.data;
}

export default deleteGenre
