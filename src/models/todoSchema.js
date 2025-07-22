import mongoose from "mongoose";

const todoSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
    //   type : String,
      ref: "user1",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
      unique: true,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("todo", todoSchema);