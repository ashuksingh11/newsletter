// A reusable Header component.
// By putting it in its own file, any page or layout can import and use it.

export default function Header() {
  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto max-w-3xl px-6 py-4 flex items-center justify-between">
        <a href="/" className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
          The Newsletter
        </a>
        <nav className="flex gap-6 text-sm text-zinc-600 dark:text-zinc-400">
          <a href="/" className="hover:text-zinc-900 dark:hover:text-zinc-100">
            Home
          </a>
          <a href="/blog" className="hover:text-zinc-900 dark:hover:text-zinc-100">
            Blog
          </a>
          <a href="/about" className="hover:text-zinc-900 dark:hover:text-zinc-100">
            About
          </a>
        </nav>
      </div>
    </header>
  );
}
