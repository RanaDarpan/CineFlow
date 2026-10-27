import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  entities: {},            
  allIds: [],             
  activeIds: [],         
  watchlistIds: [],        
  watchHistory: {
    byMovieId: {
      "m1": {
        movieId: "m1",
        progress: 612,
        lastWatchedAt: "2025-01-10T18:40:00Z",
        completed: false
      },
      "m2": {
        movieId: "m2",
        progress: 120,
        lastWatchedAt: "2025-01-09T22:10:00Z",
        completed: true
      }
    },
    allIds: ["m1", "m2"]
  }
  };

const movieSlice = createSlice({
  name: "movie",
  initialState,
  reducers: {

    upsertMovie(state, action) {
      const movie = action.payload;
      state.entities[movie._id] = movie;

      if (!state.allIds.includes(movie._id)) {
        state.allIds.push(movie._id);
      }
    },

    upsertManyMovies(state, action) {
      action.payload.forEach(movie => {
        state.entities[movie._id] = movie;

        if (!state.allIds.includes(movie._id)) {
          state.allIds.push(movie._id);
        }
      });
    },

    removeMovie(state, action) {
      const movieId = action.payload;

      delete state.entities[movieId];

      state.allIds = state.allIds.filter(id => id !== movieId);
      state.activeIds = state.activeIds.filter(id => id !== movieId);
      state.watchlistIds = state.watchlistIds.filter(id => id !== movieId);
      state.historyIds = state.historyIds.filter(id => id !== movieId);
    },

    setActiveMovies(state, action) {
      const movies = Array.isArray(action.payload)
        ? action.payload
        : [];
    
      state.activeIds = [];
    
      movies.forEach(movie => {
        if (!movie || !movie._id) return;
    
        state.entities[movie._id] = movie;
    
        if (!state.allIds.includes(movie._id)) {
          state.allIds.push(movie._id);
        }
    
        state.activeIds.push(movie._id);
      });
    },
    
    

    addToWatchlist(state, action) {
      const movieId = action.payload;
      if (!state.watchlistIds.includes(movieId)) {
        state.watchlistIds.push(movieId);
      }
    },

    removeFromWatchlist(state, action) {
      state.watchlistIds = (state.watchlistIds || []).filter(
        id => id !== action.payload
      );
    },    

    updateWatchHistory(state, action) {
      const { movieId, progress, duration } = action.payload;
    
      const completed = progress >= duration * 0.95;
    
      if (!state.watchHistory.byMovieId[movieId]) {
        state.watchHistory.allIds.push(movieId);
      }
    
      state.watchHistory.byMovieId[movieId] = {
        movieId,
        progress,
        completed,
        lastWatchedAt: new Date().toISOString()
      };
    },
    resetToDefault(state) {
      state.entities = {};
      state.allIds = [];
      state.activeIds = [];
      state.watchlistIds = [];
      state.historyIds = [];
      state.watchHistory = {
        byMovieId: {},
        allIds: []
      };
    }
    
  }
});

export default movieSlice.reducer;
export const { upsertMovie, upsertManyMovies,  removeMovie, setActiveMovies, addToWatchlist, removeFromWatchlist,  addToHistory, updateWatchHistory, resetToDefault } = movieSlice.actions;


export const selectMovieById = (state, id) =>
    state.movie.entities[id];
  
export const selectActiveMovies = (state) => {
  const ids = state.movie.activeIds;

  if (!Array.isArray(ids)) return [];

  return ids
    .map(id => state.movie.entities[id])
    .filter(Boolean);
};


  
  export const selectWatchlistMovies = (state) =>
    state.movie.watchlistIds.map(id => state.movie.entities[id]);

  export const selectIsInWatchlist = (state, id) =>
    state.movie.watchlistIds.includes(id);
  
  export const selectHistoryMovies = (state) =>
    state.movie.historyIds.map(id => state.movie.entities[id]);

  export const selectWatchHistoryMovies = (state) =>
    state.movie.watchHistory.allIds
      .map(id => ({
        ...state.movie.entities[id],
        ...state.movie.watchHistory.byMovieId[id]
      }))
      .sort(
        (a, b) =>
          new Date(b.lastWatchedAt) - new Date(a.lastWatchedAt)
      );
  
  export const selectWatchProgress = (state, movieId) =>
      state.movie.watchHistory.byMovieId[movieId]?.progress || 0;
      