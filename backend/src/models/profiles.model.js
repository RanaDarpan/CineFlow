import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
        index: true,
    },
    name: {
        type: String,
        required: [true, "Name is required"],
        lowercase: true,
        trim: true
    },      
    avatar: {
        type: String,
        required: true,
        default: "public/avatar.png"
    },
    settings: 
    {
        languages: {
            type: String,
            default: "English",
            enum: ["English", "Hindi", "Gujarati"]
        },
        maturity_rating: {
            type: String,
            enum: ["All", "Kids", "13+", "16+", "18+"],
            default: "All"
        }
    },
    genre: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Genres",
            required: true,
            index: true
        }
    ]
}, 
{
    timestamps: true
})

export const Profiles = mongoose.model("Profiles", profileSchema)