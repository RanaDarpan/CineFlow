import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    genres: [],
    loading: true,
    error: null
};

const genreSlice = createSlice({
    name: "genre",
    initialState,
    reducers: {
        genreLoading: (state) => {
            state.loading = true;
            state.error = null;
        },
        genreSuccess: (state, action) => {
            state.genres = action.payload;
            state.loading = false;
        },
        genreFail: (state, action) => {
            state.genres = [];
            state.loading = false;
            state.error = action.payload;
        }
    }
});

export default genreSlice.reducer;
export const { genreLoading, genreSuccess, genreFail } = genreSlice.actions;

export const selectAllGenres = (state) => {
    return state?.genre?.genres?.filter(g => g.active === true)
}

export const selectGenreById = (state, id) => {
    const genre = state?.genre?.genres?.find(g => g._id === id);
    return genre? genre.name : undefined
}
