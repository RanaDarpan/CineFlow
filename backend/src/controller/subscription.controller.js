import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { Subscription as Sub } from "../models/subscription.model.js";
import { Users } from "../models/users.model.js";

const getAllPlans = asyncHandler(async(req,res)=>{
    const plans = await Sub.find()
    return res.status(200).json(
        new ApiResponse(200,
            plans,
            "Plans Fetched Successfully"
        ) 
    )
})

const addPlan = asyncHandler(async(req,res)=> {
    if(process.env.ADMIN_EMAIL !== req.user.email)
    {
        throw new ApiError(404, "Only Admin is allowed")
    }
    const {plan_name, price, duration_days, resolution} = req.body
    if(!plan_name || plan_name.trim()==="" || !price || !duration_days || !resolution || resolution.trim()==="")
    {
        throw new ApiError(404,"All fields are required")
    }
    
    const validResolutions = ["1080p", "720p", "480p", "360p"]
    if(!validResolutions.includes(resolution.trim()))
    {
        throw new ApiError(400, "Invalid resolution. Must be one of: 1080p, 720p, 480p, 360p")
    }
    
    const planName = plan_name.trim().toLowerCase()
    const existingPlan = await Sub.findOne({plan_name: planName})
    if(existingPlan)
    {
        throw new ApiError(404,"Plan already exists")
    }

    const response = await Sub.create({plan_name: planName, price, duration_days, resolutions: resolution.trim()})
    if(response)
    {
        return res.status(200).json(
            new ApiResponse(200, 
             response,
             "Plan added successfully"
            )
        )
    }
    else
    {
        throw new ApiError(404, "Error occured while adding the plan")
    }
})

const deletePlan = asyncHandler(async(req,res)=>
{
    if(process.env.ADMIN_EMAIL !== req.user.email)
        {
            throw new ApiError(404, "Only Admin is allowed")
        }
    const {plan_id} = req.params
    const plan_details = await Sub.findById(plan_id)
    if(!plan_details)
    {
        throw new ApiError(404, "No such plan exist in the system")
    }
    const result = await Sub.deleteOne({_id: plan_id})
    if(result.deletedCount===0)
    {
        throw new ApiError(500, "Error in deleting the plan")
    }
    return res.status(200).json(
        new ApiResponse(200, "Plan deleted successfully")
    )
 })

 const getPlanDetails = asyncHandler(async(req,res)=>
{
    const {plan_id} = req.params
    const plan_details = await Sub.findById(plan_id)
    if(!plan_details)
    {
        throw new ApiError(404, "No such plan")
    }
    return res.status(200).json(
        new ApiResponse(200, plan_details, "Plan details fetched")
    )
})


const purchasePlan = asyncHandler(async(req,res)=>
{
    const {plan_id} = req.params
    const user = req?.user
    const plan = await Sub.findById(plan_id)
    if(!plan)
    {
        throw new ApiError(404, "Plan not found")
    }

    const loginUser = await Users.findById(user._id).select("-password -refreshToken")
    if(loginUser.subscription.status===true)
    {
        throw new ApiError(404, "First cancel the current subscription")
    }
    const s_date = new Date()
    const e_date = new Date()
    e_date.setDate(e_date.getDate() + plan.duration_days)

    loginUser.subscription.s_date = s_date
    loginUser.subscription.e_date = e_date
    loginUser.subscription.plan_id = plan_id
    loginUser.subscription.status = true

    await loginUser.save({validateBeforeSave: false})

    return res.status(200).json(
        new ApiResponse(200, loginUser.subscription, "Subscription activated successfully")
    )
})

const getCurrentSubscription = asyncHandler(async(req,res)=> {
    const user = req?.user
    const loginUser = await Users.findById(user._id)
    if(loginUser.subscription.plan_id === null)
    {
        return res.status(200).json(
            new ApiResponse(200, "No Plan Subscribed")
        )
    }
    if(loginUser.subscription.status === false)
    {
        throw new ApiError(404, "No current active plan, first subscribe to a plan")
    }
    const plan_detail = await Sub.findById(loginUser.subscription.plan_id)
    return res.status(200).json(
        new ApiResponse(200,
            plan_detail,
            "Plan details Fetched Successfully"
        )
    )
})

const cancelSubscription = asyncHandler(async(req,res)=>
{
    const user = await Users.findById(req?.user._id)
    user.subscription.status = false
    await user.save({validateBeforeSave: false})
    return res.status(200).json(
        new ApiResponse(200, "Plan/Subscription Cancelled Successfully")
    )
})

export { getAllPlans, purchasePlan, getCurrentSubscription, cancelSubscription, addPlan, deletePlan, getPlanDetails}