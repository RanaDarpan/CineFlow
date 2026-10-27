import { useDispatch, useSelector } from "react-redux";
import deleteProfile from "../../axios/deleteProfile";
import toast from "react-hot-toast";
import { deleteProfileInList } from "../../slices/profileSlice";
import { useNavigate} from "react-router";
import { useState } from "react";
import Button from "../Button";

export default function DeleteProfile(){
    const dispatch  = useDispatch()
    const {activeProfile} = useSelector(state=>state.profile)

    const [loading, setLoading] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)

    const navigate = useNavigate()

    const removeProfile = async () => {
     try {
            setLoading(true)
            const res = await deleteProfile(activeProfile._id)
            dispatch(deleteProfileInList(activeProfile._id))
            navigate("/profile-select")
     } catch (error) {
            toast.error(error.message)
     } finally {
            setLoading(false)
     }
    }
     return (
        <>

            <Button
            type="button"
            className="w-full"
            onClick={() => setShowConfirm(true)}
            >
            Delete Profile
            </Button>
            {showConfirm && (
            <div className="modal">
                <p>Delete profile permanently?</p>

                <Button onClick={removeProfile} disabled={loading}>
                {loading ? "Deleting..." : "Yes, delete"}
                </Button>

                <Button onClick={() => setShowConfirm(false)}>
                Cancel
                </Button>
            </div>
            )}
       </>
    )
}