import { Link } from "react-router";
import Navbar from "../components/Navbar";

import { PROBLEMS } from "../data/problems";
import { ChevronRightIcon, Code2Icon, TrendingUp, Award, Target } from "lucide-react";
import { getDifficultyBadgeClass } from "../lib/utils";
import { useState } from "react";

function Problems() {
  const problems = Object.values(PROBLEMS);
  const [filter, setFilter] = useState("All");

  const easyProblemsCount = problems.filter(
    (p) => p.difficulty === "Easy"
  ).length;
  const mediumProblemsCount = problems.filter(
    (p) => p.difficulty === "Medium"
  ).length;
  const hardProblemsCount = problems.filter(
    (p) => p.difficulty === "Hard"
  ).length;

  const filteredProblems = filter === "All" 
    ? problems 
    : problems.filter(p => p.difficulty === filter);

  return (
    <div className="min-h-screen bg-gradient-to-b from-base-100 to-base-200">

      <div className="max-w-7xl mx-auto px-4 py-12 mt-20">
        {/* ENHANCED HEADER */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="size-14 rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center shadow-lg">
              <Code2Icon className="size-8 text-primary-content" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Practice Problems
              </h1>
              <p className="text-base-content/70 mt-1">
                Sharpen your coding skills with these curated problems
              </p>
            </div>
          </div>

          {/* STATS CARDS - TOP */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            <div className="card bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 hover:shadow-lg hover:scale-105 transition-all duration-300">
              <div className="card-body p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-primary">{problems.length}</div>
                    <div className="text-xs text-base-content/60 font-medium">Total Problems</div>
                  </div>
                  <Target className="size-8 text-primary/40" />
                </div>
              </div>
            </div>

            <div className="card bg-gradient-to-br from-success/10 to-success/5 border border-success/20 hover:shadow-lg hover:scale-105 transition-all duration-300">
              <div className="card-body p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-success">{easyProblemsCount}</div>
                    <div className="text-xs text-base-content/60 font-medium">Easy</div>
                  </div>
                  <TrendingUp className="size-8 text-success/40" />
                </div>
              </div>
            </div>

            <div className="card bg-gradient-to-br from-warning/10 to-warning/5 border border-warning/20 hover:shadow-lg hover:scale-105 transition-all duration-300">
              <div className="card-body p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-warning">{mediumProblemsCount}</div>
                    <div className="text-xs text-base-content/60 font-medium">Medium</div>
                  </div>
                  <Award className="size-8 text-warning/40" />
                </div>
              </div>
            </div>

            <div className="card bg-gradient-to-br from-error/10 to-error/5 border border-error/20 hover:shadow-lg hover:scale-105 transition-all duration-300">
              <div className="card-body p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-error">{hardProblemsCount}</div>
                    <div className="text-xs text-base-content/60 font-medium">Hard</div>
                  </div>
                  <Code2Icon className="size-8 text-error/40" />
                </div>
              </div>
            </div>
          </div>

          {/* FILTER TABS */}
          <div className="flex gap-2 mt-8 flex-wrap">
            {["All", "Easy", "Medium", "Hard"].map((difficulty) => (
              <button
                key={difficulty}
                onClick={() => setFilter(difficulty)}
                className={`px-6 py-2.5 rounded-full font-medium transition-all duration-200 ${
                  filter === difficulty
                    ? "bg-primary text-primary-content shadow-[0_0_15px_rgba(var(--p),0.4)]"
                    : "bg-base-100 text-base-content/70 hover:bg-base-200 border border-base-300"
                }`}
              >
                {difficulty}
              </button>
            ))}
          </div>
        </div>

        {/* ENHANCED PROBLEMS LIST */}
        <div className="space-y-4">
          {filteredProblems.map((problem, index) => (
            <Link
              key={problem.id}
              to={`/problem/${problem.id}`}
              className="card bg-base-100 hover:shadow-xl hover:scale-[1.02] hover:border-primary/30 transition-all duration-300 border border-base-300 group"
              style={{
                animation: `fadeInUp 0.5s ease-out ${index * 0.05}s both`
              }}
            >
              <div className="card-body">
                <div className="flex items-center justify-between gap-4">
                  {/* LEFT SIDE */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="size-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center group-hover:shadow-lg transition-all duration-300">
                        <Code2Icon className="size-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h2 className="text-xl font-bold text-base-content group-hover:text-primary transition-colors">
                            {problem.title}
                          </h2>
                          <span
                            className={`badge ${getDifficultyBadgeClass(
                              problem.difficulty
                            )}`}
                          >
                            {problem.difficulty}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm px-2.5 py-0.5 rounded-full bg-base-200 text-base-content/70 font-medium">
                            {problem.category}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-base-content/70 leading-relaxed">
                      {problem.description.text}
                    </p>
                  </div>

                  {/* RIGHT SIDE */}
                  <div className="flex items-center gap-2 text-primary group-hover:gap-3 transition-all">
                    <span className="font-medium hidden sm:inline">Solve</span>
                    <ChevronRightIcon className="size-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* EMPTY STATE */}
        {filteredProblems.length === 0 && (
          <div className="card bg-base-100 border border-base-300 mt-8">
            <div className="card-body text-center py-12">
              <Code2Icon className="size-16 text-base-content/20 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">No problems found</h3>
              <p className="text-base-content/60">Try selecting a different difficulty filter</p>
            </div>
          </div>
        )}

        {/* MOTIVATION CARD */}
        <div className="mt-12 card bg-gradient-to-r from-primary to-secondary text-primary-content shadow-xl">
          <div className="card-body">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="size-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Award className="size-9 text-white" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-1">Keep Going! 🚀</h3>
                  <p className="text-primary-content/90">
                    Every problem solved is a step closer to mastery
                  </p>
                </div>
              </div>
              <button className="btn btn-lg bg-white text-primary hover:bg-base-100 border-0 shadow-lg hover:scale-105 transition-all">
                Track Progress
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
export default Problems;