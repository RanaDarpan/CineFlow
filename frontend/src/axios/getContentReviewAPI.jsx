import { server } from "../../config";
import axios from "axios";

export default async  function getContentReview(profile_id, content_type, content_id) {
    try {
        const res = await axios.get(`${server}/${profile_id}/reviews/get-content-reviews/${content_type}/${content_id}`, {
            withCredentials: true
        }); 
        console.log(res.data.data.data);
        return res.data.data.data;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return [];
        }
        throw error;
    }
};