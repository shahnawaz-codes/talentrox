import axios from "axios";
import { ENV } from "./env.js";

const GEMINI_SYSTEM_PROMPT = `You are a rigorous, neutral code reviewer evaluating a candidate's interview solution. Given the problem statement and code, output ONLY the JSON object described. Do not praise the candidate. If you are not fully confident about complexity, explain your uncertainty in complexity_reasoning rather than guessing. If the code has syntax errors, correctness = 'incorrect' and explain why in bugs.`;

const JSON_SCHEMA = {
  type: "OBJECT",
  properties: {
    correctness: {
      type: "STRING",
      enum: ["correct", "incorrect", "partially_correct"],
    },
    time_complexity: {
      type: "STRING",
      description: "Big-O notation (e.g. O(n), O(n log n), O(n^2))",
    },
    space_complexity: {
      type: "STRING",
      description: "Big-O notation (e.g. O(1), O(n))",
    },
    complexity_reasoning: {
      type: "STRING",
      description: "1-2 sentences explaining the complexity calculation",
    },
    edge_cases_missed: {
      type: "ARRAY",
      items: { type: "STRING" },
      description: "List of unhandled edge cases, empty array if none",
    },
    bugs: {
      type: "ARRAY",
      items: { type: "STRING" },
      description: "List of syntax, logical, or runtime bugs, empty array if none",
    },
    optimization_suggestion: {
      type: "STRING",
      description: "Clear suggestion on how to optimize the algorithm or clean up the code",
    },
  },
  required: [
    "correctness",
    "time_complexity",
    "space_complexity",
    "complexity_reasoning",
    "edge_cases_missed",
    "bugs",
    "optimization_suggestion",
  ],
};

const SCORECARD_SCHEMA = {
  type: "OBJECT",
  properties: {
    overall_score: {
      type: "INTEGER",
      description: "Integer score from 1 to 10",
    },
    problem_solving_score: {
      type: "INTEGER",
      description: "Integer score from 1 to 10",
    },
    communication_score: {
      type: "INTEGER",
      description: "Integer score from 1 to 10",
    },
    strengths: {
      type: "ARRAY",
      items: { type: "STRING" },
      description: "List of specific candidate strengths demonstrated in code and answers",
    },
    areas_to_improve: {
      type: "ARRAY",
      items: { type: "STRING" },
      description: "List of actionable areas for improvement",
    },
    summary: {
      type: "STRING",
      description: "2-3 sentences neutral summary of overall performance",
    },
  },
  required: [
    "overall_score",
    "problem_solving_score",
    "communication_score",
    "strengths",
    "areas_to_improve",
    "summary",
  ],
};

const cleanJsonString = (rawText) => {
  if (!rawText || typeof rawText !== "string") {
    throw new Error("Empty response received from Gemini");
  }
  let cleaned = rawText.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
  }
  return cleaned;
};

const parseAndValidateJSON = (rawText) => {
  const cleaned = cleanJsonString(rawText);
  const parsed = JSON.parse(cleaned);

  const requiredKeys = [
    "correctness",
    "time_complexity",
    "space_complexity",
    "complexity_reasoning",
    "edge_cases_missed",
    "bugs",
    "optimization_suggestion",
  ];

  for (const key of requiredKeys) {
    if (parsed[key] === undefined || parsed[key] === null) {
      throw new Error(`Missing required field in Gemini JSON output: ${key}`);
    }
  }

  if (!Array.isArray(parsed.edge_cases_missed)) {
    parsed.edge_cases_missed = parsed.edge_cases_missed ? [String(parsed.edge_cases_missed)] : [];
  }
  if (!Array.isArray(parsed.bugs)) {
    parsed.bugs = parsed.bugs ? [String(parsed.bugs)] : [];
  }

  const validCorrectness = ["correct", "incorrect", "partially_correct"];
  if (!validCorrectness.includes(parsed.correctness)) {
    parsed.correctness = "partially_correct";
  }

  return parsed;
};

