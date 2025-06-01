import { Link } from "@remix-run/react";
import { Button } from "./button";
import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { useAuth } from "~/hooks/useAuth";

export default function Navbar() {
  const { user, signOut, loading } = useAuth();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") as
      | "light"
      | "dark"
      | null;
    if (storedTheme) {
      setIsDark(storedTheme === "dark");
      document.documentElement.classList.toggle("dark", storedTheme === "dark");
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = isDark ? "light" : "dark";
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

  const handleSignOut = async () => {
    try {
      await signOut(); // Don't add extra toast here - signOut function handles it
    } catch (error) {
      console.error("Sign out error:", error);
      // Only show toast for unexpected errors
    }
  };

  return (
    <nav
      className="fixed z-50 w-9/12 left-1/2 -translate-x-1/2 mt-3 rounded-lg
      bg-gradient-to-b from-white/10 to-transparent dark:from-[#0f0f0f]/20
      backdrop-blur-lg shadow-md border border-transparent dark:border-orange-900/20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="text-xl font-bold text-red-600 dark:text-orange-400"
        >
          FormBuilder
        </Link>

        {/* Nav Items */}
        <div className="flex items-center space-x-4">
          <Link
            to="/builder"
            className="text-sm font-medium text-gray-700 hover:text-red-600 dark:text-gray-300 dark:hover:text-orange-400"
          >
            Create Form
          </Link>

          {/* Auth Section */}
          {loading ? (
            <div className="w-8 h-8 animate-pulse bg-gray-300 rounded"></div>
          ) : user ? (
            <div className="flex items-center gap-3">
              <Link
                to="/my-forms"
                className="text-sm font-medium text-gray-700 hover:text-red-600 dark:text-gray-300 dark:hover:text-orange-400"
              >
                My Forms
              </Link>
              <Button
                onClick={handleSignOut}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <Link
              to="/auth"
              className="text-sm bg-red-600 dark:bg-orange-500 text-white px-3 py-1.5 rounded hover:bg-red-700 dark:hover:bg-orange-600 transition-colors"
            >
              Sign In
            </Link>
          )}

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="p-2"
          >
            {isDark ? (
              <Sun className="h-4 w-4 text-orange-400" />
            ) : (
              <Moon className="h-4 w-4 text-gray-700" />
            )}
          </Button>
        </div>
      </div>
    </nav>
  );
}
