import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import App from "./App";
import Home from "./pages/Home";
import Problems from "./pages/Problems";
import Problem from "./pages/Problem";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true, // index: true means it is the default route
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
    ],
  },
]);
