import mongoose, { Schema, Document } from "mongoose";

interface ITask extends Document {
  title: string;
  description: string;
  status: string;
  user: Schema.Types.ObjectId;
}

//Task Schema
export const taskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: [true, "Please enter task title"],
    },
    description: {
      type: String,
      required: [true, "Please enter task description"],
    },
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Task = mongoose.model<ITask>("Task", taskSchema);
