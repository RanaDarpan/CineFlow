import axios from "axios";
import { server } from "../../config";

const updateSeriesThumbnail = async(profile_id, series_id,data) => {
    const res = await axios.patch(`${server}/${profile_id}/series/update-thumbnail/${series_id}`,
        data,
    {
        withCredentials: true
    })
    return res.data.data;
}

export default updateSeriesThumbnail
