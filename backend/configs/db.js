import mongoose from "mongoose";

const connectDb = async () => {
    if (!process.env.MONGODB_URL) {
        console.error("CRITICAL DB ERROR: MONGODB_URL environment variable is missing!");
        return;
    }
    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log("DB connected successfully");
    } catch (error) {
        console.error("DB connection error:", error.message);
    }
};

mongoose.connection.on("connected", () => {
    console.log("Mongoose connected to MongoDB");
});

mongoose.connection.on("disconnected", () => {
    console.warn("Mongoose disconnected from MongoDB");
});

export default connectDb;