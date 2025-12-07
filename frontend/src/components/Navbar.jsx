import { Link, useLocation } from "react-router";
import { BookOpen, LayoutDashboard, Sparkles, Menu, X } from "lucide-react";
import { UserButton } from "@clerk/clerk-react";
import { useState, useEffect } from "react";

function Navbar() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  const isActive = (path) => location.pathname === path;
  
  return (
    <>
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
          to="/"
          className="group flex items-center gap-3 hover:opacity-80 transition-all duration-200"
        >
          <div className={`rounded-xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center transition-all duration-300 ${
            scrolled ? "size-11 shadow-[0_0_20px_rgba(var(--p),0.5)]" : "size-12 shadow-lg"
          }`}>
            <Sparkles className={`text-primary-content transition-all duration-300 ${
              scrolled ? "size-6" : "size-7"
            }`} />
          </div>
          <div className="flex flex-col">
            <span className={`font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent transition-all duration-300 ${
              scrolled ? "text-xl" : "text-2xl"
            }`}>
              TalentROX
            </span>
            <span className={`text-base-content/60 font-medium -mt-1 transition-all duration-300 ${
              scrolled ? "text-xs" : "text-sm"
            }`}>
              Code Together
            </span>
          </div>
        </Link>
        
        {/* DESKTOP NAVIGATION */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to={"/problems"}
            className={`px-5 py-2.5 rounded-full font-medium transition-all duration-200 relative group ${
              isActive("/problems")
                ? "bg-primary text-primary-content shadow-[0_0_15px_rgba(var(--p),0.4)]"
                : "text-base-content/70 hover:text-base-content hover:bg-base-200/50"
            }`}
          >
            <div className="flex items-center gap-2">
              <BookOpen className="size-4" />
              <span>Problems</span>
            </div>
            {!isActive("/problems") && (
              <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-[calc(100%-2rem)]"></span>
            )}
          </Link>
          
          <Link
            to={"/dashboard"}
            className={`px-5 py-2.5 rounded-full font-medium transition-all duration-200 relative group ${
              isActive("/dashboard")
                ? "bg-primary text-primary-content shadow-[0_0_15px_rgba(var(--p),0.4)]"
                : "text-base-content/70 hover:text-base-content hover:bg-base-200/50"
            }`}
          >
            <div className="flex items-center gap-2">
              <LayoutDashboard className="size-4" />
              <span>Dashboard</span>
            </div>
            {!isActive("/dashboard") && (
              <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-[calc(100%-2rem)]"></span>
            )}
          </Link>
          
          <div className="ml-2 flex items-center">
            <UserButton />
          </div>
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
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-6xl rounded-3xl shadow-xl p-6 md:hidden backdrop-blur-md bg-base-100/95 animate-slideDown">
          <ul className="flex flex-col gap-4">
            <Link to="/problems" onClick={() => setIsMobileMenuOpen(false)}>
              <li className={`cursor-pointer hover:translate-x-2 transition-all duration-300 py-3 border-b border-base-content/10 ${
                isActive("/problems") ? "text-primary font-semibold" : "text-base-content"
              }`}>
                <div className="flex items-center gap-3">
                  <BookOpen className="size-5" />
                  <span>Problems</span>
                </div>
              </li>
            </Link>

            <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
              <li className={`cursor-pointer hover:translate-x-2 transition-all duration-300 py-3 border-b border-base-content/10 ${
                isActive("/dashboard") ? "text-primary font-semibold" : "text-base-content"
              }`}>
                <div className="flex items-center gap-3">
                  <LayoutDashboard className="size-5" />
                  <span>Dashboard</span>
                </div>
              </li>
            </Link>

            <li className="mt-4 flex justify-center">
              <UserButton />
            </li>
          </ul>
        </div>
      )}
    </>
  );
}

export default Navbar;