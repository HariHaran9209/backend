import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    cartData: { type: Object, default: {} }
}, { timestamps: true, minimize: false })

const User = mongoose.models.User || mongoose.model('User', userSchema)

export default User