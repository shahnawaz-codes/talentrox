import { useUser } from "@clerk/clerk-react";
import { ArrowRight, Sparkles, Zap, Trophy, Target } from "lucide-react";

function WelcomeSection({ onCreateSession }) {
  const { user } = useUser();

  return (
    <div className="relative overflow-hidden bg-base-300">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-16">
        {/* Main Content */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 lg:gap-8">
          {/* Left Section - Welcome Message */}
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent leading-tight">
                  Welcome back, {user?.firstName || "there"}!
                </h1>
              </div>
            </div>

            <p className="text-base sm:text-lg lg:text-xl text-base-content/70 max-w-2xl leading-relaxed">
              Ready to level up your coding skills? Start a new practice session
              and tackle challenging problems.
            </p>

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-4 pt-2">
              <div className="flex items-center gap-2 px-4 py-2 bg-base-200 rounded-lg border border-base-300">
                <Target className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-base-content">
                  Practice Mode
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-base-200 rounded-lg border border-base-300">
                <Trophy className="w-4 h-4 text-secondary" />
                <span className="text-sm font-medium text-base-content">
                  Track Progress
                </span>
              </div>
            </div>
          </div>

          {/* Right Section - CTA Button */}
          <div className="w-full lg:w-auto">
            <button
              onClick={onCreateSession}
              className="group w-full lg:w-auto px-6 sm:px-8 py-4 bg-gradient-to-r from-primary to-secondary rounded-xl sm:rounded-2xl transition-all duration-200 hover:opacity-90 hover:shadow-xl hover:scale-105 active:scale-100 shadow-lg"
            >
              <div className="flex items-center justify-center gap-3 text-white font-bold text-base sm:text-lg">
                <Zap className="w-5 h-5 sm:w-6 sm:h-6" />
                <span>Create Session</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            <p className="text-xs sm:text-sm text-base-content/50 text-center mt-3 lg:text-right">
              Click to start a new coding challenge
            </p>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl -z-10"></div>
      </div>
    </div>
  );
}

export default WelcomeSection;
