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

const parseAndValidateJSON = (rawText) => {
  if (!rawText || typeof rawText !== "string") {
    throw new Error("Empty response received from Gemini");
  }

  // Remove markdown code fences if model enclosed JSON in ```json ... ```
  let cleaned = rawText.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
  }

  const parsed = JSON.parse(cleaned);

  // Validate required fields
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

  // Ensure array fields are arrays
  if (!Array.isArray(parsed.edge_cases_missed)) {
    parsed.edge_cases_missed = parsed.edge_cases_missed ? [String(parsed.edge_cases_missed)] : [];
  }
  if (!Array.isArray(parsed.bugs)) {
    parsed.bugs = parsed.bugs ? [String(parsed.bugs)] : [];
  }

  // Ensure correctness is one of allowed values
  const validCorrectness = ["correct", "incorrect", "partially_correct"];
  if (!validCorrectness.includes(parsed.correctness)) {
    parsed.correctness = "partially_correct";
  }

  return parsed;
};

const executeGeminiRequest = async (payload, apiKey) => {
  // Use gemini-2.5-flash as default, fallback to gemini-1.5-flash if needed
  const models = ["gemini-2.5-flash", "gemini-1.5-flash"];
  let lastError = null;

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const response = await axios.post(url, payload, {
        headers: { "Content-Type": "application/json" },
        timeout: 20000,
      });

      const rawText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      return parseAndValidateJSON(rawText);
    } catch (err) {
      lastError = err;
      // If 404 model not found, try fallback model
      if (err.response?.status === 404) {
        continue;
      }
      throw err;
    }
  }

  throw lastError;
};

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
    return await executeGeminiRequest(payload, apiKey);
  } catch (firstError) {
    console.warn("First attempt calling Gemini API failed, retrying once...", firstError?.message || firstError);

    // Attempt 2 (Retry once)
    try {
      return await executeGeminiRequest(payload, apiKey);
    } catch (retryError) {
      console.error("Gemini retry attempt also failed:", retryError?.response?.data || retryError.message);
      const customError = new Error("Failed to receive a valid structured response from Gemini API after retry.");
      customError.status = 502; // Bad Gateway
      throw customError;
    }
  }
};
