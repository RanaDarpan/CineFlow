import { useDispatch, useSelector} from "react-redux";
import updateSeason from "../../axios/updateSeasonAPI.jsx";
import toast from "react-hot-toast";
import { selectSeasonById, upsertSeason } from "../../slices/seriesSlice.js";
import SeasonForm from "./SeasonForm.jsx";
import { useNavigate, useParams } from "react-router";
import { useState } from "react";




export default function UpdateSeason() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { series_id, season_id } = useParams()

  const { activeProfile } = useSelector(state => state.profile)
  const selectedSeason = useSelector(state =>
    selectSeasonById(state, season_id)
  )


  const [loading, setLoading] = useState(false)

  if (!activeProfile || !selectedSeason) {
    return <p>Loading season data...</p>
  }

  const onSubmit = async (data) => {
    try {
      setLoading(true)


      const res = await updateSeason(
        activeProfile._id,
        series_id,
        selectedSeason._id,
        data
      )

      dispatch(upsertSeason(res))

      navigate(`/${activeProfile._id}/series/${series_id}/season/${season_id}`)

    } catch (err) {
        const message =
        err.message ||
        "Failed to update season"
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>

      <SeasonForm initialData={selectedSeason} onSubmit={onSubmit} disabled={loading} />
    </>
  )
}
