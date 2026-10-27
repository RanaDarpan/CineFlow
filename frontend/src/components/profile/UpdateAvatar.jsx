import { useState } from "react"
import { getErrorMessage } from "../../utils/errorHandler";
import toast from "react-hot-toast";
import updateAvatar from "../../axios/updateAvatar"
import { useDispatch, useSelector } from "react-redux"
import { setActiveProfile, setProfiles, updateProfileInList } from "../../slices/profileSlice"

export default function AvatarUpload() {
  const dispatch = useDispatch()
  const { activeProfile } = useSelector(state => state.profile)
  const [loading, setLoading] = useState(false)


  const onChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append("avatar", file)

    try {
      setLoading(true)
      const res = await updateAvatar(profile_id = activeProfile._id, formData)
      dispatch(updateProfileInList(res))
    } catch (err) {
      toast.error(getErrorMessage(err, "We couldn't update your profile at this moment."));
    } finally {
      setLoading(false)
    }
  }

  return (
    <>

      <input type="file" accept="image/*" onChange={onChange} />
      {loading && <p>Uploading...</p>}
    </>
  )
}
