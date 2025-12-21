import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    problem: {
      type: "String",
      required: true,
    },
    difficulty: {
      type: "String",
      enum: ["easy", "medium", "hard"],
      required: true,
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    participant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    callId: {
      type: "String",
      required: true,
    },
    status: {
      type: "String",
      enum: ["active", "completed"],
      default: "active",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
export const Session = mongoose.model("Session", sessionSchema);
