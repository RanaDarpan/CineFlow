import axios from "axios";
import { server } from "../../config";

const cancelPlan = async () => {
    const res = await axios.post(`${server}/subscriptions/cancel-plan`,
        {},
        {
            withCredentials: true
        }
    );
    return res.data.data;
};

export default cancelPlan;