import { getDifficultyBadgeClass } from "../lib/utils";
import { FileText, List, CheckCircle, AlertCircle } from "lucide-react";

function ProblemDescription({ problem, currentProblemId, onProblemChange, allProblems }) {
  return (
    <div className="h-full flex flex-col bg-base-200">
      {/* STICKY HEADER SECTION */}
      <div className="sticky top-0 z-10 bg-base-100 border-b border-base-300 shadow-sm">
        <div className="p-4 sm:p-6">
          {/* Problem selector - moved to top for better accessibility */}
          <div className="mb-4">
            <label className="text-xs font-medium text-base-content/60 mb-1.5 block uppercase tracking-wide">
              Select Problem
            </label>
            <select
              className="select select-bordered w-full focus:outline-none focus:border-primary"
              value={currentProblemId}
              onChange={(e) => onProblemChange(e.target.value)}
            >
              {allProblems.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} ({p.difficulty})
                </option>
              ))}
            </select>
          </div>

          {/* Title and difficulty badge */}
          <div className="flex items-start gap-3 mb-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-base-content flex-1 leading-tight">
              {problem.title}
            </h1>
            <span className={`badge badge-lg ${getDifficultyBadgeClass(problem.difficulty)} shrink-0`}>
              {problem.difficulty}
            </span>
          </div>
          <p className="text-sm text-base-content/70 font-medium">{problem.category}</p>
        </div>
      </div>

      {/* SCROLLABLE CONTENT */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 sm:p-6 space-y-5">
          {/* PROBLEM DESCRIPTION - More prominent */}
          <section className="bg-base-100 rounded-lg shadow-sm p-4 sm:p-6 border border-base-300">
            <h2 className="text-lg font-bold text-base-content mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Description
            </h2>
            <div className="space-y-3 text-base leading-relaxed">
              <p className="text-base-content/90">{problem.description.text}</p>
              {problem.description.notes.map((note, idx) => (
                <p key={idx} className="text-base-content/80 text-sm">
                  {note}
                </p>
              ))}
            </div>
          </section>

          {/* EXAMPLES SECTION - Improved layout */}
          <section className="bg-base-100 rounded-lg shadow-sm p-4 sm:p-6 border border-base-300">
            <h2 className="text-lg font-bold mb-4 text-base-content flex items-center gap-2">
              <List className="w-5 h-5 text-secondary" />
              Examples
            </h2>
            <div className="space-y-5">
              {problem.examples.map((example, idx) => (
                <div key={idx} className="last:mb-0">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="badge badge-sm badge-primary">{idx + 1}</span>
                    <p className="font-semibold text-base-content text-sm">Example {idx + 1}</p>
                  </div>
                  <div className="bg-base-200 rounded-lg p-4 space-y-3">
                    {/* Input */}
                    <div>
                      <div className="text-xs font-bold text-primary uppercase tracking-wide mb-1.5">
                        Input
                      </div>
                      <div className="font-mono text-sm bg-base-300/50 rounded px-3 py-2">
                        {example.input}
                      </div>
                    </div>

                    {/* Output */}
                    <div>
                      <div className="text-xs font-bold text-secondary uppercase tracking-wide mb-1.5">
                        Output
                      </div>
                      <div className="font-mono text-sm bg-base-300/50 rounded px-3 py-2">
                        {example.output}
                      </div>
                    </div>

                    {/* Explanation */}
                    {example.explanation && (
                      <div className="pt-3 border-t border-base-300">
                        <div className="text-xs font-semibold text-base-content/70 uppercase tracking-wide mb-1.5">
                          Explanation
                        </div>
                        <p className="text-sm text-base-content/80 leading-relaxed">
                          {example.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* CONSTRAINTS - Cleaner list */}
          <section className="bg-base-100 rounded-lg shadow-sm p-4 sm:p-6 border border-base-300">
            <h2 className="text-lg font-bold mb-4 text-base-content flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-accent" />
              Constraints
            </h2>
            <ul className="space-y-2.5">
              {problem.constraints.map((constraint, idx) => (
                <li key={idx} className="flex gap-3 items-start">
                  <span className="text-primary mt-1 text-lg leading-none">•</span>
                  <code className="text-sm text-base-content/90 flex-1 leading-relaxed">
                    {constraint}
                  </code>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

export default ProblemDescription;