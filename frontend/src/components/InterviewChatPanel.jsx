import React, { useState } from "react";
import {
  Send,
  Loader2,
  Bot,
  User,
  Sparkles,
  StopCircle,
  HelpCircle,
} from "lucide-react";

export function InterviewChatPanel({
  turns = [],
  isSubmittingAnswer,
  onSubmitAnswer,
  onEndInterview,
  isEndingInterview,
  isSubmittingCode,
  hasSubmittedCode,
}) {
  const [answerInput, setAnswerInput] = useState("");

  const answeredTurns = turns.filter((t) => t.answer && t.answer.trim().length > 0);
  const activeTurn = turns.length > 0 ? turns[turns.length - 1] : null;
  const isAwaitingAnswer = activeTurn && (!activeTurn.answer || !activeTurn.answer.trim());

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!answerInput.trim() || isSubmittingAnswer) return;
    onSubmitAnswer(answerInput.trim());
    setAnswerInput("");
  };

  const currentTurnIndex = turns.length;
  const progressPercent = Math.min(100, Math.round((answeredTurns.length / 3) * 100));

  return (
    <div className="h-full flex flex-col bg-base-200 border-l border-base-300 text-base-content">
      {/* Panel Header & Progress */}
      <div className="p-4 bg-base-100/95 backdrop-blur-md border-b border-base-300 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shadow-[0_0_12px_rgba(30,184,84,0.2)]">
              <Bot className="size-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-base-content flex items-center gap-2">
                <span>AI Technical Interviewer</span>
                <span className="badge badge-xs badge-primary">
                  Live
                </span>
              </h3>
              <p className="text-xs text-base-content/60">
                Evaluating logic, tradeoffs, & complexity
              </p>
            </div>
          </div>

          {/* End Interview Button */}
          <button
            onClick={onEndInterview}
            disabled={isEndingInterview || isSubmittingAnswer || isSubmittingCode}
            className="btn btn-ghost btn-xs text-error hover:bg-error/10 border border-error/30 gap-1.5"
            title="End session early and generate final score"
          >
            {isEndingInterview ? (
              <Loader2 className="size-3 animate-spin" />
            ) : (
              <StopCircle className="size-3" />
            )}
            <span>End Interview</span>
          </button>
        </div>

        {/* Progress bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-semibold text-base-content/70">
            <span>
              Follow-up {Math.min(3, turns.length)} of 3
            </span>
            <span className="text-primary font-mono">{progressPercent}%</span>
          </div>
          <div className="w-full bg-base-300 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-primary via-emerald-400 to-accent h-1.5 rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(30,184,84,0.5)]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Chat Messages List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {!hasSubmittedCode ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
            <div className="size-14 rounded-2xl bg-base-100 border border-base-300 flex items-center justify-center text-primary shadow-lg shadow-primary/10">
              <Sparkles className="size-7 text-primary animate-pulse" />
            </div>
            <h4 className="font-bold text-base text-base-content">
              Welcome to Mock Interview Mode
            </h4>
            <p className="text-xs text-base-content/70 max-w-xs leading-relaxed">
              Read the problem statement on the left, write your solution in the editor, and click{" "}
              <span className="text-primary font-bold">"Submit for Review"</span>.
              The AI interviewer will analyze your code and begin questioning you.
            </p>
          </div>
        ) : isSubmittingCode ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
            <div className="size-14 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary animate-pulse">
              <Loader2 className="size-7 animate-spin text-primary" />
            </div>
            <h4 className="font-bold text-base text-base-content">
              Interviewer is reviewing your code...
            </h4>
            <p className="text-xs text-base-content/70 max-w-xs">
              Analyzing Big-O complexity, testing edge cases, and preparing your first follow-up question.
            </p>
          </div>
        ) : (
          <>
            {/* Render previous turns */}
            {turns.map((turn, index) => (
              <div key={index} className="space-y-3">
                {/* Interviewer Question */}
                <div className="flex items-start gap-3">
                  <div className="size-7 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shrink-0 mt-0.5">
                    <Bot className="size-4" />
                  </div>
                  <div className="flex-1 p-3.5 rounded-2xl rounded-tl-sm bg-base-100 border border-base-300 shadow-sm space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-primary">
                      <span>Interviewer Follow-up #{turn.turnNumber}</span>
                      <span className="text-base-content/50 font-normal">
                        {new Date(turn.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-base-content leading-relaxed font-sans">
                      {turn.question}
                    </p>
                  </div>
                </div>

                {/* Candidate Answer if provided */}
                {turn.answer && (
                  <div className="flex items-start gap-3 justify-end">
                    <div className="max-w-[85%] p-3.5 rounded-2xl rounded-tr-sm bg-primary/10 border border-primary/30 shadow-sm space-y-1 text-right">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-primary">
                        <span>Your Answer</span>
                      </div>
                      <p className="text-xs sm:text-sm text-base-content leading-relaxed font-sans text-left">
                        {turn.answer}
                      </p>
                    </div>
                    <div className="size-7 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center text-primary shrink-0 mt-0.5">
                      <User className="size-4" />
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isSubmittingAnswer && (
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-base-100 border border-base-300 text-xs text-base-content/70">
                <Loader2 className="size-4 animate-spin text-primary" />
                <span>Interviewer is evaluating your response...</span>
              </div>
            )}
          </>
        )}
      </div>

      {/* Answer Input Form */}
      {hasSubmittedCode && !isSubmittingCode && isAwaitingAnswer && (
        <div className="p-4 bg-base-100 border-t border-base-300">
          <form onSubmit={handleSubmit} className="space-y-2.5">
            <div className="flex items-center justify-between text-xs text-base-content/70 px-1">
              <span className="flex items-center gap-1.5 font-medium text-primary">
                <HelpCircle className="size-3.5" />
                Answer the interviewer's question:
              </span>
              <span className="text-[11px] text-base-content/50">
                Turn {currentTurnIndex} of 3
              </span>
            </div>

            <div className="relative">
              <textarea
                value={answerInput}
                onChange={(e) => setAnswerInput(e.target.value)}
                placeholder="Explain your approach, tradeoffs, or how you would handle this edge case..."
                rows={3}
                disabled={isSubmittingAnswer}
                className="w-full p-3 rounded-xl bg-base-300 border border-base-content/20 text-xs sm:text-sm text-base-content placeholder-base-content/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                    handleSubmit(e);
                  }
                }}
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-base-content/50 hidden sm:inline">
                Press <kbd className="kbd kbd-xs bg-base-300 text-base-content/70">Ctrl + Enter</kbd> to submit
              </span>

              <button
                type="submit"
                disabled={!answerInput.trim() || isSubmittingAnswer}
                className="btn btn-sm btn-primary shadow-[0_0_15px_rgba(30,184,84,0.3)] ml-auto gap-2"
              >
                {isSubmittingAnswer ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    <span>Evaluating...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Answer</span>
                    <Send className="size-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default InterviewChatPanel;
