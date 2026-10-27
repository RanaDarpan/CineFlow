import { useSelector, useDispatch } from "react-redux";
import { getErrorMessage } from "../utils/errorHandler";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router";
import getAllPlan from "../axios/getAllPlanAPI";
import getCurrentPlan from "../axios/getCurrentPlanAPI";
import purchasePlan from "../axios/purchasePlanAPI";
import deletePlan from "../axios/deletePlanAPI";
import cancelPlan from "../axios/cancelPlanAPI";
import addSubscription from "../axios/addPlanAPI";
import getUser from "../axios/getUser";
import { authSuccess } from "../slices/authSlice";

export default function Subscription() {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const type = user?.type; 
    const navigate = useNavigate();

    const [plans, setPlans] = useState([]);
    const [currentPlan, setCurrentPlan] = useState(null);
    const [loading, setLoading] = useState(false);

    const [showAddModal, setShowAddModal] = useState(false);


    const [formData, setFormData] = useState({
        plan_name: "",
        price: "",
        duration_days: "",
        resolution: "1080p" 
    });


    const fetchPlans = async () => {
        setLoading(true);

        
        try {
            const res = await getAllPlan();
            setPlans(Array.isArray(res) ? res : []);
        } catch (error) {
            console.log(error);
            toast.error(getErrorMessage(error, "We couldn't process your subscription at this time."));
            setLoading(false);
            return; 
        }

        try {
            const curr = await getCurrentPlan();
            if (typeof curr === 'string') {
                setCurrentPlan(null);
            } else {
                setCurrentPlan(curr);
            }
        } catch (error) {
            console.log("No active plan found or error fetching it:", error);
            setCurrentPlan(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlans();
    }, []);

    const handlePurchase = async (planId) => {
        try {
            setLoading(true);
            if (currentPlan) {
                await cancelPlan();
                setCurrentPlan(null);
            }
            await purchasePlan(planId);
            
            const userRes = await getUser();
            dispatch(authSuccess(userRes.data));
            
            await fetchPlans(); 
            console.log("Purchase successful");
            navigate("/profile-select");
        } catch (error) {
            const msg = getErrorMessage(error, "We couldn't process your subscription at this time.");
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async () => {
        if (!window.confirm("Are you sure you want to cancel your subscription?")) return;
        try {
            setLoading(true);
            await cancelPlan();

            const userRes = await getUser();
            dispatch(authSuccess(userRes.data));
            
            setCurrentPlan(null);
            alert("Subscription cancelled successfully");
            await fetchPlans(); 
        } catch (error) {
            toast.error(getErrorMessage(error, "We couldn't process your subscription at this time."));
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (planId) => {
        if (!window.confirm("Are you sure you want to delete this plan?")) return;
        try {
            setLoading(true);
            await deletePlan(planId);
            setPlans(plans.filter(p => p._id !== planId));
        } catch (error) {
            toast.error(getErrorMessage(error, "We couldn't process your subscription at this time."));
        } finally {
            setLoading(false);
        }
    };

    const handleAddPlanSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await addSubscription(formData);
            setShowAddModal(false);
            setFormData({ plan_name: "", price: "", duration_days: "", resolution: "1080p" });
            fetchPlans();
        } catch (error) {
            const msg = getErrorMessage(error, "We couldn't process your subscription at this time.");
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };



    return (
        <div className="min-h-screen bg-[#0f1014] text-white p-8 font-sans">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#ff4b4b] to-[#ff0000] bg-clip-text text-transparent">
                    Premium Plans
                </h1>
                <p className="text-gray-400 text-lg">Choose the best plan for your entertainment needs</p>
            </div>

            {loading && plans.length === 0 && <p className="text-center text-gray-400">Loading...</p>}


            {(!loading || plans.length > 0) && (
                <>
                    {type && (
                        <div className="text-end mb-8">
                            <button 
                                className="bg-[#e50914] text-white px-6 py-3 rounded font-semibold hover:bg-[#f40612] transition-colors shadow-lg"
                                onClick={() => setShowAddModal(true)}
                            >
                                + Add New Plan
                            </button>
                        </div>
                    )}

                    {currentPlan && (
                        <div className="bg-gradient-to-br from-[#1f1f1f] to-[#2a2a2a] p-8 rounded-xl mb-12 shadow-lg border border-[#333] flex flex-wrap justify-between items-center gap-4 max-w-4xl mx-auto">
                            <div>
                                <h2 className="text-xl text-gray-400 mb-2">Current Subscription</h2>
                                <div className="text-3xl font-bold text-white mb-1">{currentPlan.plan_name}</div>
                                <div className="text-green-500 font-bold flex items-center gap-2">
                                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                                    Active
                                </div>
                            </div>
                            <button 
                                className="bg-[#333] text-white border border-[#555] px-4 py-2 rounded hover:bg-[#e50914] hover:border-[#e50914] transition-all"
                                onClick={handleCancel}
                            >
                                Cancel Subscription
                            </button>
                        </div>
                    )}
                    
                    {!currentPlan && (
                        <div className="bg-gradient-to-br from-[#1f1f1f] to-[#2a2a2a] p-8 rounded-xl mb-12 shadow-lg border border-[#333] flex flex-wrap justify-between items-center gap-4 max-w-4xl mx-auto">
                                <h2 className="text-xl text-gray-400 mb-2">Subscribe to one plan to move ahead !!!</h2>
                        </div>
                    )}              
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                        {plans.map((plan) => (
                            <div key={plan._id} className="bg-[#161616] rounded-xl p-8 relative transition-transform hover:-translate-y-1 hover:shadow-2xl border border-[#333] flex flex-col h-full">
                                <div className="text-2xl font-bold mb-4 text-white">{plan.plan_name}</div>
                                <div className="text-4xl font-extrabold mb-2 text-[#e50914]">${plan.price}</div>
                                <div className="text-gray-400 mb-8 border-b border-[#333] pb-4">For {plan.duration_days} Days</div>
                                
                                <ul className="space-y-3 mb-8 flex-grow text-gray-300">
                                    <li className="flex items-center gap-2">
                                        <svg className="w-5 h-5 text-[#e50914]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                        Unlimited Watch History
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <svg className="w-5 h-5 text-[#e50914]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                        Cancel Anytime
                                    </li>
                                </ul>
                                
                                {currentPlan?._id === plan._id ? (
                                    <button className="w-full bg-transparent border border-[#555] text-gray-400 px-6 py-3 rounded cursor-not-allowed font-medium" disabled>
                                        Current Plan
                                    </button>
                                ) : (
                                    <button 
                                        className="w-full bg-[#e50914] text-white px-6 py-3 rounded font-semibold hover:bg-[#f40612] transition-colors"
                                        onClick={() => handlePurchase(plan._id)}
                                    >
                                        {currentPlan ? "Switch Plan" : "Subscribe Now"}
                                    </button>
                                )}

                                {type && (
                                    <div className="mt-4 pt-4 border-t border-[#333]">
                                        <button 
                                            className="w-full text-sm text-red-500 hover:text-red-400 transition-colors"
                                            onClick={() => handleDelete(plan._id)}
                                        >
                                            Delete Plan
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {showAddModal && (
                        <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 backdrop-blur-sm p-4">
                            <div className="bg-[#1f1f1f] rounded-xl p-8 w-full max-w-md shadow-2xl border border-[#333]">
                                <h2 className="text-2xl font-bold mb-6 text-center text-white">Add New Plan</h2>
                                <form onSubmit={handleAddPlanSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="block text-gray-400 text-sm">Plan Name</label>
                                        <input 
                                            type="text" 
                                            name="plan_name" 
                                            value={formData.plan_name} 
                                            onChange={handleInputChange} 
                                            className="w-full p-3 bg-[#0f1014] border border-[#333] rounded text-white focus:outline-none focus:border-[#e50914] focus:ring-1 focus:ring-[#e50914] transition-all"
                                            required 
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-gray-400 text-sm">Price ($)</label>
                                        <input 
                                            type="number" 
                                            name="price" 
                                            value={formData.price} 
                                            onChange={handleInputChange} 
                                            className="w-full p-3 bg-[#0f1014] border border-[#333] rounded text-white focus:outline-none focus:border-[#e50914] focus:ring-1 focus:ring-[#e50914] transition-all"
                                            required 
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-gray-400 text-sm">Duration (Days)</label>
                                        <input 
                                            type="number" 
                                            name="duration_days" 
                                            value={formData.duration_days} 
                                            onChange={handleInputChange} 
                                            className="w-full p-3 bg-[#0f1014] border border-[#333] rounded text-white focus:outline-none focus:border-[#e50914] focus:ring-1 focus:ring-[#e50914] transition-all"
                                            required 
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-gray-400 text-sm">Resolution</label>
                                        <select 
                                            name="resolution" 
                                            value={formData.resolution} 
                                            onChange={handleInputChange}
                                            className="w-full p-3 bg-[#0f1014] border border-[#333] rounded text-white focus:outline-none focus:border-[#e50914] focus:ring-1 focus:ring-[#e50914] transition-all appearance-none"
                                        >
                                            <option value="1080p">1080p</option>
                                            <option value="720p">720p</option>
                                            <option value="480p">480p</option>
                                            <option value="360p">360p</option>
                                        </select>
                                    </div>
                                    <div className="flex justify-end gap-3 mt-8">
                                        <button 
                                            type="button" 
                                            className="px-6 py-2 border border-[#555] rounded text-white hover:bg-[#333] transition-colors"
                                            onClick={() => setShowAddModal(false)}
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            type="submit" 
                                            className="px-6 py-2 bg-[#e50914] rounded text-white font-semibold hover:bg-[#f40612] transition-colors shadow-lg"
                                        >
                                            Add Plan
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}