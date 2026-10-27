import axios from "axios";
import { server } from "../../config";

const addSubscription = async (subscription) => {
    const res = await axios.post(`${server}/subscriptions/add-plan`, subscription,
        {
            withCredentials: true
        }
    );
    return res.data.data;
};

export default addSubscription;