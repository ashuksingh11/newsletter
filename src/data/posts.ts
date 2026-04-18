// This file reads blog posts from Markdown files in /content/posts/.
// Previously we hardcoded posts as objects — now they live as .md files,
// which is how real blogs work.

import fs from "fs";
import path from "path";
import matter from "gray-matter";

// The type stays the same — we just changed WHERE the data comes from.
export type Post = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  content: string; // Now this is raw Markdown text
};

// Path to the folder where Markdown files live.
// process.cwd() returns the project root directory.
const postsDirectory = path.join(process.cwd(), "content/posts");

// Read all posts from the filesystem.
// This function:
//   1. Lists all .md files in content/posts/
//   2. Reads each file
//   3. Parses the frontmatter (title, date, summary) and content
//   4. Returns them sorted by date (newest first)
export function getAllPosts(): Post[] {
  // fs.readdirSync reads all filenames in a directory.
  // .filter() keeps only files ending in ".md".
  const filenames = fs.readdirSync(postsDirectory).filter((f) => f.endsWith(".md"));

  const posts = filenames.map((filename) => {
    // Remove ".md" to get the slug: "my-post.md" → "my-post"
    const slug = filename.replace(/\.md$/, "");

    // Read the file's raw text content
    const filePath = path.join(postsDirectory, filename);
    const fileContent = fs.readFileSync(filePath, "utf-8");

    // gray-matter splits the file into:
    //   data = the frontmatter object { title, date, summary }
    //   content = everything below the frontmatter
    const { data, content } = matter(fileContent);

    return {
      slug,
      title: data.title,
      date: data.date,
      summary: data.summary,
      content,
    };
  });

  // Sort by date, newest first.
  // localeCompare compares strings — for dates in "YYYY-MM-DD" format,
  // alphabetical order happens to match chronological order.
  return posts.sort((a, b) => b.date.localeCompare(a.date));
}

// Find a single post by slug.
export function getPostBySlug(slug: string): Post | undefined {
  return getAllPosts().find((post) => post.slug === slug);
}
