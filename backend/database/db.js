require('dotenv').config()
const mongoose=require("mongoose")

exports.connectToDB=async()=>{
    try {
        const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
        if (!mongoUri) {
            throw new Error("MongoDB connection string is not defined in environment variables.");
        }
        await mongoose.connect(mongoUri)
        console.log('connected to DB');
    } catch (error) {
        console.log(error);
    }
}
