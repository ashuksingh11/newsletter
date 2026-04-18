import { getAllPosts } from "@/data/posts";
import SubscribeForm from "@/components/subscribe-form";

// This is the homepage component — it renders when someone visits "/"
// The header and footer are now in layout.tsx, so this only has page content.
export default function Home() {
  return (
    <>
      {/* Hero section — the big intro at the top */}
      <section className="mx-auto max-w-3xl px-6 py-24">
        <h2 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Ideas worth sharing.
        </h2>
        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400 max-w-xl">
          A blog about web development, design, and technology.
          Subscribe to get new posts delivered to your inbox.
        </p>

        {/* SubscribeForm is a Client Component — it handles interactivity.
            The rest of this page stays as a Server Component. */}
        <div className="mt-8">
          <SubscribeForm />
        </div>
      </section>

      {/* Recent posts section */}
      <section className="mx-auto max-w-3xl px-6 pb-24">
        <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Recent Posts
        </h3>
        <div className="mt-6 space-y-8">
          {getAllPosts().map((post) => (
            <article key={post.slug}>
              <time className="text-sm text-zinc-500 dark:text-zinc-400">
                {post.date}
              </time>
              <h4 className="mt-1 text-lg font-semibold">
                <a
                  href={`/blog/${post.slug}`}
                  className="text-zinc-900 hover:underline dark:text-zinc-100"
                >
                  {post.title}
                </a>
              </h4>
              <p className="mt-1 text-zinc-600 dark:text-zinc-400">
                {post.summary}
              </p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
