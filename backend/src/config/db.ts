import mongoose from "mongoose";
import { config } from "./config";

const connectDB = async () => {

  try {
    mongoose.connection.on("connected", () => {
      console.log("MongoDB connected successfully");
    });
    
    mongoose.connection.on("error", (err) => {
      console.error(`MongoDB connection error: ${err}`);
    })

    await mongoose.connect(config.mongo as string);

} catch (error) {
    console.error(`MongoDB connection error: ${error}`);
    process.exit(1);
  }
}

export default connectDB;