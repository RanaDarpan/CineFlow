import axios from "axios";
import { server } from "../../config";

const getAllGenre = async() => {
    const res = await axios.get(`${server}/genres/get-all-genres`, 
    {   
        withCredentials: true
    })
    return res.data.data.data;
}

export default getAllGenre
