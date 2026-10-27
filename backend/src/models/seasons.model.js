import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import mongoose from "mongoose";
 
const seasonSchema = mongoose.Schema(
    {
        series_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Series",
            required: true,
            index: true
        },
        season_number: {
            type: Number,
            required: true,
            index: true,
        },
        description: {
            type: String,
            trim: true
        },
        total_episode: {
            type: Number,
            required: true
        },
        active: {
            type: Boolean, //true for active, false for inactive
            default: true
        }
    },
    {
        timestamps: true
    }
)

seasonSchema.plugin(mongooseAggregatePaginate)
export const Seasons = mongoose.model("Seasons", seasonSchema)