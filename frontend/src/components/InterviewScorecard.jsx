import React from "react";
import {
  Award,
  CheckCircle2,
  TrendingUp,
  Brain,
  MessageSquare,
  Sparkles,
  ArrowRight,
  RotateCcw,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

export function InterviewScorecard({ finalScore, onRestart, problemTitle }) {
  if (!finalScore) return null;

  const {
    overall_score = 0,
    problem_solving_score = 0,
    communication_score = 0,
    strengths = [],
    areas_to_improve = [],
    summary = "",
  } = finalScore;

  const getScoreBadgeColor = (score) => {
    if (score >= 8) return "text-primary border-primary/50 bg-primary/10 shadow-[0_0_15px_rgba(30,184,84,0.25)]";
    if (score >= 6) return "text-warning border-warning/50 bg-warning/10 shadow-[0_0_15px_rgba(251,189,35,0.2)]";
    return "text-error border-error/50 bg-error/10 shadow-[0_0_15px_rgba(248,114,114,0.2)]";
  };

  return (
    <div className="p-6 space-y-6 bg-base-100 border border-base-300 rounded-3xl shadow-2xl text-base-content max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2 pb-5 border-b border-base-300">
        <div className="inline-flex items-center justify-center p-3.5 rounded-2xl bg-primary/10 border border-primary/30 text-primary mb-1 shadow-[0_0_20px_rgba(30,184,84,0.25)]">
          <Award className="size-8 text-primary" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-primary via-emerald-400 to-accent bg-clip-text text-transparent">
          Mock Interview Completed
        </h2>
        <p className="text-sm text-base-content/70">
          Performance evaluation for{" "}
          <span className="text-primary font-semibold">{problemTitle}</span>
        </p>
      </div>

      {/* Score Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Overall Score */}
        <div className="p-5 rounded-2xl bg-base-200 border border-base-300 text-center flex flex-col items-center justify-center">
          <div className="text-xs uppercase font-bold tracking-wider text-base-content/60 mb-2 flex items-center gap-1.5">
            <Sparkles className="size-4 text-primary" />
            Overall Score
          </div>
          <div
            className={`size-20 rounded-full flex items-center justify-center border-2 text-2xl font-black mb-1.5 ${getScoreBadgeColor(
              overall_score
            )}`}
          >
            {overall_score}
            <span className="text-xs text-base-content/60 font-normal">/10</span>
          </div>
          <span className="text-xs text-base-content/70 font-medium">
            {overall_score >= 8 ? "Strong Hire" : overall_score >= 6 ? "Hire / Leaning Hire" : "Needs Practice"}
          </span>
        </div>

        {/* Problem Solving */}
        <div className="p-5 rounded-2xl bg-base-200 border border-base-300 text-center flex flex-col items-center justify-center">
          <div className="text-xs uppercase font-bold tracking-wider text-base-content/60 mb-2 flex items-center gap-1.5">
            <Brain className="size-4 text-primary" />
            Problem Solving
          </div>
          <div
            className={`size-20 rounded-full flex items-center justify-center border-2 text-2xl font-black mb-1.5 ${getScoreBadgeColor(
              problem_solving_score
            )}`}
          >
            {problem_solving_score}
            <span className="text-xs text-base-content/60 font-normal">/10</span>
          </div>
          <span className="text-xs text-base-content/70 font-medium">Algorithm & Logic</span>
        </div>

        {/* Communication */}
        <div className="p-5 rounded-2xl bg-base-200 border border-base-300 text-center flex flex-col items-center justify-center">
          <div className="text-xs uppercase font-bold tracking-wider text-base-content/60 mb-2 flex items-center gap-1.5">
            <MessageSquare className="size-4 text-primary" />
            Communication
          </div>
          <div
            className={`size-20 rounded-full flex items-center justify-center border-2 text-2xl font-black mb-1.5 ${getScoreBadgeColor(
              communication_score
            )}`}
          >
            {communication_score}
            <span className="text-xs text-base-content/60 font-normal">/10</span>
          </div>
          <span className="text-xs text-base-content/70 font-medium">Clarity & Tradeoffs</span>
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="p-5 rounded-2xl bg-base-200 border border-base-300">
          <div className="text-xs font-bold uppercase tracking-wider text-primary mb-1.5 flex items-center gap-2">
            <TrendingUp className="size-4 text-primary" />
            <span>Interviewer Executive Summary</span>
          </div>
          <p className="text-sm text-base-content/90 leading-relaxed font-sans">{summary}</p>
        </div>
      )}

      {/* Strengths & Areas to Improve */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Strengths */}
        <div className="p-5 rounded-2xl bg-success/10 border border-success/30 space-y-2.5">
          <div className="text-xs font-bold uppercase tracking-wider text-success flex items-center gap-2">
            <CheckCircle2 className="size-4 text-success" />
            <span>Demonstrated Strengths</span>
          </div>
          <ul className="space-y-2">
            {strengths.map((str, idx) => (
              <li key={idx} className="text-xs text-base-content/90 flex items-start gap-2">
                <span className="text-success font-bold">•</span>
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Areas to Improve */}
        <div className="p-5 rounded-2xl bg-warning/10 border border-warning/30 space-y-2.5">
          <div className="text-xs font-bold uppercase tracking-wider text-warning flex items-center gap-2">
            <AlertCircle className="size-4 text-warning" />
            <span>Areas to Improve</span>
          </div>
          <ul className="space-y-2">
            {areas_to_improve.map((area, idx) => (
              <li key={idx} className="text-xs text-base-content/90 flex items-start gap-2">
                <span className="text-warning font-bold">•</span>
                <span>{area}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-5 border-t border-base-300">
        {onRestart && (
          <button
            onClick={onRestart}
            className="btn btn-outline btn-sm gap-2 text-base-content/80 hover:text-base-content border-base-content/20"
          >
            <RotateCcw className="size-4" />
            Restart Interview
          </button>
        )}
        <div className="flex items-center gap-3 ml-auto">
          <Link
            to="/problems"
            className="btn btn-primary btn-sm gap-2 shadow-[0_0_15px_rgba(30,184,84,0.3)] hover:scale-105 transition-all"
          >
            <span>Practice Another Problem</span>
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default InterviewScorecard;
