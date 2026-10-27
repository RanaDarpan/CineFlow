import axios from "axios";
import { server } from "../../config";

const getAllPlan = async () => {
    const res = await axios.get(`${server}/subscriptions/plans`,
        {
            withCredentials: true
        }
    );
    console.log(res);
    return res.data.data    ;
};

export default getAllPlan