import { server } from "../../config";
import axios from "axios";

const getContinueWatchingWatchHistory = async (profile_id) => {
        const response = await axios.get(`${server}/${profile_id}/watchHistory/continue`, {
                withCredentials: true
        });
        return response.data.data.data;
}

export default getContinueWatchingWatchHistory