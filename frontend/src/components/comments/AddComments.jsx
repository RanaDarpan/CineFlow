import { useNavigate, useParams } from "react-router"
import CommentForm from "./CommentForm"
import { addReview } from "../../axios/addReviewAPI"

export default function AddComment({type,id}){

    const {profile_id} = useParams()
    const navigate = useNavigate()
    const onSubmit = async (data) => {
       try {

        console.log(type,id)
         const commentData = {
             content_type: type,
             content_id: id,
             rating: data.rating,
             comment: data.comment
         }
        
         const res = await addReview(profile_id, commentData)
         if(type=="Movies"){
            navigate(`/${profile_id}/movies/${id}`)
         }
         if(type=="Series"){
            navigate(`/${profile_id}/series/${id}`)
         }
        } catch (error) {
        console.log("Error in creating comment")
       }
    }
    return(
        <>
            <CommentForm onSubmit={onSubmit}/>
        </>
    )
}