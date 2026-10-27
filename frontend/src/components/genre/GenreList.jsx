const FilmIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-12 w-12 mb-4 opacity-50"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 3v18"/><path d="M3 7.5h4"/><path d="M3 12h18"/><path d="M3 16.5h4"/><path d="M17 3v18"/><path d="M17 7.5h4"/><path d="M17 16.5h4"/></svg>
);

const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
);

export default function GenreList({
    genres,
    onEdit,
    onDelete,
    loading,
    isAdmin
}) {

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-700 border-t-white"></div>
            </div>
        );
    }

    if (!genres || genres.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-neutral-400 bg-neutral-900/30 rounded-xl border border-neutral-800">
                <FilmIcon />
                <p className="text-lg font-medium">No genres found</p>
                <p className="text-sm mt-1">Genres will appear here once added.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {genres.map((g) => (
                <div key={g._id} className="group relative flex flex-col items-center justify-center rounded-xl bg-neutral-900 p-8 text-center border border-neutral-800 hover:bg-neutral-800 transition-all hover:border-neutral-700 overflow-hidden">
                    
                    {/* Decorative gradient background for modern look */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <h3 className="text-xl font-bold text-white tracking-wide relative z-10">{g.name}</h3>
                    
                    {isAdmin && (
                        <div className="mt-4 flex gap-2 relative z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                             <div className="flex items-center justify-center gap-1">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${g.active ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                    {g.active ? "Active" : "Inactive"}
                                </span>
                            </div>
                        </div>
                    )}
                    
                    {isAdmin && (
                        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                            <button
                                onClick={(e) => { e.stopPropagation(); onEdit(g); }}
                                className="p-2 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
                                title="Edit"
                            >
                                <EditIcon />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); onDelete(g._id); }}
                                className="p-2 rounded-full bg-neutral-800 hover:bg-red-600/20 text-neutral-400 hover:text-red-500 transition-colors"
                                title="Delete"
                            >
                                <TrashIcon />
                            </button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
