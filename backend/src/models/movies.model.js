import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"

const movieSchema = new Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
        trim: true,
        unique: true
    },
    description: 
    {
        type: String,
        trim: true,
        default: ""
    },
    thumbnail:
    {
        type: String,
        required: true,
    },
    video: {
        hls_master_url: String,
        resolutions: {
            "1080p": String,
            "720p": String,
            "480p": String,
            "360p": String
        }
   },
    genres:[
    {
        type: Schema.Types.ObjectId,
        ref: "Genres",
        required: true,
        index: true,
    }],
    r_date:
    {
        type: Date,
        required: true,
    },
    age_rating:
    {
        type: String,
        enum: ["All", "Kids", "13+", "16+", "18+"],
        default: "All"
    }, 
    rating:
    {
        type: Number,
        min: 0,
        max: 10,
        default: 0
    },
    active:
    {
        type: Boolean, //true for active, false for inactive
        default: true 
    }
}, 
{
    timestamps: true
})

movieSchema.plugin(mongooseAggregatePaginate)

movieSchema.index(
  { title: "text", description: "text" },
  { weights: { title: 5, description: 1 } }
);
export const Movies = mongoose.model("Movies", movieSchema)