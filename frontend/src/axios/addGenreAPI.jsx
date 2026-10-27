import axios from "axios";
import { server } from "../../config";

const addGenre = async(data) => {
    const res = await axios.post(`${server}/genres/add-genre`, 
        data,
    {
        withCredentials: true
    })
    return res.data.data;
}

export default addGenre
