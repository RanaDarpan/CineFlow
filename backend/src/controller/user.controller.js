import ApiResponse from "../utils/ApiResponse.js"
import asyncHandler from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js"
import {Users} from "../models/users.model.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import mongoose from "mongoose"

const generateTokens = async function(user){
    try {
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false})
        return {accessToken,refreshToken}
    } catch (error) {
        throw new ApiError(500,"Something went wrong in generating tokens")
    }
}

const registerUser = asyncHandler(async(req, res)=> {
    const {name,email,password} = req.body
    if([email,name,password].some(field=>field?.trim() === ""))
    {
        throw new ApiError(400,"All fields are required")
    }
    const existingUser = await Users.findOne({email})
    if(existingUser)
    {
        throw new ApiError(400,"User already exists")
    }
    if(email === process.env.ADMIN_EMAIL)
    {
        const admin = await Users.create({name,email: email.toLowerCase(),password,type:true})
        const adminCreated = await Users.findById(admin._id).select("-password -refreshToken")
        if(!adminCreated)
        {
            throw new ApiError(400,"Admin not created")
        }
        return res.status(201).json(new ApiResponse(201, adminCreated, "Admin created successfully"))
    }
    else{
        const user = await Users.create({name,email: email.toLowerCase(),password})
        const userCreated = await Users.findById(user._id).select("-password -refreshToken")
        if(!userCreated)
        {
            throw new ApiError(400,"User not created")
        }
        return res.status(201).json(new ApiResponse(201, userCreated, "User created successfully"))
    }
})


const loginUser = asyncHandler(async(req,res)=>{
    const {email,password} = req.body
    if([email,password].some(field=>field?.trim()==""))
    {
        throw new ApiError(400,"All fields are required")
    }
    const user = await Users.findOne({email: email.toLowerCase()})
    if(!user)
    {
        throw new ApiError(400,"User not found")
    }
    const isPasswordCorrect = await user.isPasswordCorrect(password)
    if(!isPasswordCorrect)
    {   
        throw new ApiError(400,"Invalid password")
    }
    const {accessToken,refreshToken} = await generateTokens(user)

    const logUser  = await Users.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production" || process.env.COOKIE_SECURE === "true",
        sameSite: (process.env.NODE_ENV === "production" || process.env.COOKIE_SECURE === "true") ? "None" : "Lax"
    }

    return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options).json(
        
            new ApiResponse(
                200,
                {
                user: logUser,
                refreshToken: refreshToken,
                accessToken: accessToken
                },
                "User logged in successfully"
            )
    )
})

const logoutUser = asyncHandler(async(req,res)=> {
    const user = await Users.findById(req?.user._id)
    user.refreshToken = null
    const data = await user.save({validateBeforeSave: false})
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production" || process.env.COOKIE_SECURE === "true",
        sameSite: (process.env.NODE_ENV === "production" || process.env.COOKIE_SECURE === "true") ? "None" : "Lax"
    }
    return res.status(200).clearCookie("accessToken",options).clearCookie("refreshToken", options).json(
        new ApiResponse(200, {}, "User logged out Successfully")
    )
})


const refreshToken = asyncHandler(async(req,res)=>
{
    const incomingRequest = req.cookies?.refreshToken || req.body?.refreshToken
    if(!incomingRequest)
    {
        throw new ApiError(404,"Invalid request for refresh token")
    }
    try {
        const decodeToken = jwt.verify(incomingRequest, process.env.REFRESH_TOKEN_SECRET)
        const user = await Users.findById(decodeToken?._id)
        if(!user)
        {
            throw new ApiError(404, "Invalid Refresh Token")
        }
        if(incomingRequest !== user.refreshToken)
        {
            throw new ApiError(404, "Refresh Token expired")
        }
        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production" || process.env.COOKIE_SECURE === "true",
            sameSite: (process.env.NODE_ENV === "production" || process.env.COOKIE_SECURE === "true") ? "None" : "Lax"
        }

        const {accessToken, refreshToken} = await generateTokens(user)

        return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options).json(
            new ApiResponse(200,
                {
                    accessToken: accessToken,
                    refreshToken: refreshToken
                },
                "Refresh Token regenerated"
            )
        )
    } catch (error) {
        throw new ApiError(404, error.message)
    }
})

const changePassword = asyncHandler(async(req,res)=> {
    const {oldPassword, newPassword} = req.body
    const user = await Users.findById(req.user?._id)
    if(!user)
    {
        throw new ApiError(404, "User not exist")
    }
    const isPasswordValid = await user.isPasswordCorrect(oldPassword)
    if(!isPasswordValid)
    {
        throw new ApiError(404, "Invalid Old Password")
    }
    user.password = newPassword
    await user.save({validateBeforeSave: false})
    return res.status(200).json(
        new ApiResponse(200, "Password Changed Successfully")
    )
})

const getCurrentUser = asyncHandler(async(req,res)=> {
    return res.status(200).json(
        new ApiResponse(200, req.user, "User Data Fetched Successfully")
    )
})

export {registerUser, loginUser, logoutUser, refreshToken, changePassword, getCurrentUser}