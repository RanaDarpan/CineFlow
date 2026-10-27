import { server } from "../../config";
import axios from "axios";

export const deleteReview = async (profile_id, review_id) => {
    const res = await axios.delete(`${server}/${profile_id}/reviews/delete-review/${review_id}`, 
    {
        withCredentials: true
    });
    return res.data.data;
};