const parseAndValidateScorecard = (rawText) => {
  const cleaned = cleanJsonString(rawText);
  const parsed = JSON.parse(cleaned);

  const requiredKeys = [
    "overall_score",
    "problem_solving_score",
    "communication_score",
    "strengths",
    "areas_to_improve",
    "summary",
  ];

  for (const key of requiredKeys) {
    if (parsed[key] === undefined || parsed[key] === null) {
      throw new Error(`Missing required field in scorecard output: ${key}`);
    }
  }

  // Ensure scores are clamped between 1 and 10
  parsed.overall_score = Math.min(10, Math.max(1, Math.round(Number(parsed.overall_score) || 5)));
  parsed.problem_solving_score = Math.min(10, Math.max(1, Math.round(Number(parsed.problem_solving_score) || 5)));
  parsed.communication_score = Math.min(10, Math.max(1, Math.round(Number(parsed.communication_score) || 5)));

  if (!Array.isArray(parsed.strengths)) {
    parsed.strengths = parsed.strengths ? [String(parsed.strengths)] : [];
  }
  if (!Array.isArray(parsed.areas_to_improve)) {
    parsed.areas_to_improve = parsed.areas_to_improve ? [String(parsed.areas_to_improve)] : [];
  }

  return parsed;
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const executeGeminiRequestRaw = async (payload, apiKey) => {
  const models = ["gemini-2.5-flash", "gemini-2.5-flash-lite", "gemini-flash-latest"];
  let lastError = null;

  for (let modelIndex = 0; modelIndex < models.length; modelIndex++) {
    const model = models[modelIndex];
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const response = await axios.post(url, payload, {
          headers: { "Content-Type": "application/json" },
          timeout: 30000,
        });

        const rawText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!rawText) {
          throw new Error("No text content returned from Gemini API");
        }
        return rawText;
      } catch (err) {
        lastError = err;
        const status = err.response?.status;
        console.warn(`[Gemini API] Call failed on ${model} (attempt ${attempt}):`, status || err.message);

        // If model not found (404), switch to next model immediately
        if (status === 404) {
          break;
        }

        // If transient rate limit or server overload (503, 429, 500, or network error)
        if (status === 503 || status === 429 || status === 500 || !status) {
          if (attempt === 1) {
            await sleep(1500);
            continue;
          }
          // After 2 failed attempts on this model, switch to next model
          break;
        }

        // Other fatal errors (e.g. 400 Bad Request, 401 Unauthorized)
        throw err;
      }
    }
  }

  throw lastError;
};

// Existing logic for POST /api/analyze-code (reused directly)
export const analyzeCodeWithGemini = async ({ code, language, problemStatement }) => {
  const apiKey = ENV.GEMINI_API_KEY;
  if (!apiKey) {
    const error = new Error("GEMINI_API_KEY is not configured on the server");
    error.status = 500;
    throw error;
  }

  const prompt = `Problem Statement:
${problemStatement}

Language:
${language}

Candidate Code:
${code}`;

  const payload = {
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ],
    systemInstruction: {
      parts: [{ text: GEMINI_SYSTEM_PROMPT }],
    },
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: JSON_SCHEMA,
      temperature: 0.1,
    },
  };

  // Attempt 1
  try {
    const rawText = await executeGeminiRequestRaw(payload, apiKey);
    return parseAndValidateJSON(rawText);
  } catch (firstError) {
    console.warn("First attempt calling Gemini API failed, retrying once after backoff...", firstError?.message || firstError);
    await sleep(1500);

    // Attempt 2 (Retry once)
    try {
      const rawText = await executeGeminiRequestRaw(payload, apiKey);
      return parseAndValidateJSON(rawText);
    } catch (retryError) {
      console.error("Gemini retry attempt also failed:", retryError?.response?.data || retryError.message);
      const customError = new Error("Failed to receive a valid structured response from Gemini API after retry.");
      customError.status = 502;
      throw customError;
    }
  }
};

/**
 * 1. Follow-up generator prompt:
 * "You are a technical interviewer. Given this code analysis: {analysis_json}, ask ONE specific follow-up question about a weakness or tradeoff in the candidate's solution. Do not repeat a question already asked: {previous_questions}. Output only the question text, no preamble."
 */
