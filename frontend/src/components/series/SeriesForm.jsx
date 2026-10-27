import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import Input from "../Input.jsx"
import Button  from "../Button.jsx"
import Select from "../Select.jsx" 
import { useSelector } from "react-redux";

const TvIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-white"><rect width="20" height="15" x="2" y="7" rx="2" ry="2"/><polyline points="17 2 12 7 7 2"/></svg>
);

export default function SeriesForm({ initialData, onSubmit, isMultipart }) {
  const { register, handleSubmit, reset, control} = useForm({
    defaultValues: {
      title: "",
      description: "",
      genres: [],
      r_date: "",
      age_rating: "",
      total_seasons: 1,
      rating: 0,
      active: true
    }
  });
  
  const genres = useSelector((state) => state.genre.genres);
  const genreOptions = genres.filter((g)=>g.active===true).map((g) => ({ value: g._id, label: g.name }))
  
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
        age_rating: "" ,
        total_seasons: 1,
        rating: 0,
        active: true,
      });
    }
  }, [initialData, reset]);

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 sm:p-10 backdrop-blur-xl w-full max-w-4xl mx-auto shadow-2xl">
        <div className="mb-8 flex items-center gap-5 border-b border-neutral-800 pb-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-neutral-800 shadow-inner">
                <TvIcon />
            </div>
            <div>
                <h2 className="text-3xl font-black text-white tracking-tight">{initialData ? "Edit Series" : "Add New Series"}</h2>
                <p className="text-sm text-neutral-400 mt-1">Configure the core details of your television series.</p>
            </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} encType={encType} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                    <Input
                        label="Title"
                        placeholder="Enter Series Title..."
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
                        label="Release date"
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

                <Input
                    type="number"
                    label="Total Seasons"
                    placeholder="e.g. 1"
                    {...register("total_seasons", { required: true })}
                />

                {isMultipart && (
                    <div className="md:col-span-2 p-6 rounded-xl border-2 border-dashed border-neutral-700 bg-neutral-800/30 hover:bg-neutral-800/50 transition-colors">
                        <Input
                            label="Thumbnail Image"
                            type="file"
                            accept="image/png, image/jpg, image/jpeg, image/gif"
                            {...register("thumbnail", { required: true })}
                        />
                    </div>
                )}
            </div>

            <div className="pt-6 mt-8 border-t border-neutral-800 flex items-center justify-between">
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
                
                <Button type="submit" variant="primary" className="px-8 py-3 text-lg font-bold tracking-wide">
                    {initialData ? "Save Changes" : "Create Series"}
                </Button>
            </div>
        </form>
    </div>
  );
}
