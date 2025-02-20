import express from "express";  
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";
import { fileURLToPath } from "url";
import { dirname } from "path";

const app = express(); 


// Allow CORS for specific frontend domain
app.use(
    cors({
        origin: "https://flipkart-clone-wheat.vercel.app", // Only allow your frontend
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Include OPTIONS
        credentials: true,
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

// Explicitly handle OPTIONS requests for preflight
app.options("*", cors());




const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


import connectDB from "./config/database.js";
import authRoute from "./routes/authRoute.js";
import productRoute from "./routes/productRoute.js";
import userRoute from "./routes/userRoute.js";

// Configure environment variables
dotenv.config();

// Configure cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_SECRET,
});

// Middleware
app.use(express.json());
app.use(morgan("dev"));
// To send large files
app.use(
    fileUpload({
        limits: { fileSize: 50 * 1024 * 1024 },
    })
);
// Use body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to DB
connectDB();

// Set up the port
const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
    res.send("Hello there!");
});

// Routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/user", userRoute);

// Start the server
app.listen(PORT, () => {
    console.log(`SERVER RUNNING ON PORT ${PORT}`);
});
