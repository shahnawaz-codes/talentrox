import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { analyzeApi } from "../api/analyzeApi";

export function useAnalyzeCode() {
  const result = useMutation({
    mutationFn: analyzeApi.analyzeCode,
    onSuccess: () => {
      toast.success("AI Code Analysis completed!");
    },
    onError: (error) => {
      const msg =
        error?.response?.data?.error ||
        error?.message ||
        "Failed to analyze code. Please try again.";
      toast.error(msg);
      console.error("AI Analysis error:", error);
    },
  });

  return result;
}

export default useAnalyzeCode;
