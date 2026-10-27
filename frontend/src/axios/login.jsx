import axios from "axios";
import { server } from "../../config";

const login = async(data) => {
    const res = await axios.post(`${server}/users/login`,data,{
        withCredentials: true
    })
    return res.data.data
}

export default login
