// This page renders at /about.
// It's a simple static page — no data fetching, no interactivity.

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
        About
      </h1>

      <div className="mt-8 space-y-4 text-zinc-700 dark:text-zinc-300 leading-7">
        <p>
          Welcome to <strong className="text-zinc-900 dark:text-zinc-100">The Newsletter</strong> — a blog
          about web development, design, and technology.
        </p>
        <p>
          This platform is built with Next.js, TypeScript, and Tailwind CSS.
          It started as a learning project and grew into something worth sharing.
        </p>
        <p>
          Every post is written in Markdown and rendered with care. The newsletter
          is powered by a simple API that collects subscribers and delivers new
          content straight to your inbox.
        </p>

        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mt-10">
          The Stack
        </h2>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong className="text-zinc-900 dark:text-zinc-100">Framework:</strong> Next.js (App Router)</li>
          <li><strong className="text-zinc-900 dark:text-zinc-100">Language:</strong> TypeScript</li>
          <li><strong className="text-zinc-900 dark:text-zinc-100">Styling:</strong> Tailwind CSS</li>
          <li><strong className="text-zinc-900 dark:text-zinc-100">Content:</strong> Markdown with gray-matter</li>
          <li><strong className="text-zinc-900 dark:text-zinc-100">Built with:</strong> Claude Code</li>
        </ul>
      </div>
    </div>
  );
}
