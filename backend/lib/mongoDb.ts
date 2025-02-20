import mongoose from "mongoose";
import dotenv from "dotenv";


dotenv.config({ path: ".env.local" });
const MONGODB_URI = process.env.MONGODB_URI as string;



export async function connectToDb() {
    try {
        await mongoose.connect(MONGODB_URI, {
            dbName: 'learning_express-js'
        });
    } catch (error) {
        throw error;
    }
}   