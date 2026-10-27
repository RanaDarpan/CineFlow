import { server } from "../../config";
import axios from "axios";

export const addReview = async (profile_id, review) => {
    const res = await axios.post(`${server}/${profile_id}/reviews/add-review`, 
        review, 
    {
        withCredentials: true
    });
    return res.data.data;
};