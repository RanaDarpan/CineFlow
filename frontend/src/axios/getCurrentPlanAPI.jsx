import axios from "axios";
import { server } from "../../config";

const getCurrentPlan = async () => {
    const res = await axios.get(`${server}/subscriptions/current-plan`,
        {
            withCredentials: true
        }
    );
    return res.data.data;
};

export default getCurrentPlan