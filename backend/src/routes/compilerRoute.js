import express from "express";
import axios from "axios";
const compilerRoutes = express.Router();
compilerRoutes.post("/", async (req, res) => {
  const { script, language, versionIndex } = req.body;
  if (!script || !language || !versionIndex) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  let payload = {
    clientId: process.env.JDOODLE_CLIENT_ID,
    clientSecret: process.env.JDOODLE_CLIENT_SECRET,
    script,
    language,
    versionIndex,
  };
  const response = await axios.post(
    "https://api.jdoodle.com/v1/execute",
    payload,
  );
  res.status(200).json({ output: response.data.output });
});
export default compilerRoutes;
