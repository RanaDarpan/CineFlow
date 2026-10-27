import { server } from "../../config";
import axios from "axios";

export const getAllReviews = async (profile_id) => {
    const res = await axios.get(`${server}/${profile_id}/reviews/get-all-reviews`, 
    {
        withCredentials: true
    });
    return res.data.data;
};