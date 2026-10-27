import AddComment from "../../components/comments/AddComments";
import { useParams } from "react-router";

export default function AddCommentPage(){
    const { type, id } = useParams();
    return(
        <>
            <AddComment type={type} id={id}/>
        </>
    )
}
