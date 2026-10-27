import { useDispatch, useSelector} from "react-redux";
import { selectMovieById, setActiveMovies, upsertMovie } from "../../slices/movieSlice";
import MovieForm from "./MovieForm.jsx";
import updateMovie from "../../axios/updateMovieAPI.jsx";
import { useNavigate, useParams } from "react-router";


export default function UpdateMovie()
{
    const {movie_id} = useParams()
    const selectedmovie = useSelector(state=>selectMovieById(state,movie_id))
    const {activeProfile} = useSelector(state=>state.profile)
    const profile_id = activeProfile._id
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const onSubmit= async (data) => {
        const res = await updateMovie(activeProfile._id,selectedmovie._id,data)
        dispatch(upsertMovie(res))
        if(res.active==true)
        {
            dispatch(setActiveMovies(res._id))
        }
        navigate(`/${profile_id}/movies/${movie_id}`)
    }
    
    return(
        <>
            <MovieForm initialData={selectedmovie} onSubmit={onSubmit} isMultipart={false} />
        </>
    )
}