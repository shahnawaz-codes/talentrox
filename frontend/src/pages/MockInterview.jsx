import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import {
  Sparkles,
  Bot,
  Send,
  Loader2,
  ChevronLeft,
  BookOpen,
  Code2,
  CheckCircle2,
  AlertCircle,
  StopCircle,
  RotateCcw,
  MessageSquare,
  FileText,
} from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";

import { PROBLEMS, LANGUAGE_CONFIG } from "../data/problems";
import { getDifficultyBadgeClass, triggerConfetti } from "../lib/utils";
import interviewApi from "../api/interviewApi";
import InterviewChatPanel from "../components/InterviewChatPanel";
import InterviewScorecard from "../components/InterviewScorecard";

export default function MockInterview() {
  const { problemId } = useParams();
  const navigate = useNavigate();
  const { isLoaded: isAuthLoaded, isSignedIn, getToken } = useAuth();

  // Validate problem
  const currentProblemId = problemId && PROBLEMS[problemId] ? problemId : "two-sum";
  const problem = PROBLEMS[currentProblemId];

  // Editor and language state
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState(problem.starterCode[selectedLanguage] || "");
  const [activeLeftTab, setActiveLeftTab] = useState("editor"); // "editor" | "description"

  // Session state
  const [session, setSession] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isSubmittingCode, setIsSubmittingCode] = useState(false);
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);
  const [isEndingInterview, setIsEndingInterview] = useState(false);
  const [showChatInResults, setShowChatInResults] = useState(false);

  // Initialize or resume session
  useEffect(() => {
    if (!isAuthLoaded || !isSignedIn) return;

    let isMounted = true;

    async function initSession() {
      setIsInitializing(true);
      try {
        const token = await getToken();
        const authHeader = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

        // Check if there's an active session stored in sessionStorage for this problem
        const cachedSessionId = sessionStorage.getItem(`mock_interview_${currentProblemId}`);
        if (cachedSessionId && cachedSessionId !== "undefined" && cachedSessionId !== "null") {
          try {
            const data = await interviewApi.getSession(cachedSessionId, authHeader);
            const existing = data?.session || data;
            const validId = data?.sessionId || existing?._id || cachedSessionId;
            if (isMounted && existing && existing.problemId === currentProblemId && existing.status === "active") {
              setSession(existing);
              setSessionId(validId);
              if (existing.code) {
                setCode(existing.code);
              }
              setIsInitializing(false);
              return;
            }
          } catch (e) {
            sessionStorage.removeItem(`mock_interview_${currentProblemId}`);
          }
        } else {
          sessionStorage.removeItem(`mock_interview_${currentProblemId}`);
        }

        // Create or retrieve active session from backend
        const data = await interviewApi.startSession(currentProblemId, authHeader);
        const sessionObj = data?.session || data;
        const validSessionId = data?.sessionId || sessionObj?._id;

        if (isMounted && sessionObj && validSessionId) {
          setSession(sessionObj);
          setSessionId(validSessionId);
          sessionStorage.setItem(`mock_interview_${currentProblemId}`, validSessionId);
          if (sessionObj.code) {
            setCode(sessionObj.code);
          }
        }
      } catch (err) {
        console.error("Failed to initialize interview session:", err);
        const errMsg = err.response?.data?.error || err.response?.data?.message || err.message;
        toast.error(`Could not start interview session: ${errMsg}`);
      } finally {
        if (isMounted) setIsInitializing(false);
      }
    }

    initSession();

    return () => {
      isMounted = false;
    };
  }, [currentProblemId, isAuthLoaded, isSignedIn]);

  // Update starter code when language changes if code hasn't been heavily customized
  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setSelectedLanguage(newLang);
    if (!session || !session.turns || session.turns.length === 0) {
      setCode(problem.starterCode[newLang] || "");
    }
  };

  const getProblemStatement = () => {
    const notes = problem?.description?.notes?.join("\n") || "";
    const constraints = problem?.constraints?.join("\n") || "";
    return `${problem?.title || "Problem"}\n\nDescription:\n${problem?.description?.text || ""}\n${notes}\n\nConstraints:\n${constraints}`;
  };

  // Submit code for AI review & first follow-up question
  const handleSubmitCode = async () => {
    if (!code || !code.trim()) {
      toast.error("Please write your solution code first.");
      return;
    }

    let activeSessionId = sessionId;
    if (!activeSessionId) {
      try {
        const startData = await interviewApi.startSession(currentProblemId);
        const sess = startData?.session || startData;
        activeSessionId = startData?.sessionId || sess?._id;
        if (activeSessionId) {
          setSession(sess);
          setSessionId(activeSessionId);
          sessionStorage.setItem(`mock_interview_${currentProblemId}`, activeSessionId);
        }
      } catch (err) {
        toast.error("Interview session not ready. Please refresh.");
        return;
      }
    }

    if (!activeSessionId) {
      toast.error("Interview session not ready. Please refresh.");
      return;
    }

    setIsSubmittingCode(true);
    try {
      const result = await interviewApi.submitCode(activeSessionId, {
        code,
        language: selectedLanguage,
        problemStatement: getProblemStatement(),
      });

      const updatedSession = result?.session || result;
      setSession(updatedSession);
      toast.success("Code submitted! The interviewer has a follow-up question.");
    } catch (err) {
      console.error("Error submitting code:", err);
      const errMsg = err.response?.data?.error || err.response?.data?.message || "Failed to analyze code. Please try again.";
      toast.error(errMsg);
    } finally {
      setIsSubmittingCode(false);
    }
  };

  // Submit answer to the interviewer's question
  const handleSubmitAnswer = async (answerText) => {
    if (!sessionId) return;

    setIsSubmittingAnswer(true);
    try {
      const result = await interviewApi.submitAnswer(sessionId, {
        answer: answerText,
        problemStatement: getProblemStatement(),
      });

      const updatedSession = result?.session || result;
      setSession(updatedSession);

      if (result.isCompleted) {
        toast.success("Interview completed! Generating scorecard...");
        if (result.finalScore?.overall_score >= 7 || updatedSession?.finalScore?.overall_score >= 7) {
          triggerConfetti();
        }
      } else {
        toast.success("Answer received. Next follow-up is ready.");
      }
    } catch (err) {
      console.error("Error submitting answer:", err);
      const errMsg = err.response?.data?.error || err.response?.data?.message || "Failed to evaluate answer. Please try again.";
      toast.error(errMsg);
    } finally {
      setIsSubmittingAnswer(false);
    }
  };

  // End interview early and force final score calculation
  const handleEndInterview = async () => {
    if (!sessionId) return;

    const confirmEnd = window.confirm(
      "Are you sure you want to end the interview now? Your final scorecard will be generated based on the completed turns."
    );
    if (!confirmEnd) return;

    setIsEndingInterview(true);
    try {
      const result = await interviewApi.endSession(sessionId, {
        problemStatement: getProblemStatement(),
      });

      const updatedSession = result?.session || result;
      setSession(updatedSession);
      toast.success("Interview ended. Scorecard generated!");
      if (result.finalScore?.overall_score >= 7 || updatedSession?.finalScore?.overall_score >= 7) {
        triggerConfetti();
      }
    } catch (err) {
      console.error("Error ending interview:", err);
      const errMsg = err.response?.data?.error || err.response?.data?.message || "Failed to end interview.";
      toast.error(errMsg);
    } finally {
      setIsEndingInterview(false);
    }
  };

  // Restart a fresh session
  const handleRestart = async () => {
    sessionStorage.removeItem(`mock_interview_${currentProblemId}`);
    setCode(problem.starterCode[selectedLanguage] || "");
    setShowChatInResults(false);
    setIsInitializing(true);
    try {
      const data = await interviewApi.startSession(currentProblemId);
      const sessionObj = data?.session || data;
      const validSessionId = data?.sessionId || sessionObj?._id;
      setSession(sessionObj);
      setSessionId(validSessionId);
      if (validSessionId) {
        sessionStorage.setItem(`mock_interview_${currentProblemId}`, validSessionId);
      }
      toast.success("Started a new interview session!");
    } catch (err) {
      toast.error("Failed to start new session.");
    } finally {
      setIsInitializing(false);
    }
  };

  const isCompleted = session?.status === "completed" || !!session?.finalScore;
  const turns = session?.turns || [];
  const hasSubmittedCode = turns.length > 0 || isSubmittingCode;

  if (isInitializing) {
    return (
      <div className="h-screen bg-base-300 flex flex-col items-center justify-center text-base-content pt-20">
        <div className="size-14 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary mb-4 shadow-[0_0_20px_rgba(30,184,84,0.25)] animate-pulse">
          <Bot className="size-7 animate-bounce text-primary" />
        </div>
        <h2 className="text-xl font-bold text-base-content">Preparing Mock Interview Session...</h2>
        <p className="text-sm text-base-content/60 mt-1">Configuring problem constraints and AI interviewer persona</p>
      </div>
    );
  }

  return (
    <div className="h-screen bg-base-300 text-base-content flex flex-col pt-24 overflow-hidden">
      {/* Top Header Bar */}
      <header className="h-14 bg-base-100/95 backdrop-blur-md border-b border-base-300 px-4 flex items-center justify-between z-20 shrink-0">
        <div className="flex items-center gap-3">
          <Link
            to="/problems"
            className="btn btn-ghost btn-xs text-base-content/70 hover:text-base-content gap-1"
          >
            <ChevronLeft className="size-4" />
            <span className="hidden sm:inline">Problems</span>
          </Link>

          <div className="h-5 w-px bg-base-300" />

          {/* Problem info & selector */}
          <div className="flex items-center gap-2">
            <select
              className="select select-xs bg-base-200 border-base-300 text-base-content font-semibold focus:outline-none focus:border-primary"
              value={currentProblemId}
              onChange={(e) => navigate(`/mock-interview/${e.target.value}`)}
            >
              {Object.values(PROBLEMS).map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} ({p.difficulty})
                </option>
              ))}
            </select>
            <span className={`badge badge-xs ${getDifficultyBadgeClass(problem.difficulty)}`}>
              {problem.difficulty}
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-semibold shadow-[0_0_12px_rgba(30,184,84,0.15)]">
            <Sparkles className="size-3 text-primary" />
            <span>AI Mock Interview Mode</span>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2.5">
          {/* Language Selector */}
          <div className="flex items-center gap-1.5">
            <img
              src={LANGUAGE_CONFIG[selectedLanguage]?.icon}
              alt={LANGUAGE_CONFIG[selectedLanguage]?.name}
              className="size-4"
            />
            <select
              className="select select-xs bg-base-200 border-base-300 text-base-content focus:outline-none focus:border-primary"
              value={selectedLanguage}
              onChange={handleLanguageChange}
              disabled={isSubmittingCode}
            >
              {Object.entries(LANGUAGE_CONFIG).map(([key, lang]) => (
                <option key={key} value={key}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Code Button */}
          {!isCompleted && (
            <button
              onClick={handleSubmitCode}
              disabled={isSubmittingCode || isSubmittingAnswer || isEndingInterview}
              className="btn btn-primary btn-xs font-bold shadow-[0_0_15px_rgba(30,184,84,0.3)] gap-1.5 hover:scale-105 transition-all"
              title="Submit code to AI interviewer for complexity analysis & follow-up"
            >
              {isSubmittingCode ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Reviewing Code...</span>
                </>
              ) : (
                <>
                  <Sparkles className="size-3.5" />
                  <span>{turns.length > 0 ? "Re-submit Code" : "Submit for Review"}</span>
                </>
              )}
            </button>
          )}

          {/* If completed, option to restart */}
          {isCompleted && (
            <button
              onClick={handleRestart}
              className="btn btn-xs btn-outline border-base-content/20 hover:border-primary text-base-content/80 gap-1.5"
            >
              <RotateCcw className="size-3" />
              <span>New Session</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Split Layout */}
      <div className="flex-1 overflow-hidden">
        <PanelGroup direction="horizontal">
          {/* Left Panel: Code Editor & Problem Statement Tabs */}
          <Panel defaultSize={52} minSize={30} className="flex flex-col bg-base-300">
            {/* Tab switch bar */}
            <div className="flex items-center justify-between px-4 py-2 bg-base-100 border-b border-base-300 shrink-0">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveLeftTab("editor")}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    activeLeftTab === "editor"
                      ? "bg-primary/10 text-primary border border-primary/30 shadow-[0_0_10px_rgba(30,184,84,0.15)]"
                      : "text-base-content/60 hover:text-base-content hover:bg-base-200"
                  }`}
                >
                  <Code2 className="size-3.5" />
                  <span>Solution Code</span>
                </button>
                <button
                  onClick={() => setActiveLeftTab("description")}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    activeLeftTab === "description"
                      ? "bg-primary/10 text-primary border border-primary/30 shadow-[0_0_10px_rgba(30,184,84,0.15)]"
                      : "text-base-content/60 hover:text-base-content hover:bg-base-200"
                  }`}
                >
                  <FileText className="size-3.5" />
                  <span>Problem Statement</span>
                </button>
              </div>

              <span className="text-[11px] text-base-content/50 font-mono">
                {problem.category}
              </span>
            </div>

            {/* Tab Content */}
            <div className="flex-1 relative">
              {activeLeftTab === "editor" ? (
                <div className="h-full flex flex-col">
                  {/* Helper banner */}
                  <div className="px-4 py-1.5 bg-base-200 border-b border-base-300 text-[11px] text-base-content/70 flex items-center justify-between">
                    <span className="truncate">
                      Implement your algorithm, then click <strong className="text-primary">"Submit for Review"</strong> to begin follow-up questions.
                    </span>
                  </div>
                  <div className="flex-1">
                    <Editor
                      height="100%"
                      language={LANGUAGE_CONFIG[selectedLanguage]?.monacoLang || "javascript"}
                      value={code}
                      onChange={(val) => setCode(val || "")}
                      theme="vs-dark"
                      options={{
                        fontSize: 14,
                        lineNumbers: "on",
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        minimap: { enabled: false },
                        wordWrap: "on",
                        tabSize: 2,
                        smoothScrolling: true,
                        cursorSmoothCaretAnimation: "on",
                        padding: { top: 12 },
                      }}
                    />
                  </div>
                </div>
              ) : (
                /* Problem Description tab */
                <div className="h-full overflow-y-auto p-6 space-y-6 bg-base-200">
                  <div>
                    <h2 className="text-xl font-bold text-base-content mb-1">{problem.title}</h2>
                    <p className="text-xs text-primary font-medium">{problem.category}</p>
                  </div>

                  <div className="p-4 rounded-xl bg-base-100 border border-base-300 space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-base-content/60">Description</h3>
                    <p className="text-sm text-base-content leading-relaxed">{problem.description.text}</p>
                    {problem.description.notes?.map((note, idx) => (
                      <p key={idx} className="text-xs text-base-content/70 italic">
                        • {note}
                      </p>
                    ))}
                  </div>

                  {/* Examples */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-base-content/60">Examples</h3>
                    {problem.examples.map((eg, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-base-100 border border-base-300 space-y-1.5 text-xs font-mono">
                        <div>
                          <span className="text-primary font-bold">Input: </span>
                          <span className="text-base-content">{eg.input}</span>
                        </div>
                        <div>
                          <span className="text-success font-bold">Output: </span>
                          <span className="text-base-content">{eg.output}</span>
                        </div>
                        {eg.explanation && (
                          <div className="text-[11px] text-base-content/60 font-sans mt-1">
                            Explanation: {eg.explanation}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Constraints */}
                  {problem.constraints && problem.constraints.length > 0 && (
                    <div className="p-4 rounded-xl bg-base-100 border border-base-300 space-y-2">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-base-content/60">Constraints</h3>
                      <ul className="space-y-1 text-xs font-mono text-base-content/80">
                        {problem.constraints.map((c, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <span className="size-1.5 rounded-full bg-primary" />
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Panel>

          {/* Resizable Divider */}
          <PanelResizeHandle className="w-1.5 bg-base-300 hover:bg-primary transition-colors cursor-col-resize shadow-sm" />

          {/* Right Panel: Chat Panel OR Scorecard */}
          <Panel defaultSize={48} minSize={30} className="flex flex-col bg-base-200">
            {isCompleted && !showChatInResults ? (
              <div className="h-full overflow-y-auto p-4 flex flex-col justify-between">
                <InterviewScorecard
                  finalScore={session.finalScore}
                  problemTitle={problem.title}
                  onRestart={handleRestart}
                />
                <div className="text-center py-4">
                  <button
                    onClick={() => setShowChatInResults(true)}
                    className="btn btn-ghost btn-xs text-primary hover:bg-primary/10 gap-1.5"
                  >
                    <MessageSquare className="size-3.5" />
                    <span>View Full Interview Transcript</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col">
                {isCompleted && (
                  <div className="px-4 py-2 bg-base-100 border-b border-base-300 flex items-center justify-between">
                    <span className="text-xs text-primary font-semibold flex items-center gap-1.5">
                      <CheckCircle2 className="size-4 text-primary" />
                      Interview Completed (Score: {session?.finalScore?.overall_score || "N/A"}/10)
                    </span>
                    <button
                      onClick={() => setShowChatInResults(false)}
                      className="btn btn-xs bg-base-300 hover:bg-base-200 text-base-content border border-base-content/10"
                    >
                      Back to Scorecard
                    </button>
                  </div>
                )}
                <div className="flex-1 overflow-hidden">
                  <InterviewChatPanel
                    turns={turns}
                    isSubmittingAnswer={isSubmittingAnswer}
                    onSubmitAnswer={handleSubmitAnswer}
                    onEndInterview={handleEndInterview}
                    isEndingInterview={isEndingInterview}
                    isSubmittingCode={isSubmittingCode}
                    hasSubmittedCode={hasSubmittedCode}
                  />
                </div>
              </div>
            )}
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}
