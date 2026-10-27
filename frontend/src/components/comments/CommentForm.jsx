import { useEffect } from "react"
import { useForm } from "react-hook-form"
import Input from "../Input"
import Button from "../Button"

export default function CommentFunction(
    {initialData, onSubmit}
) {
    const {register, handleSubmit, reset} = useForm(
        {defaultValues: {
            rating: 0,
            comment: ""
        }}
    )

    useEffect(() => {
        if(initialData)
        {
            reset(initialData)
        } else {
            reset({
                rating: 0,
                comment: ""
            })
        }
    }, [initialData, reset])
    return (
        <div>
       <form onSubmit={handleSubmit(onSubmit)}>
        <Input type="number" label="Rating"  placeholder="Enter Rating" {...register("rating", {required: true})} name="rating" />
        <Input type="text" label="Comment"  placeholder="Enter Comment" {...register("comment", {required: true})} name="comment" />
         <Button type="submit" className="w-full">
                  {initialData ? "Update" : "Add"}
        </Button>
       </form>
       </div>
    )
}