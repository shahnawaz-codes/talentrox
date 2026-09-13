import express from "express";
import axios from "axios";

const compilerRoutes = express.Router();

compilerRoutes.post("/", async (req, res, next) => {
  try {
    const { script, language, versionIndex } = req.body || {};

    if (!script || !language || versionIndex === undefined || versionIndex === null) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const payload = {
      clientId: process.env.JDOODLE_CLIENT_ID,
      clientSecret: process.env.JDOODLE_CLIENT_SECRET,
      script,
      language,
      versionIndex,
    };

    const response = await axios.post(
      "https://api.jdoodle.com/v1/execute",
      payload
    );

    if (response.data?.error) {
      return res.status(400).json({ error: response.data.error, output: response.data.output || "" });
    }

    return res.status(200).json({ output: response.data.output || "" });
  } catch (error) {
    console.error("Error in compiler route:", error?.response?.data || error.message);
    return res.status(500).json({
      error: error?.response?.data?.error || error.message || "Failed to execute code",
    });
  }
});

export default compilerRoutes;

