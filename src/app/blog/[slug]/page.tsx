// This page renders at /blog/[slug] — it shows a single blog post.

import { getPostBySlug, getAllPosts } from "@/data/posts";
import { notFound } from "next/navigation";
import Markdown from "react-markdown";
import Link from "next/link";

type Props = {
  params: Promise<{ slug: string }>;
};

// Tell Next.js which slugs exist so it can pre-render them.
export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;

  const post = getPostBySlug(slug);
  if (!post) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Link
        href="/blog"
        className="text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
      >
        ← Back to blog
      </Link>

      <article className="mt-8">
        <time className="text-sm text-zinc-500 dark:text-zinc-400">
          {post.date}
        </time>
        <h1 className="mt-2 text-3xl font-bold text-zinc-900 dark:text-zinc-100">
          {post.title}
        </h1>

        {/*
          Markdown component converts raw Markdown text into React elements.

          "components" prop lets us customize how each Markdown element renders.
          Without this, headings/paragraphs/lists would have no styling because
          Tailwind strips default browser styles.

          This pattern is called "component mapping" — you tell the Markdown
          renderer: "when you see an <h2>, render it with THESE classes instead."
        */}
        <div className="mt-8">
          <Markdown
            components={{
              h2: ({ children }) => (
                <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mt-10 mb-4">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mt-8 mb-3">
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="text-zinc-700 dark:text-zinc-300 leading-7 mb-4">
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc pl-6 text-zinc-700 dark:text-zinc-300 leading-7 mb-4 space-y-1">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal pl-6 text-zinc-700 dark:text-zinc-300 leading-7 mb-4 space-y-1">
                  {children}
                </ol>
              ),
              strong: ({ children }) => (
                <strong className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {children}
                </strong>
              ),
              code: ({ children, className }) => {
                // className is set by react-markdown for fenced code blocks
                // (e.g., ```typescript), but not for inline `code`.
                const isCodeBlock = className?.startsWith("language-");
                if (isCodeBlock) {
                  return (
                    <code className="block bg-zinc-100 dark:bg-zinc-800 rounded-lg p-4 text-sm overflow-x-auto mb-4">
                      {children}
                    </code>
                  );
                }
                return (
                  <code className="bg-zinc-100 dark:bg-zinc-800 rounded px-1.5 py-0.5 text-sm">
                    {children}
                  </code>
                );
              },
              pre: ({ children }) => (
                // pre wraps code blocks — we keep it minimal since
                // we handle styling on the <code> element above
                <pre className="mb-4">{children}</pre>
              ),
            }}
          >
            {post.content}
          </Markdown>
        </div>
      </article>
    </div>
  );
}
