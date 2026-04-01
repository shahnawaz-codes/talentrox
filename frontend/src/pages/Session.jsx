import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useEndSession,
  useGetSessionById,
  useJoinSession,
} from "../hooks/useSessions";
import { PROBLEMS } from "../data/problems";
import { executeCode } from "../lib/piston";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import CodeEditorPanel from "../components/CodeEditorPanel";
import OutputPanel from "../components/OutputPanel";
import { useUser } from "@clerk/clerk-react";
import ProblemDescription from "../components/Session/ProblemDescription";
import { Loader2Icon, PhoneOffIcon } from "lucide-react";
import { normalizeOutput, triggerConfetti } from "../lib/utils";
import toast from "react-hot-toast";
import useStreamClient from "../hooks/useStreamClient";
import { StreamCall, StreamVideo } from "@stream-io/video-react-sdk";
import VideoCallUI from "../components/VideoCallUI";

const Session = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState(null);
  const { data: session, isLoading, refetch } = useGetSessionById(sessionId);
  const sessionJoinMutation = useJoinSession(sessionId);
  const sessionEndMutation = useEndSession(sessionId);
  // Get current problem details by matching the title
  const currentProblem = session?.problem
    ? Object.values(PROBLEMS).find((p) => p.title == session?.problem)
    : null;
  const isHost = session?.host?.clerkId == user?.id;
  const isParticipant = session?.participant?.clerkId == user?.id;

  const { streamClient, call, chatClient, channel, isInitializingCall } =
    useStreamClient(session, isLoading, isHost, isParticipant);
  // If user is neither host nor participant, join as participant
  useEffect(() => {
    if (
      isLoading ||
      !session ||
      !sessionId ||
      isHost ||
      isParticipant ||
      session.status === "completed"
    ) {
      return;
    }
    sessionJoinMutation.mutate(sessionId, { onSuccess: refetch });
  }, [isLoading, session, isHost, isParticipant, sessionId]);

  // State to hold the code editor content
  const [code, setCode] = useState(
    currentProblem?.starterCode[selectedLanguage] || "",
  );
  // Update starter code when problem or language changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    if (currentProblem) {
      setCode(currentProblem.starterCode[selectedLanguage] || "");
    }
  }, [currentProblem, selectedLanguage]);

  const handleLanguageChange = (e) => {
    if (!currentProblem) return;
    const newLanguage = e.target.value;
    setSelectedLanguage(newLanguage);
    setOutput(null);
    // Update code to the new language's starter code
    setCode(currentProblem.starterCode[newLanguage] || "");
  };
  const handleRunCode = async () => {
    try {
      if (!session || !currentProblem) return;
      setOutput(null);
      setIsRunning(true);
      const result = await executeCode(selectedLanguage, code);
      setOutput(result);
      if (result.success) {
        const expectedOutput = currentProblem.expectedOutput[selectedLanguage];
        const testsPassed =
          normalizeOutput(result.output) === normalizeOutput(expectedOutput);
        if (testsPassed) {
          triggerConfetti();
          toast.success("All test cases passed!");
        } else {
          toast.error("Some test cases failed. Please try again.");
        }
      } else {
        toast.error("Error while execution. ");
      }
    } catch (error) {
      setOutput({ success: false, error: "Error executing code." });
      console.error("Error executing code:", error);
    } finally {
      setIsRunning(false);
    }
  };
  // Navigate to dashboard the "participant" when session is ended
  useEffect(() => {
    if (!session || isLoading) return;
    if (session.status == "completed") {
      navigate("/dashboard");
    }
  }, [session, isLoading, navigate]);
  const handleEndSession = () => {
    if (!sessionId || sessionEndMutation.isPending || !session) return;
    if (session.status === "completed") return;
    if (confirm("Are you sure you want to end the session?")) {
      sessionEndMutation.mutate(sessionId, {
        onSuccess: () => {
          // this will navigate to dashboard after ending the session only host
          navigate("/dashboard");
        },
      });
    }
  };
  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="h-screen bg-base-100 flex flex-col mt-24">
      <div className="flex-1">
        <PanelGroup direction="horizontal">
          {/* LEFT PANEL */}
          <Panel defaultSize={50} minSize={30}>
            <PanelGroup direction="vertical">
              {/* PROBLEM DETAILS */}
              <Panel defaultSize={50} minSize={20}>
                <ProblemDescription
                  session={session}
                  currentProblem={currentProblem}
                  isHost={isHost}
                  handleEndSession={handleEndSession}
                  sessionEndMutation={sessionEndMutation}
                />
              </Panel>

              <PanelResizeHandle className="h-2 bg-base-300 hover:bg-primary transition-colors cursor-row-resize" />

              {/* CODE + OUTPUT */}
              <Panel defaultSize={50} minSize={20}>
                <PanelGroup direction="vertical">
                  <Panel defaultSize={70} minSize={30}>
                    <CodeEditorPanel
                      selectedLanguage={selectedLanguage}
                      code={code}
                      isRunning={isRunning}
                      onLanguageChange={handleLanguageChange}
                      onCodeChange={setCode}
                      onRunCode={handleRunCode}
                    />
                  </Panel>

                  <PanelResizeHandle className="h-2 bg-base-300 hover:bg-primary transition-colors cursor-row-resize" />

                  <Panel defaultSize={30} minSize={15}>
                    <OutputPanel output={output} />
                  </Panel>
                </PanelGroup>
              </Panel>
            </PanelGroup>
          </Panel>

          <PanelResizeHandle className="w-2 bg-base-300 hover:bg-primary transition-colors cursor-col-resize" />

          {/* RIGHT PANEL - VIDEO */}
          <Panel defaultSize={50} minSize={30}>
            <div className="h-full bg-base-200 p-4 overflow-auto">
              {isInitializingCall ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <Loader2Icon className="w-12 h-12 mx-auto animate-spin text-primary mb-4" />
                    <p className="text-lg">Connecting to video call...</p>
                  </div>
                </div>
              ) : !streamClient || !call ? (
                <div className="h-full flex items-center justify-center">
                  <div className="card bg-base-100 shadow-xl max-w-md">
                    <div className="card-body items-center text-center">
                      <div className="w-24 h-24 bg-error/10 rounded-full flex items-center justify-center mb-4">
                        <PhoneOffIcon className="w-12 h-12 text-error" />
                      </div>
                      <h2 className="card-title text-2xl">Connection Failed</h2>
                      <p className="text-base-content/70">
                        Unable to connect to the video call
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full">
                  <StreamVideo client={streamClient}>
                    <StreamCall call={call}>
                      <VideoCallUI chatClient={chatClient} channel={channel} />
                    </StreamCall>
                  </StreamVideo>
                </div>
              )}
            </div>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
};

export default Session;
