import React from "react";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Database,
  Bug,
  ShieldAlert,
  Lightbulb,
  Sparkles,
  Zap,
} from "lucide-react";

export function AIAnalysisResults({ analysis }) {
  if (!analysis) return null;

  const {
    correctness,
    time_complexity,
    space_complexity,
    complexity_reasoning,
    edge_cases_missed = [],
    bugs = [],
    optimization_suggestion,
  } = analysis;

  const renderCorrectnessBadge = () => {
    switch (correctness) {
      case "correct":
        return (
          <div className="badge badge-success gap-2 py-3 px-4 font-bold text-xs shadow-[0_0_15px_rgba(30,184,84,0.3)]">
            <CheckCircle2 className="size-4" />
            <span>Optimal Solution</span>
          </div>
        );
      case "partially_correct":
        return (
          <div className="badge badge-warning gap-2 py-3 px-4 font-bold text-xs shadow-[0_0_15px_rgba(251,189,35,0.25)]">
            <AlertTriangle className="size-4" />
            <span>Partially Correct</span>
          </div>
        );
      case "incorrect":
      default:
        return (
          <div className="badge badge-error gap-2 py-3 px-4 font-bold text-xs shadow-[0_0_15px_rgba(248,114,114,0.25)]">
            <XCircle className="size-4" />
            <span>Needs Revision</span>
          </div>
        );
    }
  };

  return (
    <div className="p-4 sm:p-5 space-y-4 bg-base-200 min-h-full">
      {/* Top Banner */}
      <div className="bg-base-100 rounded-2xl p-4 border border-base-300 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center text-primary-content shadow-[0_0_15px_rgba(30,184,84,0.3)]">
            <Sparkles className="size-5" />
          </div>
          <div>
            <h3 className="font-bold text-base bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Gemini AI Code Review
            </h3>
            <p className="text-xs text-base-content/60 font-medium">
              Automated complexity & correctness analysis
            </p>
          </div>
        </div>
        <div>{renderCorrectnessBadge()}</div>
      </div>

      {/* Big-O Complexity Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Time Complexity */}
        <div className="card bg-base-100 border border-base-300 hover:border-primary/40 transition-all shadow-sm">
          <div className="card-body p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-base-content/70 flex items-center gap-1.5">
                <Clock className="size-4 text-primary" />
                Time Complexity
              </span>
              <span className="badge badge-primary font-mono font-black text-sm px-3 py-2 shadow-sm">
                {time_complexity || "N/A"}
              </span>
            </div>
            <p className="text-xs text-base-content/60">
              Theoretical runtime scaling relative to input size
            </p>
          </div>
        </div>

        {/* Space Complexity */}
        <div className="card bg-base-100 border border-base-300 hover:border-secondary/40 transition-all shadow-sm">
          <div className="card-body p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-base-content/70 flex items-center gap-1.5">
                <Database className="size-4 text-secondary" />
                Space Complexity
              </span>
              <span className="badge badge-secondary badge-outline font-mono font-black text-sm px-3 py-2">
                {space_complexity || "N/A"}
              </span>
            </div>
            <p className="text-xs text-base-content/60">
              Auxiliary memory footprint used during execution
            </p>
          </div>
        </div>
      </div>

      {/* Complexity Breakdown */}
      {complexity_reasoning && (
        <div className="bg-base-100 border border-base-300 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-primary">
            <Zap className="size-4" />
            <span>Complexity Analysis</span>
          </div>
          <p className="text-sm text-base-content/90 leading-relaxed font-sans">
            {complexity_reasoning}
          </p>
        </div>
      )}

      {/* Potential Bugs & Syntax Warnings */}
      <div className="bg-base-100 border border-base-300 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-error">
          <Bug className="size-4" />
          <span>Bugs & Logical Flaws ({bugs.length})</span>
        </div>
        {bugs.length > 0 ? (
          <div className="space-y-2">
            {bugs.map((bug, index) => (
              <div
                key={index}
                className="flex items-start gap-2.5 p-3 rounded-xl bg-error/10 border border-error/20 text-xs text-error font-medium leading-relaxed"
              >
                <span className="font-black mt-0.5">•</span>
                <span>{bug}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-success/10 border border-success/20 text-xs text-success font-medium">
            <CheckCircle2 className="size-4 shrink-0" />
            <span>No syntax or logical bugs detected in this implementation.</span>
          </div>
        )}
      </div>

      {/* Edge Cases */}
      <div className="bg-base-100 border border-base-300 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-warning">
          <ShieldAlert className="size-4" />
          <span>Edge Cases Missed ({edge_cases_missed.length})</span>
        </div>
        {edge_cases_missed.length > 0 ? (
          <div className="space-y-2">
            {edge_cases_missed.map((edgeCase, index) => (
              <div
                key={index}
                className="flex items-start gap-2.5 p-3 rounded-xl bg-warning/10 border border-warning/20 text-xs text-warning font-medium leading-relaxed"
              >
                <span className="font-black mt-0.5">•</span>
                <span>{edgeCase}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-success/10 border border-success/20 text-xs text-success font-medium">
            <CheckCircle2 className="size-4 shrink-0" />
            <span>All primary boundary edge cases appear properly handled.</span>
          </div>
        )}
      </div>

      {/* Optimization Suggestion */}
      {optimization_suggestion && (
        <div className="bg-gradient-to-br from-primary/15 via-base-100 to-secondary/10 border border-primary/30 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-primary">
            <Lightbulb className="size-4 text-primary" />
            <span>Optimization Recommendation</span>
          </div>
          <p className="text-sm text-base-content/90 leading-relaxed font-sans pl-1">
            {optimization_suggestion}
          </p>
        </div>
      )}
    </div>
  );
}

export default AIAnalysisResults;
