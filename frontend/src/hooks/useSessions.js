import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { sessionApi } from "../api/sessionApi";
import toast from "react-hot-toast";

export const useCreateSession = () => {
  const result = useMutation({
    mutationKey: ["createSession"],
    mutationFn: sessionApi.createSession,
    onSuccess: () => {
      toast.success("Session created successfully!");
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to create session."
      );
    },
  });
  return result;
};

export const useGetActiveSessions = () => {
  const result = useQuery({
    queryKey: ["getActiveSession"],
    queryFn: sessionApi.getActiveSessions,
  });
  return result;
};

export const useMyRecentSessions = () => {
  const result = useQuery({
    queryKey: ["getMyRecentSession"],
    queryFn: sessionApi.getMyRecentSessions,
  });
  return result;
};
export const useGetSessionById = (sessionId) => {
  const result = useQuery({
    queryKey: ["getSessionById", sessionId],
    queryFn: () => sessionApi.getSessionById(sessionId),
  });
  return result;
};

export const useJoinSession = (sessionId) => {
  const queryClient = useQueryClient();
  const result = useMutation({
    mutationKey: ["joinSession"],
    mutationFn: sessionApi.joinSession,
    onSuccess: () => {
      queryClient.invalidateQueries(["getSessionById", sessionId]);
      toast.success("Session Join successfully!");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to Join session.");
    },
  });
  return result;
};
export const useEndSession = (sessionId) => {
  const queryClient = useQueryClient();
  const result = useMutation({
    mutationKey: ["endSession"],
    mutationFn: sessionApi.endSession,
    onSuccess: () => {
      queryClient.invalidateQueries(["getSessionById", sessionId]);
      toast.success("Session Ended successfully!");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to End session.");
    },
  });
  return result;
};
