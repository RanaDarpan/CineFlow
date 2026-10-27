import { server } from "../../config";
import axios from "axios";

export const updateReview = async (profile_id, review_id, review) => {
    const res = await axios.patch(`${server}/${profile_id}/reviews/update-review/${review_id}`, 
        review, 
    {
        withCredentials: true
    }); 
    return res.data.data;
};