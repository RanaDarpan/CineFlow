import axios from "axios";
import { server } from "../../config";

const logout = async() => {
    const res = await axios.post(`${server}/users/logout`, {},
    {
        withCredentials: true
    })
    return res.data
}

export default logout
