import axios from "axios";
import { server } from "../../config";

const purchasePlan = async (planId) => {
    const res = await axios.post(`${server}/subscriptions/purchase-plans/${planId}`,
        {},
        {
            withCredentials: true
        }
    );
    return res.data.data;
};

export default purchasePlan;