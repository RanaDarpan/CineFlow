import { useEffect } from "react";
import { useForm } from "react-hook-form";
import Input from "../Input.jsx"
import Button  from "../Button.jsx"

const PlayIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-white"><polygon points="6 3 20 12 6 21 6 3"/></svg>
);

export default function EpisodeForm({ initialData, onSubmit, isMultipart }) {
  const { register, handleSubmit, reset} = useForm({
    defaultValues: {
      episode_no: "",
      description: "",
      title: "",
      r_date: "",
    }
  });
  
  let encType = "application/x-www-form-urlencoded"
  if(isMultipart)
  {
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
        episode_no: "",
        description: "",  
        title: "",
        r_date: "", 
      });
    }
  }, [initialData, reset]);
  
  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 sm:p-10 backdrop-blur-xl w-full max-w-4xl mx-auto shadow-2xl">
        <div className="mb-8 flex items-center gap-5 border-b border-neutral-800 pb-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-neutral-800 shadow-inner">
                <PlayIcon />
            </div>
            <div>
                <h2 className="text-3xl font-black text-white tracking-tight">{initialData ? "Edit Episode" : "Add New Episode"}</h2>
                <p className="text-sm text-neutral-400 mt-1">Fill in the details below to configure the episode.</p>
            </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} encType={encType} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                    <Input
                        label="Title"
                        placeholder="Enter episode title..."
                        {...register("title", { required: true })}
                    />
                </div>

                <Input
                    label="Episode Number"
                    type="number"
                    placeholder="e.g. 1"
                    {...register("episode_no", { required: true })}
                />

                <Input
                    type="date"
                    label="Release Date"
                    {...register("r_date", { required: true })}
                />

                <div className="md:col-span-2">
                    <Input
                        label="Description"
                        placeholder="Provide a brief synopsis of the episode..."
                        {...register("description")}
                    />
                </div>

                {isMultipart && (
                    <div className="md:col-span-2 p-6 rounded-xl border-2 border-dashed border-neutral-700 bg-neutral-800/30 hover:bg-neutral-800/50 transition-colors">
                        <Input
                            label="Video File"
                            type="file"
                            accept="video/mp4"
                            {...register("video", { required: true })}
                        />
                    </div>
                )}
            </div>

            <div className="pt-6 mt-8 border-t border-neutral-800">
                <Button type="submit" variant="primary" className="w-full py-4 text-lg font-bold tracking-wide">
                {initialData ? "Save Changes" : "Create Episode"}
                </Button>
            </div>
        </form>
    </div>
  );
}
