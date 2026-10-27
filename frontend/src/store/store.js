import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice.js"
import profileReducer from "../slices/profileSlice.js"
import genreReducer from "../slices/genreSlice.js"
import adminGenreReducer from "../slices/adminGenre.js"
import movieReducer from "../slices/movieSlice.js"
import seriesReducer from "../slices/seriesSlice.js"

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['auth', 'profile', 'genre', 'movie', 'series'] 
}

const rootReducer = combineReducers({
    auth: authReducer,
    profile: profileReducer,
    genre: genreReducer,
    adminGenre: adminGenreReducer,
    movie: movieReducer,
    series: seriesReducer
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
            },
        }),
})

export const persistor = persistStore(store)

export default store