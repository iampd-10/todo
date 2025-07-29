import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user1",
        required: true,
    },
}, { timestamps: true });
export default mongoose.model("session", sessionSchema);
      
