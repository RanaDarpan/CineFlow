import { useState, useEffect } from "react"
import { getErrorMessage } from "../utils/errorHandler";
import toast from "react-hot-toast";
import getProfileWatchList from "../axios/getProfileWatchListAPI"
import { useParams, Link } from "react-router"

export default function WatchList() {
    const [watchList, setWatchList] = useState([])
    const [loading, setLoading] = useState(false)

    const {profile_id} = useParams()
    
    useEffect(() => {
        const fetchWatchList = async() => {
            try {
                setLoading(true)
                const res = await getProfileWatchList(profile_id)
                // Ensure data is array
                const data = res.data || res; 
                setWatchList(Array.isArray(data) ? data : [])
                setLoading(false)
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    setWatchList([]);
                } else {
                    toast.error(getErrorMessage(error, "Unable to load your watchlist."));
                }
                setLoading(false)
            }
        }
        fetchWatchList()
    }, [profile_id])
    
    if (loading) return (
       <div className="flex min-h-[50vh] items-center justify-center">
         <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
       </div>
    );
    
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="mb-8 text-3xl font-bold text-white">My Watchlist</h1>
            
            {watchList.length === 0 ? (
                 <div className="rounded-lg bg-neutral-900 p-12 text-center text-neutral-500">
                    <p className="text-lg">Your watchlist is currently empty.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:gap-x-8">
                {watchList.map((item) => {
                    const content = item.content_id;
                    if(!content) return null;
                    
                    // Determine link based on content type (assuming 'Series' vs 'Movies' logic might exist, or generic)
                    // The API response seems to have embedded content_id object.
                    // Assuming similar structure to Movie items.
                    // Ideally we should know if it is a movie or series. 
                    // For now, defaulting to movies link if type is missing, or trying to guess.
                    // The backend typically sends content_type in the item if styled correctly
                    const typePath = item.content_type === "Series" ? "series" : "movies";
                    
                    return (
                        <Link 
                            key={item._id} 
                            to={`/${profile_id}/${typePath}/${content._id}`}
                            className="group relative flex flex-col gap-2"
                        >
                            <div className="aspect-[2/3] w-full overflow-hidden rounded-md bg-neutral-800 transition-transform duration-300 group-hover:scale-105 group-hover:shadow-xl group-hover:shadow-black/50">
                                <img 
                                    src={content.thumbnail} 
                                    alt={content.title} 
                                    className="h-full w-full object-cover object-center"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                            </div>
                            <h3 className="truncate text-sm font-medium text-neutral-200 group-hover:text-white transition-colors">
                                {content.title}
                            </h3>
                        </Link>
                    )
                })}
                </div>
            )}
        </div>
    )
}