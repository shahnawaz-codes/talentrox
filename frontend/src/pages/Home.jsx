import { Link } from "react-router";
import { useState, useEffect, useRef } from "react";
import {
  ArrowRight,
  Code2,
  Sparkles,
  Users,
  Video,
  Zap,
  ShieldCheck,
  Clock,
  Award,
  TrendingUp,
  PlayCircle,
  Star,
  Menu,
  X,
} from "lucide-react";
import {
  ClerkLoaded,
  ClerkLoading,
  SignInButton,
  SignedIn,
  SignedOut,
} from "@clerk/clerk-react";
import Navbar from "../components/Navbar";

// Counter animation hook
function useCountAnimation(end, duration = 2000, startCounting) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!startCounting) return;

    let startTime;
    let animationFrame;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      setCount(Math.floor(progress * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, startCounting]);

  return count;
}
// Intersection Observer hook for scroll animations
function useInView(options = {}) {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.1, ...options }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return [ref, isInView];
}

function Home() {
  const [statsRef, statsInView] = useInView();
  const [featuresRef, featuresInView] = useInView();
  const [ctaRef, ctaInView] = useInView();
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const activeUsers = useCountAnimation(10, 2000, statsInView);
  const interviews = useCountAnimation(50, 2000, statsInView);
  const uptime = useCountAnimation(99.9, 2000, statsInView);
  const rating = useCountAnimation(4.9, 2000, statsInView);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-base-100 to-base-200">
      <ClerkLoading>
        {/* Skeleton / placeholder navbar */}
        <div className="h-16 w-full bg-base-100 animate-pulse fixed top-0 z-50" />
      </ClerkLoading>
      {/* when user is unauthenticated then show this */}
      <ClerkLoaded>
        <SignedOut>
          {/*NAVBAR */}
          <nav
            className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 rounded-full
        px-6 py-3 w-[95%] max-w-7xl
        flex justify-between items-center
        transition-all duration-300 ease-in-out
        backdrop-blur-md
        ${
          scrolled
            ? "bg-base-100/95 shadow-[0_8px_32px_rgba(0,0,0,0.12)] scale-[0.97] border border-primary/30"
            : "scale-100 bg-base-100/40 border border-base-content/10"
        }`}
          >
            {/* LOGO */}
            <Link
              to={"/"}
              className="flex items-center gap-3 group hover:opacity-80 transition-all duration-200"
            >
              <div className="relative">
                <div
                  className={`rounded-xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center transition-all duration-300 ${
                    scrolled
                      ? "size-11 shadow-[0_0_20px_rgba(var(--p),0.5)]"
                      : "size-12 shadow-lg"
                  }`}
                >
                  <Sparkles
                    className={`text-primary-content transition-all duration-300 ${
                      scrolled ? "size-6" : "size-7"
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
                  Interview Platform
                </span>
              </div>
            </Link>

            {/* DESKTOP NAVIGATION LINKS */}
            <div className="hidden md:flex items-center gap-6">
              <a
                href="#features"
                className="text-sm font-medium text-base-content/70 hover:text-primary transition-all duration-200 relative group"
              >
                Features
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a
                href="#how-it-works"
                className="text-sm font-medium text-base-content/70 hover:text-primary transition-all duration-200 relative group"
              >
                How It Works
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a
                href="#pricing"
                className="text-sm font-medium text-base-content/70 hover:text-primary transition-all duration-200 relative group"
              >
                Pricing
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </a>
            </div>

            {/* AUTH BUTTON - DESKTOP */}
            <div className="hidden md:block">
              <SignInButton mode="modal">
                <button className="btn btn-primary btn-md gap-2 shadow-[0_0_15px_rgba(var(--p),0.3)] hover:shadow-[0_0_25px_rgba(var(--p),0.5)] transition-all hover:scale-105 rounded-full">
                  <span>Get Started</span>
                  <ArrowRight className="size-4" />
                </button>
              </SignInButton>
            </div>

            {/* MOBILE MENU BUTTON */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-base-content hover:text-primary transition-colors duration-300"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </nav>
          {/* MOBILE MENU */}
          {isMobileMenuOpen && (
            <div className="fixed top-20 left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-6xl rounded-3xl shadow-xl p-6 md:hidden backdrop-blur-md bg-base-100/95 animate-in slide-in-from-top duration-300 border border-primary/20">
              <ul className="flex flex-col gap-4">
                <a href="#features" onClick={() => setIsMobileMenuOpen(false)}>
                  <li className="cursor-pointer hover:translate-x-2 transition-all duration-300 py-3 border-b border-base-content/10 text-base-content hover:text-primary">
                    Features
                  </li>
                </a>
                <a
                  href="#how-it-works"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <li className="cursor-pointer hover:translate-x-2 transition-all duration-300 py-3 border-b border-base-content/10 text-base-content hover:text-primary">
                    How It Works
                  </li>
                </a>
                <a href="#pricing" onClick={() => setIsMobileMenuOpen(false)}>
                  <li className="cursor-pointer hover:translate-x-2 transition-all duration-300 py-3 border-b border-base-content/10 text-base-content hover:text-primary">
                    Pricing
                  </li>
                </a>
                <li className="mt-4">
                  <SignInButton mode="modal">
                    <button className="btn btn-primary w-full gap-2 shadow-md rounded-full">
                      Get Started
                      <ArrowRight className="size-4" />
                    </button>
                  </SignInButton>
                </li>
              </ul>
            </div>
          )}
        </SignedOut>
      </ClerkLoaded>

      {/* ENHANCED HERO SECTION */}
      <div className="max-w-7xl mx-auto px-6 py-24 lg:py-32 mt-20" >
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* LEFT CONTENT */}
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* BADGE */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full animate-in zoom-in duration-500">
              <div className="size-2 bg-primary rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-primary">
                Trusted by 10,000+ professionals
              </span>
            </div>

            {/* HEADING */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-base-content">
                Ace Your Technical
                <span className="block text-primary mt-2 animate-in slide-in-from-left duration-700 delay-100">
                  Interviews Together
                </span>
              </h1>

              <p className="text-lg text-base-content/70 leading-relaxed max-w-xl animate-in fade-in duration-700 delay-200">
                Experience seamless coding interviews with real-time
                collaboration, HD video calls, and an advanced code editor.
                Everything you need to succeed in one platform.
              </p>
            </div>

            {/* CTA BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in duration-700 delay-300">
              <SignInButton mode="modal">
                <button className="btn btn-primary btn-lg gap-2 shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                  <Zap className="size-5" />
                  Start Free Trial
                </button>
              </SignInButton>

              <button className="btn btn-outline btn-lg gap-2 hover:scale-105 transition-all">
                <PlayCircle className="size-5" />
                Watch Demo
              </button>
            </div>

            {/* TRUST INDICATORS */}
            <div className="flex flex-wrap items-center gap-6 pt-4 animate-in fade-in duration-700 delay-500">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  <div className="size-8 rounded-full bg-primary/20 border-2 border-base-100 flex items-center justify-center">
                    <span className="text-xs font-bold text-primary">A</span>
                  </div>
                  <div className="size-8 rounded-full bg-secondary/20 border-2 border-base-100 flex items-center justify-center">
                    <span className="text-xs font-bold text-secondary">B</span>
                  </div>
                  <div className="size-8 rounded-full bg-accent/20 border-2 border-base-100 flex items-center justify-center">
                    <span className="text-xs font-bold text-accent">C</span>
                  </div>
                </div>
                <span className="text-sm text-base-content/60">
                  Join 10K+ users
                </span>
              </div>

              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="size-4 fill-warning text-warning" />
                ))}
                <span className="text-sm text-base-content/60 ml-2">
                  4.9/5 rating
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT IMAGE/MOCKUP */}
          <div className="relative animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur-3xl opacity-50 animate-pulse"></div>
            <div className="relative bg-base-100 rounded-2xl shadow-2xl border border-base-300 p-6 hover:scale-105 transition-transform duration-500">
              <img
                src="/images/hero.png"
                alt="TalentROX Platform Interface"
                className="w-full h-auto rounded-xl"
              />
              {/* Floating elements */}
              <div className="absolute -top-4 -left-4 bg-success text-success-content px-4 py-2 rounded-lg shadow-lg text-sm font-semibold animate-bounce">
                ✓ Live Interview
              </div>
              <div className="absolute -bottom-4 -right-4 bg-primary text-primary-content px-4 py-2 rounded-lg shadow-lg text-sm font-semibold flex items-center gap-2 animate-bounce [animation-delay:500ms]">
                <Users className="size-4" />2 Active Users
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ANIMATED STATS SECTION */}
      <div ref={statsRef} className="bg-base-100 border-y border-base-300">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div
              className={`text-center transition-all duration-700 ${
                statsInView
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">
                {activeUsers}K+
              </div>
              <div className="text-sm text-base-content/60">Active Users</div>
            </div>
            <div
              className={`text-center transition-all duration-700 delay-100 ${
                statsInView
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <div className="text-3xl lg:text-4xl font-bold text-secondary mb-2">
                {interviews}K+
              </div>
              <div className="text-sm text-base-content/60">
                Interviews Completed
              </div>
            </div>
            <div
              className={`text-center transition-all duration-700 delay-200 ${
                statsInView
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <div className="text-3xl lg:text-4xl font-bold text-accent mb-2">
                {uptime.toFixed(1)}%
              </div>
              <div className="text-sm text-base-content/60">Uptime SLA</div>
            </div>
            <div
              className={`text-center transition-all duration-700 delay-300 ${
                statsInView
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <div className="text-3xl lg:text-4xl font-bold text-success mb-2">
                {rating.toFixed(1)}★
              </div>
              <div className="text-sm text-base-content/60">User Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* FEATURES SECTION */}
      <div
        ref={featuresRef}
        className="max-w-7xl mx-auto px-6 py-20"
        id="features"
      >
        <div
          className={`text-center mb-16 transition-all duration-700 ${
            featuresInView
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <div className="inline-block px-4 py-2 bg-primary/10 rounded-full mb-4">
            <span className="text-sm font-semibold text-primary">Features</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-base-content">
            Everything You Need to Excel
          </h2>
          <p className="text-lg text-base-content/60 max-w-2xl mx-auto">
            Powerful tools designed to make technical interviews seamless and
            productive
          </p>
        </div>

        {/* FEATURES GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: Video,
              color: "primary",
              title: "HD Video Calling",
              desc: "Crystal clear video and audio quality with zero lag for seamless face-to-face interviews",
              badges: ["WebRTC", "1080p"],
              delay: 0,
            },
            {
              icon: Code2,
              color: "secondary",
              title: "Live Code Editor",
              desc: "Real-time collaborative editing with syntax highlighting for 50+ programming languages",
              badges: ["50+ Languages", "Auto-save"],
              delay: 100,
            },
            {
              icon: Users,
              color: "accent",
              title: "Real-Time Collaboration",
              desc: "Work together seamlessly with instant sync, cursor tracking, and live feedback",
              badges: ["Instant Sync", "Multi-user"],
              delay: 200,
            },
            {
              icon: ShieldCheck,
              color: "success",
              title: "Secure & Private",
              desc: "Enterprise-grade security with end-to-end encryption and secure data handling",
              badges: ["Encrypted", "GDPR"],
              delay: 300,
            },
            {
              icon: Clock,
              color: "warning",
              title: "Session Recording",
              desc: "Record and playback interviews for review and feedback with timestamp controls",
              badges: ["Auto-record", "Playback"],
              delay: 400,
            },
            {
              icon: TrendingUp,
              color: "info",
              title: "Analytics Dashboard",
              desc: "Track performance metrics, interview history, and improvement areas",
              badges: ["Metrics", "Reports"],
              delay: 500,
            },
          ].map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className={`card bg-base-100 border border-base-300 hover:border-primary hover:shadow-xl hover:scale-105 transition-all duration-500 ${
                  featuresInView
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${feature.delay}ms` }}
              >
                <div className="card-body">
                  <div
                    className={`size-12 bg-gradient-to-br from-${feature.color}/20 to-${feature.color}/10 rounded-xl flex items-center justify-center mb-4`}
                  >
                    <Icon className={`size-6 text-${feature.color}`} />
                  </div>
                  <h3 className="card-title text-lg">{feature.title}</h3>
                  <p className="text-base-content/60 text-sm">{feature.desc}</p>
                  <div className="card-actions mt-4">
                    {feature.badges.map((badge, i) => (
                      <div
                        key={i}
                        className={`badge badge-${feature.color} badge-sm badge-outline`}
                      >
                        {badge}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA SECTION */}
      <div
        ref={ctaRef}
        className={`bg-gradient-to-r from-primary to-secondary transition-all duration-700 ${
          ctaInView ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Interview Experience?
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who trust TalentROX for their
            technical interviews
          </p>
          <SignInButton mode="modal">
            <button className="btn btn-lg bg-white text-primary hover:bg-base-100 border-0 shadow-xl gap-2 hover:scale-110 transition-all">
              <Award className="size-5" />
              Start Your Free Trial
              <ArrowRight className="size-5" />
            </button>
          </SignInButton>
          <p className="text-white/80 text-sm mt-4">
            No credit card required • 14-day free trial
          </p>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-base-100 border-t border-base-300">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-base-content/60">
              © 2024 TalentROX. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a
                href="#"
                className="text-sm text-base-content/60 hover:text-primary transition-colors"
              >
                Privacy
              </a>
              <a
                href="#"
                className="text-sm text-base-content/60 hover:text-primary transition-colors"
              >
                Terms
              </a>
              <a
                href="#"
                className="text-sm text-base-content/60 hover:text-primary transition-colors"
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
