import React from "react";
import { getDifficultyBadgeClass } from "../../lib/utils";
import { Loader2, LogOutIcon,   User } from "lucide-react";

const ProblemDescription = ({
  session,
  currentProblem,
  isHost,
  handleEndSession,
  sessionEndMutation,
}) => {
  return (
    <div className="h-full overflow-y-auto bg-base-200">
      <div className="p-6 bg-base-100 border-b border-base-300">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h1 className="text-3xl font-bold text-base-content">
              {session?.problem || "Problem Title"}
            </h1>
            <p className="text-base-content/60 mt-1">
              {currentProblem?.category || "Easy • Arrays"}
            </p>
            <p className="text-base-content/60 mt-2">
              {` Host: ${session?.host.name} • ${
                session?.participant ? 2 : 1
              }/2 participants`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`badge badge-lg ${getDifficultyBadgeClass(
                currentProblem?.difficulty
              )}`}
            >
              {currentProblem?.difficulty || "Easy"}
            </span>
            {isHost && session?.status !== "completed" && (
              <button
                onClick={handleEndSession}
                disabled={sessionEndMutation.isPending}
                className="btn btn-error btn-sm gap-2"
              >
                {sessionEndMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <LogOutIcon className="w-4 h-4" />
                )}
                End Session
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* problem desc */}
        {currentProblem?.description && (
          <div className="bg-base-100 rounded-xl shadow-sm p-5 border border-base-300">
            <h2 className="text-xl font-bold mb-4 text-base-content">
              Description
            </h2>
            <div className="space-y-3 text-base leading-relaxed">
              <p className="text-base-content/90">
                {currentProblem.description.text}
              </p>
              {currentProblem.description.notes?.map((note, idx) => (
                <p key={idx} className="text-base-content/90">
                  {note}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* EXAMPLES */}
        <div className="bg-base-100 rounded-xl shadow-sm p-5 border border-base-300">
          <h2 className="text-xl font-bold mb-4 text-base-content">Examples</h2>

          {currentProblem?.examples && currentProblem.examples.length > 0 ? (
            <div className="space-y-4">
              {currentProblem.examples.map((example, idx) => (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="badge badge-sm">{idx + 1}</span>
                    <p className="font-semibold text-base-content">
                      Example {idx + 1}
                    </p>
                  </div>

                  <div className="bg-base-200 rounded-lg p-4 font-mono text-sm space-y-1.5">
                    <div className="flex gap-2">
                      <span className="text-primary font-bold min-w-[70px]">
                        Input:
                      </span>
                      <span>{example.input}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-secondary font-bold min-w-[70px]">
                        Output:
                      </span>
                      <span>{example.output}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        {/* CONSTRAINTS */}
        <div className="bg-base-100 rounded-xl shadow-sm p-5 border border-base-300">
          <h2 className="text-xl font-bold mb-4 text-base-content">
            Constraints
          </h2>
          <ul className="space-y-2 text-base-content/90">
            {currentProblem.constraints?.map((constraint, idx) => (
              <li className="flex gap-2" key={idx}>
                <span className="text-primary">•</span>
                <code className="text-sm">{constraint}</code>
              </li>
            )) || "loading"}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProblemDescription;
