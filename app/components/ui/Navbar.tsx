import { Link } from "@remix-run/react";
import { Button } from "./button";
import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";

export default function Navbar() {
  const isLoggedIn = false; // Replace with auth logic later
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") as
      | "light"
      | "dark"
      | null;
    if (storedTheme) {
      setTheme(storedTheme);
      document.documentElement.classList.toggle("dark", storedTheme === "dark");
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
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

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full"
            title={
              theme === "light" ? "Switch to dark mode" : "Switch to light mode"
            }
          >
            {theme === "light" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>

          {isLoggedIn ? (
            <>
              <Link
                to="/dashboard"
                className="text-sm font-medium text-gray-700 hover:text-red-600 dark:text-gray-300 dark:hover:text-orange-400"
              >
                Dashboard
              </Link>
              <Button variant="outline">Logout</Button>
            </>
          ) : (
            <Button
              asChild
              className="bg-red-600 hover:bg-red-700 dark:bg-orange-500 dark:hover:bg-orange-600"
            >
              <Link to="/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
