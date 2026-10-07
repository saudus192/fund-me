import mongoose from "mongoose";
const { Schema, model } = mongoose;

const userSchema = new Schema({
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    topSkill: { type: String },
    profilePicture: { type: String },
    coverPicture: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.User || model('User', userSchema);