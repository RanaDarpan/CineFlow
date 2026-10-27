    import axios from "axios";
    import { server } from "../../config";

    const createProfile = async(data) => {
        const res = await axios.post(`${server}/profiles/create-profile`, 
            data
         ,
        {
            withCredentials: true
        })
        return res;
    }

export default createProfile
