import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import getAllGenre from "../../axios/getAllGenre.jsx"
import addGenreAPI from "../../axios/addGenreAPI.jsx";
import updateGenre from "../../axios/updateGenreAPI.jsx";
import deleteGenre from "../../axios/deleteGenreAPI.jsx"
import toast from "react-hot-toast";
import { getErrorMessage } from "../../utils/errorHandler.js";

import {
  fetchGenresSuccess,
  addGenre,
  updateGenre as updateGenreAction,
  removeGenre
} from "../../slices/adminGenre.js";

import GenreForm from "./GenreForm.jsx";
import GenreList from "./GenreList.jsx"

export default function AdminGenresPage() {
  const {user} = useSelector(state => state.auth);
  const type = user?.type;
  const dispatch = useDispatch();
  const { genres, loading } = useSelector(state => state.adminGenre);
  const [selectedGenre, setSelectedGenre] = useState(null);

  useEffect(() => {
    const loadGenres = async () => {
      const res = await getAllGenre();
      dispatch(fetchGenresSuccess(res));
    };
    loadGenres();
  }, [dispatch]);
  
  const handleSubmit = async (data) => {
    try {
      // Convert select string values back to boolean
      if (typeof data.active === 'string') {
        data.active = data.active === 'true';
      }

      if (selectedGenre) {
        const res = await updateGenre(selectedGenre._id, data);
        dispatch(updateGenreAction(res));
        setSelectedGenre(null);
        toast.success("Genre updated successfully");
      } else {
        const res = await addGenreAPI(data);
        dispatch(addGenre(res));
        toast.success("Genre added successfully");
      }
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to save genre"));
    }
  };

  const handleDelete = async (genre_id) => {
    if (!confirm("Delete this genre?")) return;
    try {
      await deleteGenre(genre_id);
      dispatch(removeGenre(genre_id));
      toast.success("Genre deleted successfully");
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to delete genre"));
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12">
        <div className="mx-auto max-w-7xl">
            <div className="mb-10">
                <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl mb-3">Genres</h1>
                <p className="text-lg text-neutral-400">Discover and manage content categories.</p>
            </div>
            
            {type ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Admin Form Column */}
                    <div className="lg:col-span-4 lg:sticky lg:top-8">
                        <GenreForm
                            initialData={selectedGenre}
                            onSubmit={handleSubmit}
                            onCancel={() => setSelectedGenre(null)}
                        />
                    </div>
                    
                    {/* List Column */}
                    <div className="lg:col-span-8">
                        <GenreList
                            genres={genres}
                            onEdit={setSelectedGenre}
                            onDelete={handleDelete}
                            loading={loading}
                            isAdmin={true}
                        />
                    </div>
                </div>
            ) : (
                <div className="w-full">
                    <GenreList
                        genres={genres}
                        onEdit={setSelectedGenre}
                        onDelete={handleDelete}
                        loading={loading}
                        isAdmin={false}
                    />
                </div>
            )}
        </div>
    </div>
  );
}
