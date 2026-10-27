import { useEffect } from "react";
import { useForm } from "react-hook-form";
import Input from "../Input"
import Button  from "../Button"

const LayersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-white"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 12 12 17 22 12"/><polyline points="2 17 12 22 22 17"/></svg>
);

export default function SeasonForm({ initialData, onSubmit }) {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      season_number: "",
      description: "",
      total_episodes: 1,
    }
  });
  
  useEffect(() => {
    if (initialData) {
      reset(initialData);
    } else {
      reset({ 
        season_number: "",
        description: "",
        total_episodes: 1,
      });
    }
  }, [initialData, reset]);

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 sm:p-10 backdrop-blur-xl w-full max-w-4xl mx-auto shadow-2xl">
        <div className="mb-8 flex items-center gap-5 border-b border-neutral-800 pb-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-neutral-800 shadow-inner">
                <LayersIcon />
            </div>
            <div>
                <h2 className="text-3xl font-black text-white tracking-tight">{initialData ? "Edit Season" : "Add New Season"}</h2>
                <p className="text-sm text-neutral-400 mt-1">Organize your series by adding a new season.</p>
            </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                    type="number"
                    label="Season Number"
                    placeholder="e.g. 1"
                    {...register("season_number", { required: true })}
                />

                <Input
                    type="number"
                    label="Total Episodes (Expected)"
                    placeholder="e.g. 10"
                    {...register("total_episodes", { required: true })}
                />

                <div className="md:col-span-2">
                    <Input
                        label="Description"
                        placeholder="Provide a synopsis or theme for this season..."
                        {...register("description")}
                    />
                </div>
            </div>

            <div className="pt-6 mt-8 border-t border-neutral-800">
                <Button type="submit" variant="primary" className="w-full py-4 text-lg font-bold tracking-wide">
                    {initialData ? "Save Changes" : "Create Season"}
                </Button>
            </div>
        </form>
    </div>
  );
}
