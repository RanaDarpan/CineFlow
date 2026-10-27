import addPlanAPI from "../axios/addPlanAPI";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function AddPlan() {

    const navigate = useNavigate();
    const [plan, setPlan] = useState({
        plan_name: "",
        price: 0,   
        duration: 0
    })
    const addPlan = async () => {
        try {
            const res = await addPlanAPI(plan)
            navigate("/subscriptions")
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
            <form onSubmit={addPlan}>
                <input type="text" placeholder="Plan Name" value={plan.plan_name} onChange={(e) => setPlan({...plan, plan_name: e.target.value})}/>
                <input type="number" placeholder="Price" value={plan.price} onChange={(e) => setPlan({...plan, price: e.target.value})}/>
                <input type="number" placeholder="Duration" value={plan.duration} onChange={(e) => setPlan({...plan, duration: e.target.value})}/>
                <button type="submit">Add Plan</button>
            </form>
        </div>
    )
}