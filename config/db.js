import mongoose from 'mongoose'

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB)
        console.log(`DB Connected Successfully`)
    } catch (error) {
        console.log(`Error While Connecting DB: ${error.message}`)
    }
}