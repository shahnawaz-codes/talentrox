import mongoose from "mongoose";
import { InterviewSession } from "../model/InterviewSession.js";
import {
  analyzeCodeWithGemini,
  generateFollowUpQuestion,
  generateFinalScorecard,
} from "../lib/gemini.js";

export const startInterviewSession = async (req, res, next) => {
  try {
    const { problemId } = req.body || {};
    if (!problemId) {
      return res.status(400).json({ error: "problemId is required" });
    }

    const { _id, clerkId } = req.user;

    // Check if an active session already exists for this user and problem
    const existingActive = await InterviewSession.findOne({
      clerkId,
      problemId,
      status: "active",
    });

    if (existingActive) {
      return res.status(200).json({
        sessionId: existingActive._id,
        session: existingActive,
        resumed: true,
      });
    }

    const newSession = await InterviewSession.create({
      userId: _id,
      clerkId,
      problemId,
      startedAt: new Date(),
      status: "active",
      turns: [],
      finalScore: null,
    });

    return res.status(201).json({
      sessionId: newSession._id,
      session: newSession,
      resumed: false,
    });
  } catch (error) {
    console.error("Error starting interview session:", error);
    next(error);
  }
};

export const getInterviewSession = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const { clerkId } = req.user;

    if (!sessionId || !mongoose.Types.ObjectId.isValid(sessionId)) {
      return res.status(404).json({ error: "Interview session not found" });
    }

    const session = await InterviewSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ error: "Interview session not found" });
    }

    if (session.clerkId !== clerkId) {
      return res.status(403).json({ error: "Access denied to this interview session" });
    }

    return res.status(200).json({
      sessionId: session._id,
      session,
    });
  } catch (error) {
    console.error("Error fetching interview session:", error);
    next(error);
  }
};

export const submitCodeForReview = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const { code, language, problemStatement } = req.body || {};
    const { clerkId } = req.user;

    if (!code || typeof code !== "string" || !code.trim()) {
      return res.status(400).json({ error: "Code content is required" });
    }
    if (!problemStatement) {
      return res.status(400).json({ error: "problemStatement is required" });
    }

    if (!sessionId || !mongoose.Types.ObjectId.isValid(sessionId)) {
      return res.status(404).json({ error: "Interview session not found" });
    }

    const session = await InterviewSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ error: "Interview session not found" });
    }

    if (session.clerkId !== clerkId) {
      return res.status(403).json({ error: "Access denied to this interview session" });
    }

    if (session.status === "completed") {
      return res.status(400).json({ error: "This interview session has already ended" });
    }

    // Step 1: Re-use existing analyze-code logic (calls Gemini, returns structured JSON)
    const analysis = await analyzeCodeWithGemini({
      code,
      language: language || session.language || "javascript",
      problemStatement,
    });

    // Step 2: Generate ONE follow-up question using follow-up generator prompt
    const previousQuestions = session.turns.map((t) => t.question);
    const followUpQuestion = await generateFollowUpQuestion({
      analysis,
      previousQuestions,
      code,
      language: language || session.language || "javascript",
      problemStatement,
      previousTurns: session.turns,
    });

    // Step 3: Append Turn 1 (or next turn if updating code)
    const nextTurnNumber = session.turns.length + 1;
    session.turns.push({
      turnNumber: nextTurnNumber,
      question: followUpQuestion,
      answer: "",
      codeSnapshot: code,
      timestamp: new Date(),
    });

    session.code = code;
    session.language = language || session.language || "javascript";
    session.analysis = analysis;

    await session.save();

    return res.status(200).json({
      sessionId: session._id,
      session,
      analysis,
      question: followUpQuestion,
      turnNumber: nextTurnNumber,
    });
  } catch (error) {
    console.error("Error submitting code for interview review:", error);
    const statusCode = error.status || 500;
    return res.status(statusCode).json({ error: error.message || "Failed to analyze code" });
  }
};

