import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const watchListSchema = mongoose.Schema({
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
        index: true,
    }, 
    profile_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profiles",
        required: true,
        index: true,
    },
    content_type: {
        type: String,
        required: true,
        enum: ["Movies","Series"]
    },
    content_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: "content_type",   
        index: true,
    },
    added_at: {
        type: Date,
        default: Date.now
    }
},
{
    timestamps: true
})

watchListSchema.plugin(mongooseAggregatePaginate)

export const WatchList = mongoose.model("WatchList", watchListSchema)