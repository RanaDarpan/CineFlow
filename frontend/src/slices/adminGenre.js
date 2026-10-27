import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  genres: [],
  loading: false,
  error: null,
};

const adminGenreSlice = createSlice({
  name: "adminGenre",
  initialState,
  reducers: {
    fetchGenresSuccess: (state, action) => {
      state.genres = action.payload;
      state.loading = false;
      state.error = null;
    },

    addGenre: (state, action) => {
      state.genres.push(action.payload);
    },

    updateGenre: (state, action) => {
      const updated = action.payload;
      state.genres = state.genres.map((g) =>
        g._id === updated._id ? updated : g
      );
    },

    removeGenre: (state, action) => {
      const id = action.payload;
      state.genres = state.genres.filter((g) => g._id !== id);
    },

    toggleGenreActive: (state, action) => {
      const id = action.payload;
      state.genres = state.genres.map((g) =>
        g._id === id ? { ...g, active: !g.active } : g
      );
    },

    genreError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export default adminGenreSlice.reducer;
export const {
  fetchGenresSuccess,
  addGenre,
  updateGenre,
  removeGenre,
  toggleGenreActive,
  genreError,
} = adminGenreSlice.actions;
