import { useMutation } from "@tanstack/react-query";
import compilerApi from "../api/compilerApi";

export function useExecuteCode() {
  const result = useMutation({
    mutationFn: (payload) => compilerApi(payload),
    onSuccess: () => {
      console.log("code runned successfully ");
    },
    onError: (error) => {
      console.log(
        error?.response?.data?.message ||
          "something goes wrong while execute code",
      );
    },
  });
  return result;
}
