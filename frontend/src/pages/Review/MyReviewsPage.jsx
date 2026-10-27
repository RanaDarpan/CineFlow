import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router";
import { getProfileReviews } from "../../axios/getProfileReviewsAPI";
import MyReviews from "../../components/reviews/MyReviews";

export default function MyReviewsPage() {
    const { profile_id } = useParams();
    const location = useLocation(); // Import useLocation
    const filterId = location.state?.filter_content_id;

    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        (async () => {
            try {
                const data = await getProfileReviews(profile_id);
                let fetchedReviews = data.data || [];
                
                if (filterId) {
                    fetchedReviews = fetchedReviews.filter(r => 
                         r.content_id && (r.content_id._id === filterId || r.content_id === filterId)
                    );
                }
                
                setReviews(fetchedReviews);
            } catch (err) {
                // If 404 (no reviews), just set empty
                if(err.response && err.response.status === 404) {
                    setReviews([]);
                } else {
                    setError("Failed to load reviews");
                }
            } finally {
                setLoading(false);
            }
        })();
    }, [profile_id]);

    if(loading) return <p className="text-white p-4">Loading reviews...</p>;
    if(error) return <p className="text-red-500 p-4">{error}</p>;

    return (
        <div className="p-4">
            <h1 className="text-2xl text-white mb-6">My Reviews</h1>
            <MyReviews reviews={reviews} />
        </div>
    );
}
