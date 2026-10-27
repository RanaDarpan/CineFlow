import mongoose from "mongoose";

const genreSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        index: true,
        trim: true,
        unique: true,
        lowercase: true
    },
    active:{
        type: Boolean, //1 for active, 0 for false
        default: true
    }
})
genreSchema.index({name: "text"})
export const Genres = mongoose.model("Genres", genreSchema)