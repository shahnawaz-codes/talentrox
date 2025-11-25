import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import { PORT } from "./lib/env.js";
const app = express();
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Welcome to the API");
});
app.use("/api", routes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
