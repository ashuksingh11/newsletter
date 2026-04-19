// "use client" is needed because this component uses useTheme(),
// which relies on useState and useContext (browser-only features).
"use client";

// Link is Next.js's replacement for <a> tags.
// It does client-side navigation — no full page reload.
import Link from "next/link";
import { useTheme } from "@/components/theme-provider";

export default function Header() {
  // Pull the current theme and toggle function from our context.
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto max-w-3xl px-6 py-4 flex items-center justify-between">
        {/* Link works just like <a> but does instant client-side navigation */}
        <Link href="/" className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
          The Newsletter
        </Link>
        <div className="flex items-center gap-6">
          <nav className="flex gap-6 text-sm text-zinc-600 dark:text-zinc-400">
            <Link href="/" className="hover:text-zinc-900 dark:hover:text-zinc-100">
              Home
            </Link>
            <Link href="/blog" className="hover:text-zinc-900 dark:hover:text-zinc-100">
              Blog
            </Link>
            <Link href="/about" className="hover:text-zinc-900 dark:hover:text-zinc-100">
              About
            </Link>
          </nav>
          {/* Dark mode toggle button */}
          <button
            onClick={toggleTheme}
            className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 text-sm"
            aria-label="Toggle dark mode"
          >
            {/* Show sun icon in dark mode, moon in light mode */}
            {theme === "dark" ? "Light" : "Dark"}
          </button>
        </div>
      </div>
    </header>
  );
}
