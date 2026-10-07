import mongoose from "mongoose";
const { Schema, model } = mongoose;

const paymentSchema = new Schema({
    fromPerson: { type: String, required: true },
    toPerson: { type: String, required: true },
    amount: { type: Number, required: true },
    message: { type: String },
}, { timestamps: true });

export default mongoose.models.Payment || model('Payment', paymentSchema);