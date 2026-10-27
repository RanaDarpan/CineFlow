import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import Button from "../Button";
import { deleteReview } from "../../axios/deleteReviewAPI";
import toast from "react-hot-toast";

export default function MyReviews({ reviews: initialReviews }) {
    const { profile_id } = useParams();
    const navigate = useNavigate();
    console.log("MyReviews Props:", initialReviews);
    const [reviews, setReviews] = useState(initialReviews);


    const handleDelete = async (review_id) => {
        if(!window.confirm("Are you sure you want to delete this review?")) return;
        try {
            await deleteReview(profile_id, review_id);
            setReviews(reviews.filter(r => r._id !== review_id));
        } catch (err) {
            toast.error("Failed to delete review");
        }
    };

    const handleUpdate = (review) => {
        navigate(`/${profile_id}/comments/update-comment/${review._id}`, {
            state: {
                comment: review.comment,
                rating: review.rating,
                content_type: review.content_type,
                content_id: review.content_id?._id || review.content_id
            }
        });
    };

    return (
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold text-white mb-8">My Reviews</h1>
            

            
            {reviews.length === 0 ? (
                 <div className="flex min-h-[20vh] items-center justify-center rounded-lg bg-neutral-900 p-8 text-neutral-500">
                    <p>No reviews yet.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {reviews.map(review => (
                        <div key={review._id} className="rounded-xl bg-neutral-900 p-6 shadow-sm border border-neutral-800 transition-colors hover:border-neutral-700">
                             <div className="flex justify-between items-start mb-4">
                                <div>
                                     <h3 className="text-lg font-semibold text-white mb-1">
                                        {review.content_id?.title || review.content_id}
                                    </h3>
                                    <div className="flex gap-2">
                                        <span className="inline-flex items-center rounded-md bg-neutral-800 px-2 py-1 text-xs font-medium text-neutral-400 ring-1 ring-inset ring-neutral-700/10">
                                            {review.content_type}
                                        </span>
                                        <span className="inline-flex items-center rounded-md bg-yellow-900/20 px-2 py-1 text-xs font-medium text-yellow-500 ring-1 ring-inset ring-yellow-500/20">
                                            ★ {review.rating}/10
                                        </span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="ghost" className="text-sm" onClick={() => handleUpdate(review)}>Edit</Button>
                                    <Button variant="ghost" className="text-sm text-red-400 hover:text-red-300 hover:bg-red-900/20" onClick={() => handleDelete(review._id)}>Delete</Button>
                                </div>
                             </div>
                             
                             <p className="text-neutral-300 leading-relaxed text-sm">
                                {review.comment}
                             </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
