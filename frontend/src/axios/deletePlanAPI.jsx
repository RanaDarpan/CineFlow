import axios from "axios";
import { server } from "../../config";

const deletePlan = async (planId) => {
    const res = await axios.delete(`${server}/subscriptions/delete-plan/${planId}`,
        {
            withCredentials: true
        }
    );
    return res.data.data;
};

export default deletePlan;