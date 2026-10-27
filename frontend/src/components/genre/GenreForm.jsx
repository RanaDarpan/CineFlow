import { useEffect } from "react";
import { useForm } from "react-hook-form";
import Input from "../Input.jsx"
import Button from "../Button.jsx"
import Select from "../Select.jsx" 

const ClapperboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-white"><path d="M20.2 6 3 11l-.9-2.4c-.3-1.1.3-2.2 1.3-2.5l13.5-4c1.1-.3 2.2.3 2.5 1.3Z"/><path d="m6.2 5.3 3.1 3.9"/><path d="m12.4 3.4 3.1 4"/><path d="M3 11h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/></svg>
);

export default function GenreForm({ initialData, onSubmit, onCancel }) {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      name: "",
      active: true
    }
  });
  
  useEffect(() => {
    if (initialData) {
      reset(initialData);
    } else {
      reset({ name: "", active: true });
    }
  }, [initialData, reset]);
  

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 backdrop-blur-xl">
        <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-800">
                <ClapperboardIcon />
            </div>
            <div>
                <h2 className="text-xl font-semibold text-white">{initialData ? "Edit Genre" : "Add New Genre"}</h2>
                <p className="text-sm text-neutral-400">Manage content categories</p>
            </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
                label="Genre Name"
                placeholder="e.g. Action, Comedy, Sci-Fi..."
                {...register("name", { required: true })}
            />

            {initialData && (
                <Select
                    label="Status"
                    options={[
                        { label: "Active", value: true },
                        { label: "Inactive", value: false }
                    ]}
                    {...register("active", { required: true })}
                />
            )}

            <div className="flex gap-3 pt-2">
                {initialData && onCancel && (
                    <Button type="button" variant="ghost" className="flex-1" onClick={onCancel}>
                        Cancel
                    </Button>
                )}
                <Button type="submit" variant="primary" className="flex-1">
                    {initialData ? "Save Changes" : "Create Genre"}
                </Button>
            </div>
        </form>
    </div>
  );
}
