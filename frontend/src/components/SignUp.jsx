import { useDispatch } from "react-redux"
import { getErrorMessage } from "../utils/errorHandler.js";
import toast from "react-hot-toast";
import signUp from "../axios/signUp";
import { useNavigate } from "react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Button from "./Button"
import Input from "./Input"

export default function SignUp() {

    const dispatch = useDispatch()
    const {register, handleSubmit} = useForm()

    const navigate = useNavigate()

    async function registerUser(data)
    {
        try{
            const user = await signUp(data)
            if(user)
            {
                navigate("/login")
            }
        }catch(error)
        {
            toast.error(getErrorMessage(error, "We couldn't sign you in. Please check your credentials."));
        }
    }
    return(
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center w-full px-4 py-12">
            <div className={`mx-auto w-full max-w-md bg-neutral-900/80 backdrop-blur-sm rounded-2xl p-8 border border-neutral-800 shadow-2xl`}>
                <div className="mb-8 flex justify-center">
                   {/* Import Logo if needed, or just keep consistent header */}
                   <span className="text-xl font-semibold tracking-tight text-white">Create Account</span>
                </div>
                

                <form onSubmit={handleSubmit(registerUser)} className="space-y-6">
                    <div className="space-y-4">
                        <Input label="Full Name" placeholder="Enter your full name" {...register("name", {required: true})}/>
                        <Input label="Email" placeholder="Enter your email" {...register("email", {required: true, validate: {
                            matchPattern: (value) => (
                                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) || "Email address must be a valid address"
                            )
                        }})}/>
                        <Input label="Password" placeholder="Create a password" type="password" {...register("password", {required: true})} />
                    </div>
                    <Button variant="primary" type="submit" className="w-full">Create Account</Button>
                </form>
             </div>
        </div>
    )
}