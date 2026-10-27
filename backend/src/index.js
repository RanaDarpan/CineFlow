import connectDB from "./db/index.js"
import app from "./app.js"

console.log("LISTEN FILE LOADED");

connectDB()
.then(() => {
    app.on("error",(error)=>
    {
        console.log("Error: ",error)
        throw error
    })
    const PORT = process.env.PORT || 8000
    app.listen(PORT, ()=> 
    {
        console.log(`Server is running on port ${PORT}`)
    })
})
.catch((error)=>
{
    console.log("Error in connecting MONGO DB: ",error)
})