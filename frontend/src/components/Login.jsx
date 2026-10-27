import login from "../axios/login.jsx";
import { getErrorMessage } from "../utils/errorHandler.js";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import {useForm} from   "react-hook-form"
import { authSuccess } from "../slices/authSlice.js";
import Input from "./Input";
import Button from "./Button";
import Logo from "./Logo";
import getAllGenre from "../axios/getAllGenre.jsx";
import { genreFail, genreSuccess } from "../slices/genreSlice.js";

export default function Login(){
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector((state) => state.auth);

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/profile-select");
        }
    }, [isAuthenticated, navigate]);

    const { register, handleSubmit } = useForm();

  
    const onLogin = async (data) => {
        try {
          const session = await login(data);
            if(session){
                    dispatch(authSuccess(session.user));
                    navigate("/profile-select");
                }
        } catch (error) {   
          dispatch(genreFail(error.message))
          toast.error(getErrorMessage(error, "We couldn't sign you in. Please check your credentials."));
        }
      };

    return(
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center w-full px-4 py-12">
      <div
        className={`mx-auto w-full max-w-md bg-neutral-900/80 backdrop-blur-sm rounded-2xl p-8 border border-neutral-800 shadow-2xl`}>
        <div className="mb-8 flex justify-center">
            <Logo width="auto" />
        </div>
        <h2 className="text-center text-2xl font-bold leading-tight text-white mb-2">
          Welcome back
        </h2>
        <p className="mb-8 text-center text-sm text-neutral-400">
          Don&apos;t have an account?&nbsp;
          <Link
            to="/signup"
            className="font-medium text-white transition-all duration-200 hover:text-neutral-300 hover:underline"
          >
            Sign Up
          </Link>
        </p>

        <form onSubmit={handleSubmit(onLogin)} className="space-y-6">
          <div className="space-y-4">
            <Input label="Email" placeholder="e.g. alice@example.com" type="email" {...register("email", { required: true, validate: {
                matchPattern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                        "Email address must be a valid address",
            }})}/>
            <Input label="Password" placeholder="Enter your password" type="password" {...register("password", {required: true})}/>
          </div>
          <Button variant="primary" type="submit" className="w-full">Sign In</Button>
        </form>
      </div>
    </div>
    )
}