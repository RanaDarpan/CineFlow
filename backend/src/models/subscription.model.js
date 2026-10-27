import mongoose from "mongoose";

const subscriptionSchema = mongoose.Schema(
    {
        plan_name: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            index: true
        }, 
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        duration_days: {
            type: Number,
            required: true,
            min: 1
        },
        resolutions: {
          type: String,
          enum: ["1080p", "720p", "480p", "360p"]
       },
    },
    {
        timestamps: true
    }
)

export const Subscription = mongoose.model("Subscription", subscriptionSchema)