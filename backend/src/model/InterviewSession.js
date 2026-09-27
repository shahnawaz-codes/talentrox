import mongoose from "mongoose";

const turnSchema = new mongoose.Schema(
  {
    turnNumber: {
      type: Number,
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      default: "",
    },
    codeSnapshot: {
      type: String,
      default: "",
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const finalScoreSchema = new mongoose.Schema(
  {
    overall_score: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
    problem_solving_score: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
    communication_score: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
    strengths: [{ type: String }],
    areas_to_improve: [{ type: String }],
    summary: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const interviewSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    clerkId: {
      type: String,
      required: true,
      index: true,
    },
    problemId: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      default: "",
    },
    language: {
      type: String,
      default: "javascript",
    },
    analysis: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    turns: [turnSchema],
    finalScore: {
      type: finalScoreSchema,
      default: null,
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["active", "completed"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

export const InterviewSession = mongoose.model(
  "InterviewSession",
  interviewSessionSchema
);
