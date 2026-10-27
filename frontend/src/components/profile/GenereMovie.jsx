import { useEffect, useState } from "react";
import getProfileMovieAPI from "../../axios/getProfileMovieAPI.jsx"
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import Button from "../Button";
import { Link } from "react-router";

export default function GenreMovie()
{
    const [gMovie, setGMovie] = useState([])

    const {user} = useSelector(state=>state.auth)
    const isAdmin = user?.type===true
    const navigate = useNavigate()

    useEffect(() => {
        const profileMovies = async () => {
          try {

            const res = await getProfileMovieAPI()
      
            if (!Array.isArray(res)) {
              throw new Error("Invalid API response")
            }
      
            setGMovie(res)
          } catch (error) {
            toast.error(
              error.response?.data?.message || error.message
            )
          }
        }
      
        profileMovies()
      }, [])
      


return (
    <>

    {isAdmin && 
            <div>
                <Button type="button" onClick = {()=> (navigate("/add-movies"))}>Add Movie</Button>
            </div>}

            <div>
                <Button type="button" onClick = {()=> (navigate("/active-movies"))}>All Movie</Button>
            </div>
            
            <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
            <h2 className="sr-only">Your generes Movies</h2>

            
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {gMovie.map((g)=> (
                <Link to= {`/movies/${g._id}`} className="group">
                    <img src={g.thumbnail} alt={g.description} className="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-7/8" />
                    <h3 className="mt-4 text-sm text-gray-700">{g.title}</h3>
                    <p className="mt-1 text-lg font-medium text-gray-900">{g.genres}</p>
                </Link>
                 ))}
            </div>
        </div>
        </div>
    </>
)
}