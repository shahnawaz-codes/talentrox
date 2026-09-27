import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import App from "./App";
import Home from "./pages/Home";
import Problems from "./pages/Problems";
import Problem from "./pages/Problem";
import DashboardPage from "./pages/Dashboard";
import Session from "./pages/Session";

import MockInterview from "./pages/MockInterview";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true, // Default route
        element: <Home />,
      },
      {
        path: "problems",
        element: (
          <ProtectedRoute>
            <Problems />
          </ProtectedRoute>
        ),
      },
      {
        path: "problem/:id",
        element: (
          <ProtectedRoute>
            <Problem />
          </ProtectedRoute>
        ),
      },
      {
        path: "mock-interview/:problemId?",
        element: (
          <ProtectedRoute>
            <MockInterview />
          </ProtectedRoute>
        ),
      },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "session/:sessionId",
        element: (
          <ProtectedRoute>
            <Session />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);