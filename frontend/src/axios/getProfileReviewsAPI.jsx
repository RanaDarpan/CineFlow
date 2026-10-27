import { server } from "../../config";
import axios from "axios";

export const getProfileReviews = async (profile_id) => {
    const res = await axios.get(`${server}/${profile_id}/reviews/get-profile-reviews`, 
    {
        withCredentials: true
    });
    return res.data.data;
};