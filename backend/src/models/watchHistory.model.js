import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const watchHistorySchema = new Schema(
    {
      user_id: {
        type: Schema.Types.ObjectId,
        ref: "Users",
        required: true,
        index: true,
      },
    
      profile_id: {
        type: Schema.Types.ObjectId,
        ref: "Profiles",
        required: true,
        index: true,
      },
    
      content_type: {
        type: String,
        enum: ["Movie", "Episodes"],
        required: true,
      },
    
      content_id: {
        type: Schema.Types.ObjectId,
        required: true,
        refPath: "content_type",
        index: true,
      },


      series_id: {
        type: Schema.Types.ObjectId,
        required: true,
        refPath: "content_type",
        index: true,
      },

      season_id: {
        type: Schema.Types.ObjectId,
        ref: "Seasons",
        default: null,
      },
     
      episode_id: {
        type: Schema.Types.ObjectId,
        ref: "Episodes",
        default: null,
      },
    
      progress_percentage: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },
    
      last_watched_at: {
        type: Date,
        default: Date.now,
      },
    },
    {
      timestamps: true
    }
    )
    
watchHistorySchema.plugin(mongooseAggregatePaginate)
watchHistorySchema.index(
    { user_id: 1, profile_id: 1, content_id: 1, last_watched_at: -1},
    { unique: true }
  ) 
  


export const WatchHistory = mongoose.model("WatchHistory", watchHistorySchema)