import { profile } from "console";
import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const reviewsSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
        index: true
    },
    profile_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profiles",
        required: true,
        index: true
    },      
    content_type: {
        type: String,
        required: true,
        enum: ["Movies", "Series"]
    },
    content_id: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "content_type",
        required: true,
        index: true
    }, 
    rating: {
        type: Number,
        min: 0,
        max: 10,
        required: true,
    },
    comment: {
        type: String,
        required: true,
    }
},
{
    timestamps: true
})

reviewsSchema.index(
  { profile_id: 1, content_id: 1, content_type: 1 },
  { unique: true }
);

reviewsSchema.plugin(mongooseAggregatePaginate);

export const Reviews = mongoose.model("Reviews", reviewsSchema);