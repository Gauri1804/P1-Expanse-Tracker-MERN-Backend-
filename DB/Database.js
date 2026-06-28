// import mongoose from "mongoose";

// export const connectDB = async (req, res) => {
//     const db = process.env.MONGO_URL;

//     const { connection } = await mongoose.connect(db, { useNewUrlParser: true });

//     console.log(`MongoDB Connected to ${connection.host}`);

// } 



import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const db = process.env.MONGO_URL;

        if (!db) {
            throw new Error("MONGO_URL is not defined");
        }

        await mongoose.connect(db);

        console.log("✅ MongoDB Connected Successfully");
        console.log("Host:", mongoose.connection.host);
        console.log("Database:", mongoose.connection.name);
    } catch (err) {
        console.error("❌ MongoDB Connection Failed");
        console.error(err);
        throw err;
    }
};