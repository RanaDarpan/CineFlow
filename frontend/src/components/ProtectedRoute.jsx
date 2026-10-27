import { useSelector } from "react-redux";
import {Navigate} from "react-router"
export default function ProtectedRoute({children}){
    const {isAuthenticated, loading} = useSelector(state=>state.auth)

    if(loading)
        return<div>Loading...</div>

    if(!isAuthenticated)
        return <Navigate to="/login" />

    return children;
}
