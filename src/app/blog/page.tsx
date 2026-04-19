// This page renders at /blog — it lists all blog posts.

// "import" pulls in data and types from our posts file.
// We import the array of posts AND the Post type.
import { getAllPosts } from "@/data/posts";
import Link from "next/link";

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
        Blog
      </h1>
      <p className="mt-2 text-zinc-500 dark:text-zinc-400">
        Thoughts on web development, TypeScript, and building in public.
      </p>

      {/*
        .map() is a JavaScript array method. It loops through each post
        and returns a new array of JSX elements — one per post.
        Think of it as a "for each post, render this block."
      */}
      <div className="mt-10 space-y-10">
        {getAllPosts().map((post) => (
          // "key" is required by React when rendering lists.
          // It helps React track which items changed, were added, or removed.
          <article key={post.slug}>
            {/* The date in a muted color above the title */}
            <time className="text-sm text-zinc-500 dark:text-zinc-400">
              {post.date}
            </time>
            {/* Link to the individual post page */}
            <h2 className="mt-1 text-xl font-semibold">
              <Link
                href={`/blog/${post.slug}`}
                className="text-zinc-900 hover:underline dark:text-zinc-100"
              >
                {post.title}
              </Link>
            </h2>
            {/* Post summary */}
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              {post.summary}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