export const submitAnswer = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const { answer, problemStatement } = req.body || {};
    const { clerkId } = req.user;

    if (!answer || typeof answer !== "string" || !answer.trim()) {
      return res.status(400).json({ error: "Answer text is required" });
    }

    if (!sessionId || !mongoose.Types.ObjectId.isValid(sessionId)) {
      return res.status(404).json({ error: "Interview session not found" });
    }

    const session = await InterviewSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ error: "Interview session not found" });
    }

    if (session.clerkId !== clerkId) {
      return res.status(403).json({ error: "Access denied to this interview session" });
    }

    if (session.status === "completed") {
      return res.status(400).json({ error: "This interview session has already ended" });
    }

    if (!session.turns || session.turns.length === 0) {
      return res.status(400).json({ error: "Please submit code first to receive an interviewer question" });
    }

    // Save answer on the last active turn
    const currentTurn = session.turns[session.turns.length - 1];
    currentTurn.answer = answer.trim();

    const answeredCount = session.turns.filter((t) => t.answer && t.answer.trim().length > 0).length;

    // Check if we reached 3 follow-ups total
    if (answeredCount >= 3) {
      // Generate final score with Gemini final scorer prompt
      const finalScore = await generateFinalScorecard({
        turns: session.turns,
        problemStatement: problemStatement || "Technical Coding Interview Problem",
        code: session.code,
        language: session.language,
        analysis: session.analysis,
      });

      session.finalScore = finalScore;
      session.status = "completed";
      session.completedAt = new Date();
      await session.save();

      return res.status(200).json({
        sessionId: session._id,
        session,
        finalScore,
        isCompleted: true,
      });
    }

    // Otherwise, generate the next follow-up question (max 3 total)
    const previousQuestions = session.turns.map((t) => t.question);
    const nextQuestion = await generateFollowUpQuestion({
      analysis: session.analysis || {},
      previousQuestions,
      code: session.code,
      language: session.language,
      problemStatement: problemStatement || "Technical Coding Interview Problem",
      previousTurns: session.turns,
    });

    const nextTurnNumber = answeredCount + 1;
    session.turns.push({
      turnNumber: nextTurnNumber,
      question: nextQuestion,
      answer: "",
      codeSnapshot: session.code,
      timestamp: new Date(),
    });

    await session.save();

    return res.status(200).json({
      sessionId: session._id,
      session,
      nextQuestion,
      turnNumber: nextTurnNumber,
      isCompleted: false,
    });
  } catch (error) {
    console.error("Error submitting interview answer:", error);
    const statusCode = error.status || 500;
    return res.status(statusCode).json({ error: error.message || "Failed to process interview answer" });
  }
};

export const endInterviewSession = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const { problemStatement } = req.body || {};
    const { clerkId } = req.user;

    if (!sessionId || !mongoose.Types.ObjectId.isValid(sessionId)) {
      return res.status(404).json({ error: "Interview session not found" });
    }

    const session = await InterviewSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ error: "Interview session not found" });
    }

    if (session.clerkId !== clerkId) {
      return res.status(403).json({ error: "Access denied to this interview session" });
    }

    if (session.status === "completed" && session.finalScore) {
      return res.status(200).json({
        sessionId: session._id,
        session,
        finalScore: session.finalScore,
        isCompleted: true,
      });
    }

    // Force final scoring on available turns
    const finalScore = await generateFinalScorecard({
      turns: session.turns,
      problemStatement: problemStatement || "Technical Coding Interview Problem",
      code: session.code || "// No code submitted",
      language: session.language || "javascript",
      analysis: session.analysis || { correctness: "incorrect", time_complexity: "N/A", space_complexity: "N/A" },
    });

    session.finalScore = finalScore;
    session.status = "completed";
    session.completedAt = new Date();
    await session.save();

    return res.status(200).json({
      sessionId: session._id,
      session,
      finalScore,
      isCompleted: true,
    });
  } catch (error) {
    console.error("Error ending interview session:", error);
    const statusCode = error.status || 500;
    return res.status(statusCode).json({ error: error.message || "Failed to score and end interview" });
  }
};
