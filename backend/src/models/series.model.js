import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
 
const seriesSchema = new Schema({
       title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
            unique: true
        },
        description: 
        {
            type: String,
            trim: true
        },
        thumbnail:
        {
            type: String,
            required: true,
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
        total_seasons:
        {
            type: Number,
            default: 0
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
            default: true,
        }
    }, 
    {
        timestamps: true
})

seriesSchema.plugin(mongooseAggregatePaginate)

seriesSchema.index({title: "text", description: "text"},
    {weights: {title: 5, description: 1}}
)

export const Series = mongoose.model("Series", seriesSchema)
