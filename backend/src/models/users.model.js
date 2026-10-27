import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        index: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    type: {
        type: Boolean, //true for admin, false for user,
        default: false
    },
    subscription: {
        plan_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Subscription",
            default: null
        },
        s_date: {
            type: Date,
            default: null
        },
        e_date: {
            type: Date,
            default: null
        },
        status: {
            type: Boolean, //false for InActive, true for Active,
            default: false
        }
    },
    refreshToken: {
        type: String
    }
},
{
    timestamps: true
})

userSchema.pre("save", async function (next) {
    if(!this.isModified("password"))
    {
        return
    }
    this.password = await bcrypt.hash(this.password, 10)
})

userSchema.methods.isPasswordCorrect = async function (password) {

    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            name: this.name,
            type: this.type,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: "1d"
        }
    )
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: "10d"
        }
    )
}

export const Users = mongoose.model("Users", userSchema)