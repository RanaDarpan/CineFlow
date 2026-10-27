import mongoose from "mongoose"
import { DB_NAME } from "../constant.js"

const connectDB = async() => {
    try {
        const connection = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log("Connection established successfully: ",connection.connection.host)
    } catch (error) {
        console.log("MongoDB error: ",error)
        process.exit(1
        )
    }
}


export default connectDB