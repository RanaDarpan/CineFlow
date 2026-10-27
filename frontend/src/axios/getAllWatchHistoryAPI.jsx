import axios from "axios"
import { server } from "../../config"

const getAllWatchHistory = async (profile_id) => {
        const response = await axios.get(`${server}/${profile_id}/watchHistory/all`, {
            withCredentials: true
        })
        return response.data.data.data
}

export default getAllWatchHistory