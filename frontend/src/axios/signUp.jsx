import axios from "axios";
import { server } from "../../config";

const signUp = async(data) => {
    const res = await axios.post(`${server}/users/register`, data,
    {
        withCredentials: true
    })
    return res.data.data
}

export default signUp
