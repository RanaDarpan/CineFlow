import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import Input from "../Input.jsx"
import Button from "../Button.jsx"
import Select from "../Select.jsx" 
import { useSelector } from "react-redux";

const FilmIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-white"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 3v18"/><path d="M3 7.5h4"/><path d="M3 12h18"/><path d="M3 16.5h4"/><path d="M17 3v18"/><path d="M17 7.5h4"/><path d="M17 16.5h4"/></svg>
);

export default function MovieForm({ initialData, onSubmit, isMultipart }) {
  const { register, handleSubmit, reset, control} = useForm({
    defaultValues: {
      title: "",
      description: "",
      genres: [],
      r_date: "",
      age_rating: "",
      active: true,
      rating: 0
    }
  });

  const genres = useSelector((state) => state.genre.genres);
  let genreOptions = genres?.filter((g)=>g.active==true).map((g) => ({ value: g._id, label: g.name })) || [];
  
  let encType = "application/x-www-form-urlencoded"
  if(isMultipart) {
    encType ="multipart/form-data"
  }

  useEffect(() => {
    if (initialData) {
      reset({
        ...initialData,
        r_date: initialData.r_date ? new Date(initialData.r_date).toISOString().split('T')[0] : ""
      });
    } else {
      reset({ 
        title: "",
        description: "",
        genres: [],
        r_date: "",
        active: true,
        age_rating: "" 
      });
    }
  }, [initialData, reset]);
  
  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 sm:p-10 backdrop-blur-xl w-full max-w-4xl mx-auto shadow-2xl">
        <div className="mb-8 flex items-center gap-5 border-b border-neutral-800 pb-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-neutral-800 shadow-inner">
                <FilmIcon />
            </div>
            <div>
                <h2 className="text-3xl font-black text-white tracking-tight">{initialData ? "Edit Movie" : "Add New Movie"}</h2>
                <p className="text-sm text-neutral-400 mt-1">Configure the core details of your movie.</p>
            </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} encType={encType} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                    <Input
                        label="Title"
                        placeholder="Enter Movie Title..."
                        {...register("title", { required: true })}
                    />
                </div>

                <div className="md:col-span-2">
                    <Input
                        label="Description"
                        placeholder="Enter description..."
                        {...register("description")}
                    />
                </div>

                <Controller
                    name="genres"
                    control={control}
                    render={({ field }) => (
                        <Select
                            label="Genres (Select multiple)"
                            options={genreOptions}
                            multiple
                            className="min-h-[120px]"
                            value={field.value}
                            onChange={(e) => {
                                const values = Array.from(
                                    e.target.selectedOptions,
                                    option => option.value
                                );
                                field.onChange(values);
                            }}
                        />
                    )}
                />

                <div className="space-y-6">
                    <Select
                        label="Age Rating"
                        options={["All", "Kids", "13+", "16+", "18+"]}
                        {...register("age_rating", { required: true })}
                    />
                    <Input
                        type="date"
                        label="Release Date"
                        {...register("r_date", { required: true })}
                    />
                </div>

                <Input
                    type="number"
                    label="Rating (out of 10)"
                    placeholder="e.g. 8.5"
                    step="0.1"
                    {...register("rating", { required: true })}
                />

                <div className="hidden md:block"></div> {/* Spacer */}

                {isMultipart && (
                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-xl border-2 border-dashed border-neutral-700 bg-neutral-800/30 hover:bg-neutral-800/50 transition-colors">
                        <Input
                            label="Thumbnail Image"
                            type="file"
                            accept="image/png, image/jpg, image/jpeg, image/gif"
                            {...register("thumbnail", { required: true })}
                        />
                        <Input
                            label="Video File"
                            type="file"
                            accept="video/mp4"
                            {...register("video", { required: true })}
                        />
                    </div>
                )}
            </div>

            <div className="pt-6 mt-8 border-t border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center">
                        <input
                            type="checkbox"
                            id="active"
                            className="peer sr-only"
                            {...register("active")}
                        />
                        <div className="w-11 h-6 bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </div>
                    <span className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">Is Active</span>
                </label>
                
                <Button type="submit" variant="primary" className="w-full sm:w-auto px-8 py-3 text-lg font-bold tracking-wide">
                    {initialData ? "Save Changes" : "Create Movie"}
                </Button>
            </div>
        </form>
    </div>
  );
}
