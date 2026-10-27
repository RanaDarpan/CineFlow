import axios from "axios";
import { server } from "../../config";

const getAllProfile = async() => {
    const res = await axios.get(`${server}/profiles/get-all-profile`, 
    {   
        withCredentials: true
    })
    console.log(res.data.data)
    return res.data.data;
}

export default getAllProfile
