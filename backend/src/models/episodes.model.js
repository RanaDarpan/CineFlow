import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const episodeSchema = new Schema({
    series_id: {
        type: Schema.Types.ObjectId,
        ref: "Series",
        required: true,
        index: true
    }, 
    season_id: {
        type: Schema.Types.ObjectId,
        ref: "Seasons",
        required: true,
        index: true
    },
    episode_no: {
        type: Number,
        required: true,
        index: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true
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
    r_date: {
        type: Date,
        required: true,
    },
    active: {
        type: Boolean, // 1 for true, 0 for false
        default: true
    }
},
{
    timestamps: true
})

episodeSchema.plugin(mongooseAggregatePaginate)
episodeSchema.index(
    {title: "text", description: "text"},
    {weight: {title: 5, description: 1}}
)

export const Episodes = mongoose.model("Episodes", episodeSchema)