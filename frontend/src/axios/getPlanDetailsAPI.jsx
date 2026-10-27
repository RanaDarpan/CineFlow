import axios from "axios";
import { server } from "../../config";

const getPlanDetails = async (planId) => {
    const res = await axios.get(`${server}/subscriptions/get-plan/${planId}`,
        {
            withCredentials: true
        }
    );
    return res.data.data;
};

export default getPlanDetails