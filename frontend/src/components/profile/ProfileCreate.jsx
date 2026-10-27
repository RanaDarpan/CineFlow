import { useNavigate } from "react-router";
import { getErrorMessage } from "../../utils/errorHandler";
import toast from "react-hot-toast";
import createProfile from "../../axios/createProfile";
import { useDispatch, useSelector } from "react-redux";
import Input from "../Input";
import Button from "../Button";
import Select from "../Select";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { setActiveProfile, setProfiles } from "../../slices/profileSlice";

export default function ProfileCreate() {
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const { register, handleSubmit, setValue } = useForm();
  const genres = useSelector((state) => state.genre.genres);
  let genreOptions = genres?.map((g) => ({ value: g.name, label: g.name })) || [];
  
  const onCreate = async (data) => {

    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("avatar", data.avatar[0]); 
      formData.append("languages", data.languages);
      formData.append("maturity_rating", data.maturity_rating);


      const genreArray = Array.isArray(data.genre) ? data.genre : (data.genre ? [data.genre] : []);
      genreArray.forEach((id) => formData.append("genre[]", id));

      const res = await createProfile(formData);
      console.log(res.data.data)
      dispatch(setProfiles(res.data.data));
      navigate(`/profile-select`);
    } catch (err) {
      toast.error(getErrorMessage(err, "We couldn't update your profile at this moment."));
    }
  };

  return (
    <div className="flex items-center justify-center w-full px-4">
      <div className={`mx-auto w-full max-w-md bg-neutral-900/50 rounded-2xl p-8 border border-neutral-800 shadow-2xl`}>
          <h2 className="text-center text-2xl font-bold leading-tight text-white mb-8">Create Profile</h2>
          
          <form
            onSubmit={handleSubmit(onCreate)}
            className="space-y-6"
            encType="multipart/form-data"
          >
              <Input
                label="Name"
                placeholder="Profile Name"
                {...register("name", { required: true })}
              />

              <Input
                label="Avatar"
                type="file"
                className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-neutral-800 file:text-white hover:file:bg-neutral-700 text-neutral-400"
                accept="image/png, image/jpg, image/jpeg, image/gif"
                {...register("avatar", { required: true })}
              />

              <Select
                label="Language"
                options={["English", "Hindi"]}
                {...register("languages", { required: true })}
              />

              <Select
                label="Maturity Rating"
                options={["All", "Kids", "13+", "16+", "18+"]}
                {...register("maturity_rating", { required: true })}
              />

              <Select
                label="Preferred Genres"
                options={genreOptions}
                multiple
                className="h-32" 
                {...register("genre", { required: false })}
              />

              <div className="pt-4">
                  <Button variant="primary" type="submit" className="w-full">
                    Save Profile
                  </Button>
                  <Button variant="ghost" onClick={() => navigate(-1)} className="w-full mt-2">
                    Cancel
                  </Button>
              </div>
          </form>
      </div>
    </div>
  );
};
