import React, { useState, useEffect } from "react";
import { Terminal, Sparkles, Loader2 } from "lucide-react";
import AIAnalysisResults from "./AIAnalysisResults";

function OutputPanel({ output, analysis, isAnalyzing }) {
  const [activeTab, setActiveTab] = useState("output");

  // Automatically switch to AI analysis tab when analysis starts or completes
  useEffect(() => {
    if (isAnalyzing || analysis) {
      setActiveTab("analysis");
    }
  }, [isAnalyzing, analysis]);

  return (
    <div className="h-full bg-base-100 flex flex-col">
      {/* Tab Navigation */}
      <div className="px-4 py-2.5 bg-base-200 border-b border-base-300 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Console Output Tab */}
          <button
            onClick={() => setActiveTab("output")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === "output"
                ? "bg-base-100 text-base-content shadow-sm border border-base-300"
                : "text-base-content/60 hover:text-base-content hover:bg-base-300/60"
            }`}
          >
            <Terminal className="size-3.5 text-primary" />
            <span>Console Output</span>
          </button>

          {/* AI Code Review Tab */}
          <button
            onClick={() => setActiveTab("analysis")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === "analysis"
                ? "bg-primary/10 text-primary border border-primary/30 shadow-[0_0_12px_rgba(30,184,84,0.15)]"
                : "text-base-content/60 hover:text-primary hover:bg-base-300/60"
            }`}
          >
            {isAnalyzing ? (
              <Loader2 className="size-3.5 animate-spin text-primary" />
            ) : (
              <Sparkles className="size-3.5 text-primary" />
            )}
            <span>AI Code Review</span>

            {analysis && (
              <span
                className={`size-2 rounded-full ${
                  analysis.correctness === "correct"
                    ? "bg-success shadow-[0_0_8px_rgba(30,184,84,0.8)]"
                    : analysis.correctness === "partially_correct"
                    ? "bg-warning shadow-[0_0_8px_rgba(251,189,35,0.8)]"
                    : "bg-error shadow-[0_0_8px_rgba(248,114,114,0.8)]"
                }`}
              />
            )}
          </button>
        </div>

        {activeTab === "analysis" && isAnalyzing && (
          <span className="text-xs text-primary flex items-center gap-1.5 font-medium animate-pulse">
            <span className="size-1.5 rounded-full bg-primary animate-ping" />
            Gemini Analyzing...
          </span>
        )}
      </div>

      {/* Tab Body */}
      <div className="flex-1 overflow-auto">
        {activeTab === "output" ? (
          <div className="p-4">
            {output === null ? (
              <p className="text-base-content/50 text-sm">
                Click "Run Code" to see the output here...
              </p>
            ) : (
              <div>
                {output.output && (
                  <pre className="text-sm font-mono text-base-content whitespace-pre-wrap mb-2">
                    {output.output}
                  </pre>
                )}
                {output.error && (
                  <pre className="text-sm font-mono text-error whitespace-pre-wrap">
                    {output.error}
                  </pre>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="h-full">
            {isAnalyzing ? (
              <div className="h-full min-h-[240px] flex flex-col items-center justify-center p-6 bg-base-200 text-center">
                <div className="size-16 rounded-2xl bg-gradient-to-br from-primary/20 via-secondary/15 to-accent/10 border border-primary/30 flex items-center justify-center mb-4 shadow-[0_0_25px_rgba(30,184,84,0.25)] animate-pulse">
                  <Sparkles className="size-8 text-primary animate-spin" />
                </div>
                <h4 className="font-bold text-base text-base-content mb-1">
                  Gemini AI is analyzing your solution...
                </h4>
                <p className="text-xs text-base-content/60 max-w-sm leading-relaxed">
                  Calculating Big-O time & space complexity, evaluating boundary edge
                  cases, and inspecting syntax/logic.
                </p>
              </div>
            ) : analysis ? (
              <AIAnalysisResults analysis={analysis} />
            ) : (
              <div className="h-full min-h-[240px] flex flex-col items-center justify-center p-6 bg-base-200 text-center">
                <div className="size-16 mx-auto mb-4 bg-gradient-to-br from-primary/20 to-secondary/10 border border-primary/20 rounded-2xl flex items-center justify-center shadow-lg">
                  <Sparkles className="size-8 text-primary" />
                </div>
                <h4 className="font-bold text-base text-base-content mb-1">
                  No Code Analysis Yet
                </h4>
                <p className="text-xs text-base-content/60 max-w-sm leading-relaxed">
                  Click the{" "}
                  <span className="text-primary font-bold">"Analyze Code"</span>{" "}
                  button above to get an instant AI evaluation of your solution,
                  including Big-O complexity, bugs, and edge cases.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default OutputPanel;
