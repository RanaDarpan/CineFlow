import axios from "axios";
import { server } from "../../config";

const updateGenre = async(_id,data) => {
    const res = await axios.patch(`${server}/genres/update-genre/${_id}`,data,
    {   
        withCredentials: true
    })
    return res.data.data;
}

export default updateGenre
