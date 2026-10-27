import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
import userRouter from "./routes/users.route.js"
import subscribeRouter from "./routes/subscription.route.js"
import genreRouter from "./routes/genre.route.js"
import profileRouter from "./routes/profile.route.js"
import movieRouter from "./routes/movie.route.js"
import seriesRouter from "./routes/series.route.js"
import seasonRouter from "./routes/seasons.route.js"
import episodeRouter from "./routes/episodes.route.js"
import watchListRouter from "./routes/watchList.route.js"
import watchHistoryRouter from "./routes/watchHistory.route.js"
import reviewsRouter from "./routes/reviews.route.js"
import testRouter from "./routes/test.route.js"

// top of router file
console.log("ROUTER FILE LOADED");

dotenv.config()

const app = express()

const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(",").map((o) => o.trim().replace(/\/$/, "")).filter(Boolean)
    : ["http://localhost:5173", "http://localhost:5174"];

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin) return callback(null, true);
            if (
                allowedOrigins.includes("*") ||
                allowedOrigins.includes(origin) ||
                allowedOrigins.some((allowed) => origin.startsWith(allowed))
            ) {
                return callback(null, true);
            }
            return callback(null, true);
        },
        credentials: true,
    })
)

app.use(cookieParser())
app.use(express.static("./public"))
app.use(express.json())
app.use(express.urlencoded({extended:true}))

// Health check routes for deployment services (Render, Railway, etc.)
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "CineFlow Backend API is running",
        uptime: `${Math.floor(process.uptime())}s`
    })
})

app.get("/health", (req, res) => {
    res.status(200).json({ status: "OK", timestamp: new Date().toISOString() })
})

app.use("/api/v1/test", testRouter)

app.use("/api/v1/users", userRouter)

app.use("/api/v1/subscriptions", subscribeRouter)

app.use("/api/v1/genres",genreRouter)
 
app.use("/api/v1/profiles",profileRouter)

app.use("/api/v1/:profile_id/movies",movieRouter)

app.use("/api/v1/:profile_id/series", seriesRouter)

app.use("/api/v1/:profile_id/series/:series_id/seasons", seasonRouter);

app.use("/api/v1/:profile_id/series/:series_id/seasons/:season_id/episodes", episodeRouter)

app.use("/api/v1/:profile_id/watchList", watchListRouter)

app.use("/api/v1/:profile_id/watchHistory", watchHistoryRouter)
    
app.use("/api/v1/:profile_id/reviews", reviewsRouter)

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    return res.status(statusCode).json({
        success: false,
        statusCode: statusCode,
        message: message,
        errors: err.errors || []
    });
});

export default app


// Refresh configuration
