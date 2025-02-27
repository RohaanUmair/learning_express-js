import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    refreshToken: { type: String, maxAge: '15m' }
});


const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;