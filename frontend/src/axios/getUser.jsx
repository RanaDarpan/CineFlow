import axios from "axios"
import { server } from "../../config"

const getUser = async ()=> {
    const res = await axios.get(`${server}/users/get-user`, {
        withCredentials: true
    })
    return res.data
}

export default getUser

