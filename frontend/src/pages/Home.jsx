import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  ArrowRight,
  Code2,
  Sparkles,
  Video,
  Zap,
  ShieldCheck,
  TrendingUp,
  PlayCircle,
  Menu,
  X,
  Bot,
  MessageSquare,
  Terminal,
  BookOpen,
  LayoutDashboard,
  ExternalLink,
} from "lucide-react";
import {
  ClerkLoaded,
  ClerkLoading,
  SignInButton,
  SignedIn,
  SignedOut,
} from "@clerk/clerk-react";
import { PROBLEMS } from "../data/problems";
import { analytics } from "../main";

function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeWorkflowTab, setActiveWorkflowTab] = useState("peer"); // "peer" | "ai"
  const [activePreviewTab, setActivePreviewTab] = useState("session"); // "session" | "video" | "dashboard"
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  const problemList = Object.values(PROBLEMS);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleOpenDemo = () => {
    setIsDemoModalOpen(true);
    if (analytics?.track) {
      analytics.track("open_platform_tour", { source: "hero" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-base-100 via-base-200 to-base-300 text-base-content selection:bg-primary selection:text-primary-content">
      {/* CLERK LOADING PLACEHOLDER */}
      <ClerkLoading>
        <div className="h-16 w-full bg-base-100 animate-pulse fixed top-0 z-50 border-b border-base-300" />
      </ClerkLoading>

      {/* GUEST NAVBAR (SIGNED OUT) */}
      <ClerkLoaded>
        <SignedOut>
          <nav
            className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 rounded-full
            px-6 py-3 w-[95%] max-w-7xl
            flex justify-between items-center
            transition-all duration-300 ease-in-out
            backdrop-blur-md
            ${
              scrolled
                ? "bg-base-100/95 shadow-[0_8px_32px_rgba(0,0,0,0.25)] scale-[0.98] border border-primary/30"
                : "scale-100 bg-base-100/60 border border-base-content/10 shadow-md"
            }`}
          >
            {/* LOGO */}
            <Link
              to="/"
              className="flex items-center gap-3 group hover:opacity-90 transition-all duration-200"
            >
              <div className="relative">
                <div
                  className={`rounded-xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center transition-all duration-300 ${
                    scrolled ? "size-10 shadow-md" : "size-11 shadow-lg"
                  }`}
                >
                  <Sparkles
                    className={`text-primary-content transition-all duration-300 ${
                      scrolled ? "size-5" : "size-6"
                    }`}
                    strokeWidth={2.5}
                  />
                </div>
                <div className="absolute -top-1 -right-1 size-3 bg-success rounded-full border-2 border-base-100 animate-pulse"></div>
              </div>

              <div className="flex flex-col">
                <span
                  className={`font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent transition-all duration-300 ${
                    scrolled ? "text-xl" : "text-2xl"
                  }`}
                >
                  Talent<span className="text-primary">ROX</span>
                </span>
                <span
                  className={`text-base-content/60 font-medium -mt-1 transition-all duration-300 ${
                    scrolled ? "text-xs" : "text-sm"
                  }`}
                >
                  Interview & AI Platform
                </span>
              </div>
            </Link>

            {/* DESKTOP NAVIGATION LINKS */}
            <div className="hidden md:flex items-center gap-6">
              <a
                href="#features"
                className="text-sm font-medium text-base-content/75 hover:text-primary transition-colors"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-sm font-medium text-base-content/75 hover:text-primary transition-colors"
              >
                How It Works
              </a>
              <a
                href="#showcase"
                className="text-sm font-medium text-base-content/75 hover:text-primary transition-colors"
              >
                Platform Showcase
              </a>
              <a
                href="#problem-bank"
                className="text-sm font-medium text-base-content/75 hover:text-primary transition-colors"
              >
                DSA Problems
              </a>
              <a
                href="#faq"
                className="text-sm font-medium text-base-content/75 hover:text-primary transition-colors"
              >
                FAQ
              </a>
            </div>

            {/* AUTH BUTTON - DESKTOP */}
            <div className="hidden md:flex items-center gap-3">
              <SignInButton mode="modal">
                <button className="btn btn-primary btn-sm gap-2 rounded-full px-5 shadow-[0_0_15px_rgba(var(--p),0.3)] hover:scale-105 transition-all">
                  <span>Get Started Free</span>
                  <ArrowRight className="size-4" />
                </button>
              </SignInButton>
            </div>

            {/* MOBILE MENU TOGGLE */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden btn btn-ghost btn-circle btn-sm text-base-content"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? (
                <X className="size-6" />
              ) : (
                <Menu className="size-6" />
              )}
            </button>
          </nav>

          {/* MOBILE MENU DROPDOWN */}
          {isMobileMenuOpen && (
            <div className="fixed top-20 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-md rounded-2xl shadow-2xl p-6 md:hidden backdrop-blur-md bg-base-100/95 border border-primary/20 animate-in slide-in-from-top-4 duration-200">
              <ul className="flex flex-col gap-3 font-medium">
                <li>
                  <a
                    href="#features"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2 px-3 rounded-lg hover:bg-base-200 transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#how-it-works"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2 px-3 rounded-lg hover:bg-base-200 transition-colors"
                  >
                    How It Works
                  </a>
                </li>
                <li>
                  <a
                    href="#showcase"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2 px-3 rounded-lg hover:bg-base-200 transition-colors"
                  >
                    Platform Showcase
                  </a>
                </li>
                <li>
                  <a
                    href="#problem-bank"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2 px-3 rounded-lg hover:bg-base-200 transition-colors"
                  >
                    DSA Problems
                  </a>
                </li>
                <li>
                  <a
                    href="#faq"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2 px-3 rounded-lg hover:bg-base-200 transition-colors"
                  >
                    FAQ
                  </a>
                </li>
                <li className="pt-2 border-t border-base-300">
                  <SignInButton mode="modal">
                    <button className="btn btn-primary w-full gap-2 rounded-full shadow-md">
                      <span>Get Started Free</span>
                      <ArrowRight className="size-4" />
                    </button>
                  </SignInButton>
                </li>
              </ul>
            </div>
          )}
        </SignedOut>
      </ClerkLoaded>

      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-6 pt-32 pb-20 lg:pt-36 lg:pb-28">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* LEFT CONTENT */}
          <div className="space-y-6">
            {/* HONEST PILL BADGE */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-primary/10 border border-primary/25 rounded-full">
              <Sparkles className="size-4 text-primary animate-pulse" />
              <span className="text-xs sm:text-sm font-semibold text-primary">
                100% Free & Open Technical Interview Platform
              </span>
            </div>

            {/* HEADING */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.15]">
                Ace Technical Interviews with{" "}
                <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent block mt-1">
                  Live Video & AI Feedback
                </span>
              </h1>

              <p className="text-base sm:text-lg text-base-content/75 leading-relaxed max-w-xl">
                Collaborate in live 1-on-1 coding sessions with HD video & chat,
                run code in a sandboxed compiler, or sharpen your skills solo
                with an interactive AI technical interviewer.
              </p>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-wrap gap-4 pt-2">
              <SignedIn>
                <Link
                  to="/dashboard"
                  className="btn btn-primary btn-md sm:btn-lg gap-2 shadow-lg hover:scale-105 transition-all rounded-xl"
                >
                  <LayoutDashboard className="size-5" />
                  <span>Go to Dashboard</span>
                  <ArrowRight className="size-4" />
                </Link>

                <Link
                  to="/mock-interview"
                  className="btn btn-outline btn-md sm:btn-lg gap-2 hover:scale-105 transition-all rounded-xl"
                >
                  <Bot className="size-5 text-primary" />
                  <span>AI Mock Interview</span>
                </Link>
              </SignedIn>

              <SignedOut>
                <SignInButton mode="modal">
                  <button className="btn btn-primary btn-md sm:btn-lg gap-2 shadow-lg hover:scale-105 transition-all rounded-xl">
                    <Zap className="size-5" />
                    <span>Start Practicing Free</span>
                    <ArrowRight className="size-4" />
                  </button>
                </SignInButton>

                <button
                  onClick={handleOpenDemo}
                  className="btn btn-outline btn-md sm:btn-lg gap-2 hover:scale-105 transition-all rounded-xl"
                >
                  <PlayCircle className="size-5" />
                  <span>Explore Platform Tour</span>
                </button>
              </SignedOut>
            </div>

            {/* AUTHENTIC TECH STACK HIGHLIGHTS */}
            <div className="pt-4 border-t border-base-content/10">
              <p className="text-xs uppercase tracking-wider font-semibold text-base-content/50 mb-3">
                Powered by Modern Engineering
              </p>
              <div className="flex flex-wrap gap-2.5">
                <div className="badge badge-neutral gap-1.5 py-3 px-3.5 text-xs font-medium">
                  <Bot className="size-3.5 text-secondary" />
                  <span>Conversational AI</span>
                </div>
                <div className="badge badge-neutral gap-1.5 py-3 px-3.5 text-xs font-medium">
                  <Video className="size-3.5 text-primary" />
                  <span>Stream WebRTC Video</span>
                </div>
                <div className="badge badge-neutral gap-1.5 py-3 px-3.5 text-xs font-medium">
                  <Terminal className="size-3.5 text-accent" />
                  <span>JDoodle Code Runner</span>
                </div>
                <div className="badge badge-neutral gap-1.5 py-3 px-3.5 text-xs font-medium">
                  <ShieldCheck className="size-3.5 text-success" />
                  <span>Clerk Authentication</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT HERO MOCKUP */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-secondary/15 to-transparent rounded-3xl blur-2xl opacity-60"></div>
            <div className="relative bg-base-100/90 rounded-2xl shadow-2xl border border-base-content/15 p-4 sm:p-5 overflow-hidden group">
              <img
                src="/images/hero.png"
                alt="TalentROX Technical Interview Interface"
                className="w-full h-auto rounded-xl shadow-md border border-base-content/10 group-hover:scale-[1.01] transition-transform duration-500"
              />

              {/* FLOATING REAL FEATURE PILLS */}
              <div className="absolute top-7 left-7 bg-base-100/95 text-base-content border border-success/40 px-3.5 py-1.5 rounded-lg shadow-xl text-xs font-semibold flex items-center gap-2 backdrop-blur-sm">
                <span className="size-2 rounded-full bg-success animate-pulse"></span>
                <span>Live 1-on-1 Interview Call</span>
              </div>

              <div className="absolute bottom-7 right-7 bg-base-100/95 text-base-content border border-primary/40 px-3.5 py-1.5 rounded-lg shadow-xl text-xs font-semibold flex items-center gap-2 backdrop-blur-sm">
                <Bot className="size-4 text-primary" />
                <span>AI Scorecard & Adaptive Hinting</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE PLATFORM CAPABILITIES BAR (REPLACED FAKE NUMBERS) */}
      <section className="bg-base-200/80 border-y border-base-300 py-10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-base-100 border border-base-300 shadow-sm">
              <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                <Bot className="size-6" />
              </div>
              <div>
                <div className="font-bold text-base">AI Mock Interviewer</div>
                <div className="text-xs text-base-content/65 mt-0.5">
                  Dynamic questioning, hints, and post-session 1-10 scoring.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-xl bg-base-100 border border-base-300 shadow-sm">
              <div className="p-2.5 rounded-lg bg-secondary/10 text-secondary">
                <Video className="size-6" />
              </div>
              <div>
                <div className="font-bold text-base">Stream Video & Chat</div>
                <div className="text-xs text-base-content/65 mt-0.5">
                  Ultra-low latency WebRTC calling with in-room text messaging.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-xl bg-base-100 border border-base-300 shadow-sm">
              <div className="p-2.5 rounded-lg bg-accent/10 text-accent">
                <Terminal className="size-6" />
              </div>
              <div>
                <div className="font-bold text-base">Multi-Language Sandbox</div>
                <div className="text-xs text-base-content/65 mt-0.5">
                  Monaco editor with remote execution in JS, Python & Java.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-xl bg-base-100 border border-base-300 shadow-sm">
              <div className="p-2.5 rounded-lg bg-success/10 text-success">
                <Code2 className="size-6" />
              </div>
              <div>
                <div className="font-bold text-base">Curated Problem Bank</div>
                <div className="text-xs text-base-content/65 mt-0.5">
                  LeetCode-style DSA challenges with automated test suites.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section
        className="max-w-7xl mx-auto px-6 py-20 lg:py-24"
        id="features"
      >
        <div className="text-center mb-16 space-y-3">
          <div className="inline-block px-3.5 py-1.5 bg-primary/10 border border-primary/20 rounded-full">
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">
              Core Capabilities
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Built for Real Technical Mastery
          </h2>
          <p className="text-base sm:text-lg text-base-content/70 max-w-2xl mx-auto">
            Everything you need to conduct live peer coding sessions and practice
            algorithmic challenges with real-time AI guidance.
          </p>
        </div>

        {/* 6 AUTHENTIC FEATURE CARDS */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: AI Mock Interviewer */}
          <div className="card bg-base-100 border border-base-300 hover:border-primary hover:shadow-xl transition-all duration-300">
            <div className="card-body">
              <div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-2">
                <Bot className="size-6" />
              </div>
              <h3 className="card-title text-lg font-bold">
                AI Mock Interviewer
              </h3>
              <p className="text-sm text-base-content/70">
                Experience simulated technical interviews with an adaptive
                AI interviewer. Discuss approaches, request progressive hints,
                and defend your design choices in real time.
              </p>
              <div className="card-actions mt-4 flex-wrap">
                <span className="badge badge-primary badge-outline badge-sm">
                  Interactive AI
                </span>
                <span className="badge badge-primary badge-outline badge-sm">
                  Dynamic Prompts
                </span>
                <span className="badge badge-primary badge-outline badge-sm">
                  Solo Practice
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: AI Scorecard & Code Analysis */}
          <div className="card bg-base-100 border border-base-300 hover:border-secondary hover:shadow-xl transition-all duration-300">
            <div className="card-body">
              <div className="size-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center mb-2">
                <TrendingUp className="size-6" />
              </div>
              <h3 className="card-title text-lg font-bold">
                AI Scorecard & Analysis
              </h3>
              <p className="text-sm text-base-content/70">
                Receive instant Big-O time and space complexity evaluations,
                edge-case identification, bug detection, and a comprehensive
                1-10 post-interview evaluation report.
              </p>
              <div className="card-actions mt-4 flex-wrap">
                <span className="badge badge-secondary badge-outline badge-sm">
                  Big-O Audit
                </span>
                <span className="badge badge-secondary badge-outline badge-sm">
                  Bug Detection
                </span>
                <span className="badge badge-secondary badge-outline badge-sm">
                  1-10 Scorecard
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: HD Video Calling */}
          <div className="card bg-base-100 border border-base-300 hover:border-accent hover:shadow-xl transition-all duration-300">
            <div className="card-body">
              <div className="size-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-2">
                <Video className="size-6" />
              </div>
              <h3 className="card-title text-lg font-bold">
                HD Video Calling
              </h3>
              <p className="text-sm text-base-content/70">
                Conduct face-to-face peer interviews with low-latency WebRTC
                video and audio powered by Stream Video SDK. Features quick mic
                and camera toggles alongside your workspace.
              </p>
              <div className="card-actions mt-4 flex-wrap">
                <span className="badge badge-accent badge-outline badge-sm">
                  Stream Video SDK
                </span>
                <span className="badge badge-accent badge-outline badge-sm">
                  WebRTC
                </span>
                <span className="badge badge-accent badge-outline badge-sm">
                  Mic & Cam Controls
                </span>
              </div>
            </div>
          </div>

          {/* Card 4: In-Session Live Chat */}
          <div className="card bg-base-100 border border-base-300 hover:border-info hover:shadow-xl transition-all duration-300">
            <div className="card-body">
              <div className="size-12 rounded-xl bg-info/10 text-info flex items-center justify-center mb-2">
                <MessageSquare className="size-6" />
              </div>
              <h3 className="card-title text-lg font-bold">
                In-Session Live Chat
              </h3>
              <p className="text-sm text-base-content/70">
                Share custom test cases, edge scenarios, and notes in an
                integrated chat panel without interrupting the vocal flow of
                your interview.
              </p>
              <div className="card-actions mt-4 flex-wrap">
                <span className="badge badge-info badge-outline badge-sm">
                  Stream Chat
                </span>
                <span className="badge badge-info badge-outline badge-sm">
                  In-Room Sync
                </span>
                <span className="badge badge-info badge-outline badge-sm">
                  Sidebar Drawer
                </span>
              </div>
            </div>
          </div>

          {/* Card 5: Sandboxed Code Runner */}
          <div className="card bg-base-100 border border-base-300 hover:border-success hover:shadow-xl transition-all duration-300">
            <div className="card-body">
              <div className="size-12 rounded-xl bg-success/10 text-success flex items-center justify-center mb-2">
                <Terminal className="size-6" />
              </div>
              <h3 className="card-title text-lg font-bold">
                Monaco Editor & Runner
              </h3>
              <p className="text-sm text-base-content/70">
                Write solutions in a full-featured Monaco editor. Execute code
                against real test cases via the JDoodle sandbox API in
                JavaScript, Python, or Java with confetti celebrations.
              </p>
              <div className="card-actions mt-4 flex-wrap">
                <span className="badge badge-success badge-outline badge-sm">
                  Monaco Editor
                </span>
                <span className="badge badge-success badge-outline badge-sm">
                  JDoodle API
                </span>
                <span className="badge badge-success badge-outline badge-sm">
                  JS, Python, Java
                </span>
              </div>
            </div>
          </div>

          {/* Card 6: Curated Problem Library */}
          <div className="card bg-base-100 border border-base-300 hover:border-warning hover:shadow-xl transition-all duration-300">
            <div className="card-body">
              <div className="size-12 rounded-xl bg-warning/10 text-warning flex items-center justify-center mb-2">
                <BookOpen className="size-6" />
              </div>
              <h3 className="card-title text-lg font-bold">
                Curated Problem Bank
              </h3>
              <p className="text-sm text-base-content/70">
                Access curated algorithmic problems with complete descriptions,
                examples, edge-case constraints, starter templates, and
                expected outputs.
              </p>
              <div className="card-actions mt-4 flex-wrap">
                <span className="badge badge-warning badge-outline badge-sm">
                  LeetCode Style
                </span>
                <span className="badge badge-warning badge-outline badge-sm">
                  Starter Code
                </span>
                <span className="badge badge-warning badge-outline badge-sm">
                  Automated Tests
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS (AUTHENTIC 2-MODE WALKTHROUGH) */}
      <section
        className="bg-base-200/60 border-y border-base-300 py-20 lg:py-24"
        id="how-it-works"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12 space-y-3">
            <div className="inline-block px-3.5 py-1.5 bg-primary/10 border border-primary/20 rounded-full">
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                Step-by-Step
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              How TalentROX Works
            </h2>
            <p className="text-base sm:text-lg text-base-content/70 max-w-xl mx-auto">
              Choose your mode: conduct a live 1-on-1 peer technical interview or
              practice solo with the AI interviewer.
            </p>

            {/* TAB SELECTOR */}
            <div className="flex justify-center pt-4">
              <div className="join bg-base-100 p-1 rounded-full border border-base-300 shadow-sm">
                <button
                  onClick={() => setActiveWorkflowTab("peer")}
                  className={`btn btn-sm sm:btn-md rounded-full px-5 transition-all ${
                    activeWorkflowTab === "peer"
                      ? "btn-primary shadow-md"
                      : "btn-ghost"
                  }`}
                >
                  <Video className="size-4" />
                  <span>1-on-1 Peer Interview</span>
                </button>
                <button
                  onClick={() => setActiveWorkflowTab("ai")}
                  className={`btn btn-sm sm:btn-md rounded-full px-5 transition-all ${
                    activeWorkflowTab === "ai"
                      ? "btn-primary shadow-md"
                      : "btn-ghost"
                  }`}
                >
                  <Bot className="size-4" />
                  <span>Solo AI Mock Interview</span>
                </button>
              </div>
            </div>
          </div>

          {/* WORKFLOW CONTENT */}
          {activeWorkflowTab === "peer" ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="card bg-base-100 border border-base-300 shadow-sm p-6 relative">
                <div className="size-9 rounded-full bg-primary text-primary-content font-bold flex items-center justify-center text-sm mb-4">
                  1
                </div>
                <h4 className="font-bold text-lg mb-2">Create a Session</h4>
                <p className="text-sm text-base-content/70">
                  Select a problem from the dashboard, choose the target
                  difficulty, and launch a dedicated room.
                </p>
              </div>

              <div className="card bg-base-100 border border-base-300 shadow-sm p-6 relative">
                <div className="size-9 rounded-full bg-secondary text-secondary-content font-bold flex items-center justify-center text-sm mb-4">
                  2
                </div>
                <h4 className="font-bold text-lg mb-2">Join Video & Chat</h4>
                <p className="text-sm text-base-content/70">
                  The participant joins from the active sessions dashboard into
                  the synchronized Stream video and chat channel.
                </p>
              </div>

              <div className="card bg-base-100 border border-base-300 shadow-sm p-6 relative">
                <div className="size-9 rounded-full bg-accent text-accent-content font-bold flex items-center justify-center text-sm mb-4">
                  3
                </div>
                <h4 className="font-bold text-lg mb-2">Code & Execute</h4>
                <p className="text-sm text-base-content/70">
                  Solve the problem in Monaco editor, switch between JS, Python,
                  or Java, and run code live against test suites.
                </p>
              </div>

              <div className="card bg-base-100 border border-base-300 shadow-sm p-6 relative">
                <div className="size-9 rounded-full bg-success text-success-content font-bold flex items-center justify-center text-sm mb-4">
                  4
                </div>
                <h4 className="font-bold text-lg mb-2">Session History</h4>
                <p className="text-sm text-base-content/70">
                  End the session when finished. The completed interview is
                  logged in your personal dashboard history.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="card bg-base-100 border border-base-300 shadow-sm p-6 relative">
                <div className="size-9 rounded-full bg-primary text-primary-content font-bold flex items-center justify-center text-sm mb-4">
                  1
                </div>
                <h4 className="font-bold text-lg mb-2">Select Challenge</h4>
                <p className="text-sm text-base-content/70">
                  Choose any DSA challenge to initiate an interactive technical
                  interview session with the AI.
                </p>
              </div>

              <div className="card bg-base-100 border border-base-300 shadow-sm p-6 relative">
                <div className="size-9 rounded-full bg-secondary text-secondary-content font-bold flex items-center justify-center text-sm mb-4">
                  2
                </div>
                <h4 className="font-bold text-lg mb-2">Interactive Dialogue</h4>
                <p className="text-sm text-base-content/70">
                  The AI welcomes you, explains the problem, asks about your
                  approach, and offers progressive hints as needed.
                </p>
              </div>

              <div className="card bg-base-100 border border-base-300 shadow-sm p-6 relative">
                <div className="size-9 rounded-full bg-accent text-accent-content font-bold flex items-center justify-center text-sm mb-4">
                  3
                </div>
                <h4 className="font-bold text-lg mb-2">Code Analysis</h4>
                <p className="text-sm text-base-content/70">
                  Write your solution and click "Analyze Code" to audit Big-O
                  complexity and unhandled edge cases.
                </p>
              </div>

              <div className="card bg-base-100 border border-base-300 shadow-sm p-6 relative">
                <div className="size-9 rounded-full bg-success text-success-content font-bold flex items-center justify-center text-sm mb-4">
                  4
                </div>
                <h4 className="font-bold text-lg mb-2">Detailed Scorecard</h4>
                <p className="text-sm text-base-content/70">
                  Finish the interview to receive a full scorecard with ratings,
                  strengths, weaknesses, and concrete optimizations.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* PLATFORM SHOWCASE (REAL SCREENSHOTS GALLERY) */}
      <section
        className="max-w-7xl mx-auto px-6 py-20 lg:py-24"
        id="showcase"
      >
        <div className="text-center mb-10 space-y-3">
          <div className="inline-block px-3.5 py-1.5 bg-primary/10 border border-primary/20 rounded-full">
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">
              Interface Tour
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            See the Platform in Action
          </h2>
          <p className="text-base sm:text-lg text-base-content/70 max-w-xl mx-auto">
            Explore authentic screenshots of the code editor, video call
            interface, and interview dashboard.
          </p>

          {/* TAB BUTTONS */}
          <div className="flex flex-wrap justify-center gap-2 pt-4">
            <button
              onClick={() => setActivePreviewTab("session")}
              className={`btn btn-sm rounded-lg ${
                activePreviewTab === "session"
                  ? "btn-primary"
                  : "btn-outline border-base-300"
              }`}
            >
              <Code2 className="size-4" />
              <span>Session Workspace</span>
            </button>
            <button
              onClick={() => setActivePreviewTab("video")}
              className={`btn btn-sm rounded-lg ${
                activePreviewTab === "video"
                  ? "btn-primary"
                  : "btn-outline border-base-300"
              }`}
            >
              <Video className="size-4" />
              <span>Video Calling Room</span>
            </button>
            <button
              onClick={() => setActivePreviewTab("dashboard")}
              className={`btn btn-sm rounded-lg ${
                activePreviewTab === "dashboard"
                  ? "btn-primary"
                  : "btn-outline border-base-300"
              }`}
            >
              <LayoutDashboard className="size-4" />
              <span>Interview Dashboard</span>
            </button>
          </div>
        </div>

        {/* SCREENSHOT CONTAINER */}
        <div className="relative rounded-2xl border border-base-content/15 bg-base-100 shadow-2xl p-3 sm:p-4 max-w-5xl mx-auto overflow-hidden">
          {activePreviewTab === "session" && (
            <div className="space-y-3">
              <img
                src="/images/screenshots/session.png"
                alt="TalentROX Coding Session & Editor"
                className="w-full h-auto rounded-xl border border-base-300 shadow-inner"
              />
              <div className="p-3 bg-base-200/60 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs sm:text-sm">
                <div>
                  <span className="font-bold text-primary">
                    Session Workspace:
                  </span>{" "}
                  Monaco code editor, problem constraints, execution output, and
                  AI analysis panel in one unified view.
                </div>
                <span className="badge badge-primary badge-sm whitespace-nowrap">
                  Resizable Layout
                </span>
              </div>
            </div>
          )}

          {activePreviewTab === "video" && (
            <div className="space-y-3">
              <img
                src="/images/screenshots/video-call.png"
                alt="TalentROX Video Calling & Chat"
                className="w-full h-auto rounded-xl border border-base-300 shadow-inner"
              />
              <div className="p-3 bg-base-200/60 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs sm:text-sm">
                <div>
                  <span className="font-bold text-accent">
                    WebRTC Video Room:
                  </span>{" "}
                  Crystal clear peer streams, in-room messaging, and media controls
                  for audio, video, and disconnection.
                </div>
                <span className="badge badge-accent badge-sm whitespace-nowrap">
                  Stream Video SDK
                </span>
              </div>
            </div>
          )}

          {activePreviewTab === "dashboard" && (
            <div className="space-y-3">
              <img
                src="/images/screenshots/dashboard.png"
                alt="TalentROX User Dashboard"
                className="w-full h-auto rounded-xl border border-base-300 shadow-inner"
              />
              <div className="p-3 bg-base-200/60 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs sm:text-sm">
                <div>
                  <span className="font-bold text-secondary">
                    User Dashboard:
                  </span>{" "}
                  Overview of active rooms to join, completed session history, and
                  room creation modal.
                </div>
                <span className="badge badge-secondary badge-sm whitespace-nowrap">
                  Active & History
                </span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* PROBLEM BANK PREVIEW SECTION */}
      <section
        className="bg-base-200/60 border-y border-base-300 py-20 lg:py-24"
        id="problem-bank"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="space-y-3">
              <div className="inline-block px-3.5 py-1.5 bg-primary/10 border border-primary/20 rounded-full">
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                  Curated Bank
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Practice Popular DSA Questions
              </h2>
              <p className="text-base text-base-content/70 max-w-xl">
                Ready-to-use coding challenges with automated test cases,
                starter code in JavaScript, Python, and Java.
              </p>
            </div>

            <SignedIn>
              <Link
                to="/problems"
                className="btn btn-outline btn-primary btn-sm sm:btn-md gap-2 rounded-xl"
              >
                <span>View All Problems</span>
                <ArrowRight className="size-4" />
              </Link>
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="btn btn-outline btn-primary btn-sm sm:btn-md gap-2 rounded-xl">
                  <span>Sign In to Solve</span>
                  <ArrowRight className="size-4" />
                </button>
              </SignInButton>
            </SignedOut>
          </div>

          {/* PROBLEM CARDS GRID */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {problemList.map((problem) => {
              const isEasy = problem.difficulty?.toLowerCase() === "easy";
              return (
                <div
                  key={problem.id}
                  className="card bg-base-100 border border-base-300 hover:border-primary/50 transition-all p-5 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-base-content/50 uppercase tracking-wider">
                        {problem.category}
                      </span>
                      <span
                        className={`badge badge-sm font-semibold ${
                          isEasy ? "badge-success" : "badge-warning"
                        }`}
                      >
                        {problem.difficulty}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg text-base-content">
                      {problem.title}
                    </h3>
                    <p className="text-xs text-base-content/70 line-clamp-2">
                      {problem.description?.text}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-base-200 flex items-center justify-between">
                    <span className="text-xs text-base-content/50">
                      {Object.keys(problem.starterCode || {}).length} Languages
                    </span>

                    <SignedIn>
                      <Link
                        to={`/problem/${problem.id}`}
                        className="btn btn-ghost btn-xs text-primary gap-1"
                      >
                        <span>Solve</span>
                        <ArrowRight className="size-3" />
                      </Link>
                    </SignedIn>
                    <SignedOut>
                      <SignInButton mode="modal">
                        <button className="btn btn-ghost btn-xs text-primary gap-1">
                          <span>Practice</span>
                          <ArrowRight className="size-3" />
                        </button>
                      </SignInButton>
                    </SignedOut>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ SECTION (REPLACES FAKE PRICING) */}
      <section className="max-w-4xl mx-auto px-6 py-20 lg:py-24" id="faq">
        <div className="text-center mb-12 space-y-3">
          <div className="inline-block px-3.5 py-1.5 bg-primary/10 border border-primary/20 rounded-full">
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">
              Common Questions
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-base text-base-content/70">
            Clear answers about features, languages, and technical interview flows.
          </p>
        </div>

        <div className="space-y-4">
          <div className="collapse collapse-plus bg-base-100 border border-base-300 rounded-xl">
            <input type="radio" name="faq-accordion" defaultChecked />
            <div className="collapse-title text-base font-semibold">
              Is TalentROX free to use?
            </div>
            <div className="collapse-content text-sm text-base-content/70">
              Yes, TalentROX is completely free and open-source. There are no
              trial periods, hidden paywalls, or credit card requirements. Simply
              sign in with your account to access all features.
            </div>
          </div>

          <div className="collapse collapse-plus bg-base-100 border border-base-300 rounded-xl">
            <input type="radio" name="faq-accordion" />
            <div className="collapse-title text-base font-semibold">
              Which programming languages are supported?
            </div>
            <div className="collapse-content text-sm text-base-content/70">
              You can write and execute solutions in <strong>JavaScript</strong>,{" "}
              <strong>Python</strong>, and <strong>Java</strong>. Each problem
              comes with pre-configured starter code and runs securely via the
              JDoodle sandbox compiler API.
            </div>
          </div>

          <div className="collapse collapse-plus bg-base-100 border border-base-300 rounded-xl">
            <input type="radio" name="faq-accordion" />
            <div className="collapse-title text-base font-semibold">
              How does the AI Mock Interviewer work?
            </div>
            <div className="collapse-content text-sm text-base-content/70">
              The AI acts as your technical interviewer. It presents algorithmic
              questions, probes your methodology, gives progressive hints if you
              are stuck, and generates a structured 1-10 performance scorecard
              covering problem solving, code quality, and edge case handling.
            </div>
          </div>

          <div className="collapse collapse-plus bg-base-100 border border-base-300 rounded-xl">
            <input type="radio" name="faq-accordion" />
            <div className="collapse-title text-base font-semibold">
              What technology powers the live video calling?
            </div>
            <div className="collapse-content text-sm text-base-content/70">
              Video calls and chat are powered by the Stream Video & Chat React
              SDKs using WebRTC standards. This provides ultra-low latency,
              high-definition audio/video streams with built-in camera/mic toggling.
            </div>
          </div>

          <div className="collapse collapse-plus bg-base-100 border border-base-300 rounded-xl">
            <input type="radio" name="faq-accordion" />
            <div className="collapse-title text-base font-semibold">
              How does 1-on-1 peer interviewing work?
            </div>
            <div className="collapse-content text-sm text-base-content/70">
              A host creates a room specifying a DSA problem. A participant joins
              the room directly from the active sessions dashboard. Both users
              connect over Stream video and chat to conduct the interview while
              writing and testing code in the editor workspace.
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION (HONEST, NO FAKE TRIAL CLAIMS) */}
      <section
        className="bg-gradient-to-r from-primary/90 via-primary to-secondary text-primary-content py-20 px-6"
      >
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Ready to Level Up Your Coding Interviews?
          </h2>
          <p className="text-base sm:text-lg text-white/90 max-w-xl mx-auto leading-relaxed">
            Practice solo with the AI interviewer or host a live peer
            coding room. Sign in today and start building confidence.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <SignedIn>
              <Link
                to="/mock-interview"
                className="btn btn-lg bg-white text-neutral hover:bg-base-100 border-0 shadow-xl gap-2 hover:scale-105 transition-all rounded-xl"
              >
                <Bot className="size-5 text-primary" />
                <span>Start AI Mock Interview</span>
                <ArrowRight className="size-4" />
              </Link>
            </SignedIn>

            <SignedOut>
              <SignInButton mode="modal">
                <button className="btn btn-lg bg-white text-neutral hover:bg-base-100 border-0 shadow-xl gap-2 hover:scale-105 transition-all rounded-xl">
                  <Zap className="size-5 text-primary" />
                  <span>Start Free Practice</span>
                  <ArrowRight className="size-4" />
                </button>
              </SignInButton>
            </SignedOut>
          </div>

          <p className="text-xs text-white/80 font-medium">
            100% Free • Open Source • Instant Setup
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-base-100 border-t border-base-300 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
              <Sparkles className="size-5" />
            </div>
            <div>
              <span className="font-bold text-base">TalentROX</span>
              <p className="text-xs text-base-content/60">
                Collaborative Video Calling & AI Technical Interview Platform
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-sm text-base-content/75 font-medium">
            <Link to="/problems" className="hover:text-primary transition-colors">
              Problems
            </Link>
            <Link
              to="/mock-interview"
              className="hover:text-primary transition-colors"
            >
              AI Mock Interview
            </Link>
            <Link
              to="/dashboard"
              className="hover:text-primary transition-colors"
            >
              Dashboard
            </Link>
            <a
              href="https://github.com/shahnawaz-codes/Video-Calling-Interview-Platform"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-primary transition-colors"
            >
              <span>GitHub</span>
              <ExternalLink className="size-3.5" />
            </a>
          </div>

          <p className="text-xs text-base-content/50">
            © {new Date().getFullYear()} TalentROX. Built with React & DaisyUI.
          </p>
        </div>
      </footer>

      {/* PLATFORM TOUR / DEMO MODAL */}
      {isDemoModalOpen && (
        <dialog className="modal modal-open backdrop-blur-sm z-50">
          <div className="modal-box max-w-3xl bg-base-100 border border-base-300 p-6 sm:p-8 rounded-2xl shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-base-300">
              <div className="flex items-center gap-2.5">
                <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <PlayCircle className="size-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">TalentROX Platform Tour</h3>
                  <p className="text-xs text-base-content/60">
                    A quick overview of what you can do on TalentROX
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsDemoModalOpen(false)}
                className="btn btn-sm btn-ghost btn-circle"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="py-6 space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-base-200/70 border border-base-300 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-sm text-primary">
                    <Video className="size-4" />
                    <span>1-on-1 Peer Video Calling</span>
                  </div>
                  <p className="text-xs text-base-content/75 leading-relaxed">
                    Create a private room for any LeetCode-style problem. A peer
                    joins through the dashboard, connecting both of you over
                    WebRTC video and chat while coding together in Monaco.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-base-200/70 border border-base-300 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-sm text-secondary">
                    <Bot className="size-4" />
                    <span>AI Mock Interviews</span>
                  </div>
                  <p className="text-xs text-base-content/75 leading-relaxed">
                    Practice on your own schedule. The AI presents questions,
                    evaluates your thought process, provides adaptive hints, and
                    generates a comprehensive 1-10 scorecard.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-base-200/70 border border-base-300 space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm text-accent">
                  <Terminal className="size-4" />
                  <span>Sandboxed Execution in JS, Python & Java</span>
                </div>
                <p className="text-xs text-base-content/75 leading-relaxed">
                  Run solutions directly against test cases using the JDoodle
                  compiler. Instant test results and visual feedback show you
                  whether your algorithm works properly before submitting.
                </p>
              </div>

              <div className="rounded-xl overflow-hidden border border-base-300 shadow-sm">
                <img
                  src="/images/screenshots/session.png"
                  alt="Session workspace preview"
                  className="w-full h-auto"
                />
              </div>
            </div>

            <div className="modal-action border-t border-base-300 pt-4 flex justify-between items-center">
              <span className="text-xs text-base-content/60">
                Ready to get started?
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsDemoModalOpen(false)}
                  className="btn btn-sm btn-ghost"
                >
                  Close
                </button>
                <SignedIn>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsDemoModalOpen(false)}
                    className="btn btn-sm btn-primary gap-1"
                  >
                    <span>Go to Dashboard</span>
                    <ArrowRight className="size-3.5" />
                  </Link>
                </SignedIn>
                <SignedOut>
                  <SignInButton mode="modal">
                    <button
                      onClick={() => setIsDemoModalOpen(false)}
                      className="btn btn-sm btn-primary gap-1"
                    >
                      <span>Sign In & Practice</span>
                      <ArrowRight className="size-3.5" />
                    </button>
                  </SignInButton>
                </SignedOut>
              </div>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => setIsDemoModalOpen(false)}>close</button>
          </form>
        </dialog>
      )}
    </div>
  );
}

export default Home;
