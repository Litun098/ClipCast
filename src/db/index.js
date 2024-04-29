import mongoose, { connections } from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGO_URL}`)
        console.log(`\n MongoDB connected !! DB HOST: ${mongoose.connection.host}`);
    } catch (error) {
        console.log("MongoDB connection error:",error);
        process.exit(1);
    }
}

export default connectDB