import { useDispatch, useSelector} from "react-redux";
import addMovie from "../../axios/addMovieAPI.jsx";
import { setActiveMovies, upsertMovie } from "../../slices/movieSlice";
import MovieForm from "./MovieForm.jsx";
import { useNavigate } from "react-router";

export default function AddMovie()
{
    const {activeProfile} = useSelector(state=>state.profile)
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const onSubmit= async (data) => {
            const formData = new FormData();
          
            formData.append("title", data.title);
            formData.append("description", data.description);
            formData.append("r_date", data.r_date);
            formData.append("age_rating", data.age_rating);
            formData.append("rating", data.rating);
            formData.append("active", data.active);
          
            data.genres.forEach(g => formData.append("genres[]", g));
          
            formData.append("thumbnail", data.thumbnail[0]);
            formData.append("video", data.video[0]);
                    
            const res = await addMovie(activeProfile._id,formData)
            dispatch(upsertMovie(res))
            if(res.active==true)
            {
                console.log("Executed")
                dispatch(setActiveMovies(res._id))
                navigate(`/${activeProfile._id}/movies`);
            }
    }

    return(
        <>
            <MovieForm onSubmit={onSubmit} isMultipart={true} />
        </>
    )
}