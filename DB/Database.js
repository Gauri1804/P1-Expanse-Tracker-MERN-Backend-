// import mongoose from "mongoose";

// export const connectDB = async (req, res) => {
//     const db = process.env.MONGO_URL;

//     const { connection } = await mongoose.connect(db, { useNewUrlParser: true });

//     console.log(`MongoDB Connected to ${connection.host}`);

// } 


import mongoose from "mongoose";

// Maintain a global cache so serverless containers reuse the connection
let isConnected = false;

export const connectDB = async () => {
    // Prevent Mongoose from waiting 10 seconds to show underlying errors
    mongoose.set('bufferCommands', false);

    if (isConnected) {
        console.log("=> Using existing MongoDB connection");
        return;
    }

    const db = process.env.MONGO_URL;
    if (!db) {
        throw new Error("MONGO_URL environment variable is missing!");
    }

    try {
        console.log("=> Connecting to MongoDB...");
        const res = await mongoose.connect(db);

        isConnected = res.connections[0].readyState === 1;
        console.log(`MongoDB Connected to ${res.connection.host}`);
    } catch (error) {
        console.error("MongoDB connection error details:", error);
        throw error;
    }
};
