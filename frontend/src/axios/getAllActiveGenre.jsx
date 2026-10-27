import axios from "axios";
import { server } from "../../config";

const getAllActiveGenre = async() => {
    const res = await axios.get(`${server}/genres/get-all-active-genres`, 
    {   
        withCredentials: true
    })  
    return res.data.data.data;
}

export default getAllActiveGenre