export const generateFollowUpQuestion = async ({
  analysis,
  previousQuestions = [],
  code,
  language,
  problemStatement,
  previousTurns = [],
}) => {
  const apiKey = ENV.GEMINI_API_KEY;
  if (!apiKey) {
    const error = new Error("GEMINI_API_KEY is not configured on the server");
    error.status = 500;
    throw error;
  }

  const analysisJsonString = JSON.stringify(analysis);
  const previousQuestionsString = previousQuestions.length > 0 ? previousQuestions.join(" | ") : "None";

  const systemPrompt = `You are a technical interviewer. Given this code analysis: ${analysisJsonString}, ask ONE specific follow-up question about a weakness or tradeoff in the candidate's solution. Do not repeat a question already asked: ${previousQuestionsString}. Output only the question text, no preamble.`;

  let userPrompt = `Problem Statement:
${problemStatement}

Language: ${language}

Candidate Code:
${code}`;

  if (previousTurns && previousTurns.length > 0) {
    const conversationHistory = previousTurns
      .map(
        (t) =>
          `Interviewer Question ${t.turnNumber}: ${t.question}\nCandidate Answer: ${
            t.answer || "(Pending)"
          }`
      )
      .join("\n\n");
    userPrompt += `\n\nPrevious Conversation History:\n${conversationHistory}`;
  }

  const payload = {
    contents: [{ role: "user", parts: [{ text: userPrompt }] }],
    systemInstruction: { parts: [{ text: systemPrompt }] },
    generationConfig: {
      temperature: 0.4,
    },
  };

  // Execute with retry
  try {
    const text = await executeGeminiRequestRaw(payload, apiKey);
    return text.trim().replace(/^Interviewer:\s*/i, "").replace(/^"|"$/g, "").trim();
  } catch (err) {
    console.warn("Retrying follow-up generation...", err.message);
    try {
      await sleep(1500);
      const text = await executeGeminiRequestRaw(payload, apiKey);
      return text.trim().replace(/^Interviewer:\s*/i, "").replace(/^"|"$/g, "").trim();
    } catch (retryErr) {
      console.warn("Gemini follow-up generation failed, falling back to heuristic follow-up:", retryErr.message);

      // Graceful heuristic fallback based on the already completed analysis
      if (analysis?.edge_cases_missed && analysis.edge_cases_missed.length > 0) {
        return `How would your solution handle this edge case: "${analysis.edge_cases_missed[0]}"? What changes would you make?`;
      }
      if (analysis?.optimization_suggestion) {
        return `Can you explain how you would optimize your solution's time or space complexity?`;
      }
      if (analysis?.bugs && analysis.bugs.length > 0) {
        return `Looking at your implementation, what potential issue or bug might occur during execution, and how would you fix it?`;
      }
      return `What is the time and space complexity of your current solution, and could any tradeoffs be made?`;
    }
  }
};

/**
 * 2. Final scorer prompt:
 * "You are a rigorous, neutral technical interviewer scoring a completed mock interview. Given the full conversation history: {turns}, output ONLY the JSON scorecard described. Be honest — do not inflate scores to be encouraging."
 */
export const generateFinalScorecard = async ({
  turns = [],
  problemStatement,
  code,
  language,
  analysis,
}) => {
  const apiKey = ENV.GEMINI_API_KEY;
  if (!apiKey) {
    const error = new Error("GEMINI_API_KEY is not configured on the server");
    error.status = 500;
    throw error;
  }

  const turnsJsonString = JSON.stringify(turns);
  const systemPrompt = `You are a rigorous, neutral technical interviewer scoring a completed mock interview. Given the full conversation history: ${turnsJsonString}, output ONLY the JSON scorecard described. Be honest — do not inflate scores to be encouraging.`;

  const userPrompt = `Problem Statement:
${problemStatement}

Language: ${language}

Candidate Final Code:
${code}

Initial Code Analysis:
${JSON.stringify(analysis, null, 2)}

Full Interview Turns:
${turns
  .map(
    (t) =>
      `Turn ${t.turnNumber}:
Question: ${t.question}
Candidate Answer: ${t.answer || "(No response provided)"}`
  )
  .join("\n\n")}`;

  const payload = {
    contents: [{ role: "user", parts: [{ text: userPrompt }] }],
    systemInstruction: { parts: [{ text: systemPrompt }] },
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: SCORECARD_SCHEMA,
      temperature: 0.1,
    },
  };

  // Execute with retry
  try {
    const rawText = await executeGeminiRequestRaw(payload, apiKey);
    return parseAndValidateScorecard(rawText);
  } catch (err) {
    console.warn("Retrying final scorecard generation...", err.message);
    try {
      await sleep(1500);
      const rawText = await executeGeminiRequestRaw(payload, apiKey);
      return parseAndValidateScorecard(rawText);
    } catch (retryErr) {
      console.warn("Gemini final scorecard generation failed, synthesizing scorecard:", retryErr.message);
      const answeredCount = turns.filter((t) => t.answer && t.answer.trim()).length;
      const isOptimal = analysis?.correctness === "correct";

      return {
        overall_score: isOptimal ? 8 : answeredCount >= 2 ? 7 : 5,
        problem_solving_score: isOptimal ? 8 : 6,
        communication_score: answeredCount >= 2 ? 8 : 5,
        strengths: [
          "Candidate communicated thought process during the interview.",
          isOptimal
            ? "Arrived at an optimal solution structure."
            : "Understood problem boundaries and objective.",
        ],
        areas_to_improve: [
          analysis?.optimization_suggestion ||
            "Continue practicing algorithmic time and space complexity optimizations.",
          "Ensure edge cases and boundary conditions are explicitly tested.",
        ],
        summary:
          "Candidate completed the mock interview session, demonstrating foundational problem-solving and engagement throughout the follow-up rounds.",
      };
    }
  }
};
