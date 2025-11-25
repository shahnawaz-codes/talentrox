import express from "express";
import cors from "cors";
import path from "path";
import routes from "./routes/index.js";
import { ENV } from "./lib/env.js";
const app = express();
app.use(cors());

app.get("/hello", (req, res) => {
  res.send("Welcome to the API");
});
app.use("/api", routes);
const _dirname = path.resolve();
//make our app ready for development and production
if (ENV.NODE_ENV === "production") {
  // Serve static files from the React frontend app
  app.use(express.static(path.join(_dirname, "../frontend/dist")));
// Anything(route) that doesn't match the above, send back index.html
  app.get("/{*any}", (req, res) => {
    res.sendFile(path.join(_dirname, "../frontend/dist/index.html"));
  });
}

app.listen(ENV.PORT, () => {
  console.log(`Server is running on port ${ENV.PORT}`);
});
