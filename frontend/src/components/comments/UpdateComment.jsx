import { useNavigate, useParams, useLocation } from "react-router"
import CommentForm from "./CommentForm"
import { updateReview } from "../../axios/updateReviewAPI"

export default function UpdateComment(){
    const { profile_id, review_id } = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    let { comment, rating, content_type, content_id } = location.state || {}
    
    // Safety check: if content_id is an object (populated), extract _id
    if (typeof content_id === 'object' && content_id !== null) {
        content_id = content_id._id;
    }

    const onSubmit = async (data) => {
       try {
         const commentData = {
             content_type,
             content_id,
             rating: data.rating,
             comment: data.comment
         }
        
         await updateReview(profile_id, review_id, commentData)
         navigate(`/${profile_id}/${content_type.toLowerCase()}/${content_id}`)
        } catch (error) {
        console.log("Error in updating comment", error)
       }
    }

    if (!comment && !rating) return <p>No review data found to update.</p>

    return(
        <>
            <h1 className="text-white text-xl mb-4">Update Review</h1>
            <CommentForm onSubmit={onSubmit} initialData={{comment, rating}} />
        </>
    )
}