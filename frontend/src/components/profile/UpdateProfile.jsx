import { useForm } from "react-hook-form"
import { getErrorMessage } from "../../utils/errorHandler";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux"
import updateProfile from "../../axios/updateProfile"
import { updateProfileInList } from "../../slices/profileSlice"
import { useEffect } from "react"
import { Controller } from "react-hook-form"


export default function UpdateProfile()
{
    const dispatch = useDispatch()
    const {activeProfile} = useSelector(state=>state.profile)
    const {register, handleSubmit, reset, control} = useForm()
    const [loading, setLoading] = useState(false)
    const {genres} = useSelector(state=>state.genre)


    useEffect(()=> {
        if(activeProfile)
        {
            reset({
                name: activeProfile.name,
                language: activeProfile.languages,
                maturity_rating: activeProfile.maturity_rating,
                genre: activeProfile.genres

            })
        }
    },[activeProfile, reset])

    const genreOptions = genres.map((g) => ({ value: g.name, label: g.name }));


    const onUpdate = async (data) => {
      try {

        setLoading(true)
          const res = await updateProfile(profile_id = activeProfile._id, data)
          dispatch(updateProfileInList(res))
      } catch (error) {
        toast.error(getErrorMessage(error, "We couldn't update your profile at this moment."));
      } finally
      {
        setLoading(false)
      }
    }

    return (
        <>
            {loading && <p>Loading......</p>}
          <form
            onSubmit={handleSubmit(onUpdate)}
            className="mt-8"
            encType="multipart/form-data"
          >
            <div className="space-y-5">
              <Input
                label="Name"
                placeholder="Enter your name"
                {...register("name", { required: true })}
              />
    
              <Select
                label="Language"
                options={["English", "Hindi"]}
                {...register("language", { required: true })}
              />
    
              <Select
                label="Maturity Rating"
                options={["All", "Kids", "13+", "16+", "18+"]}
                {...register("maturity_rating", { required: true })}
              />
    
            <Controller
                name="genre"
                control={control}
                render={({ field }) => (
                    <Select
                    label="Preferred Genres"
                    options={genreOptions}
                    multiple
                    value={genreOptions.filter(opt =>
                        field.value?.includes(opt.value)
                    )}
                    onChange={(selected) =>
                        field.onChange(selected.map(s => s.value))
                    }
                    />
                )}
            />

    
              <Button type="submit" className="w-full">
                Update Profile
              </Button>
            </div>
          </form>
        </>
      );
}