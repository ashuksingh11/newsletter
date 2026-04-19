"use client";

// Admin dashboard — shows subscriber list and count.
// Protected by a simple key input (not real auth, just for learning).

import { useState } from "react";

// TypeScript type for a subscriber record from the database.
// This matches the shape Prisma returns.
type Subscriber = {
  id: number;
  email: string;
  createdAt: string;
};

export default function AdminPage() {
  const [key, setKey] = useState("");
  const [isAuthed, setIsAuthed] = useState(false);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // State for the newsletter compose form
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState("");

  // Fetch subscribers from the admin API.
  // This is extracted as a named function so we can call it
  // both on login and when we want to refresh the list.
  async function fetchSubscribers(adminKey: string) {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/subscribers", {
        headers: { authorization: adminKey },
      });

      if (!response.ok) {
        setError("Invalid admin key.");
        setIsAuthed(false);
        setLoading(false);
        return;
      }

      const data = await response.json();
      setSubscribers(data.subscribers);
      setTotal(data.total);
      setIsAuthed(true);
    } catch {
      setError("Failed to fetch subscribers.");
    } finally {
      // "finally" runs whether the try succeeded or failed.
      // Good place to always turn off the loading spinner.
      setLoading(false);
    }
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    fetchSubscribers(key);
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setSendResult("");

    try {
      const response = await fetch("/api/admin/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: key,
        },
        body: JSON.stringify({ subject, content }),
      });

      const data = await response.json();

      if (response.ok) {
        setSendResult(data.message);
        setSubject("");
        setContent("");
      } else {
        setSendResult(`Error: ${data.error}`);
      }
    } catch {
      setSendResult("Error: Failed to send newsletter.");
    } finally {
      setSending(false);
    }
  }

  // If not authenticated, show the key input form
  if (!isAuthed) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
          Admin
        </h1>
        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
          Enter the admin key to view subscribers.
        </p>

        <form onSubmit={handleLogin} className="mt-8 flex gap-3 max-w-md">
          <input
            type="password"
            placeholder="Admin key"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            className="flex-1 rounded-lg border border-zinc-300 px-4 py-2 text-sm
                       focus:outline-none focus:ring-2 focus:ring-zinc-900
                       dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100
                       dark:focus:ring-zinc-100"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-zinc-900 px-5 py-2 text-sm font-medium text-white
                       hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900
                       dark:hover:bg-zinc-300 disabled:opacity-50"
          >
            {loading ? "Checking..." : "Login"}
          </button>
        </form>

        {error && (
          <p className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
      </div>
    );
  }

  // Authenticated — show the dashboard
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
          Admin Dashboard
        </h1>
        <button
          onClick={() => fetchSubscribers(key)}
          className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
        >
          Refresh
        </button>
      </div>

      {/* Stats card */}
      <div className="mt-8 rounded-lg border border-zinc-200 dark:border-zinc-800 p-6">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Total Subscribers
        </p>
        <p className="text-4xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">
          {total}
        </p>
      </div>

      {/* Subscriber list */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          Subscribers
        </h2>

        {subscribers.length === 0 ? (
          <p className="mt-4 text-zinc-500 dark:text-zinc-400">
            No subscribers yet.
          </p>
        ) : (
          // HTML <table> elements for tabular data.
          // thead = table header row, tbody = table body rows.
          <table className="mt-4 w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 text-left">
                <th className="pb-2 font-medium text-zinc-500 dark:text-zinc-400">
                  Email
                </th>
                <th className="pb-2 font-medium text-zinc-500 dark:text-zinc-400">
                  Subscribed
                </th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((sub) => (
                <tr
                  key={sub.id}
                  className="border-b border-zinc-100 dark:border-zinc-800/50"
                >
                  <td className="py-3 text-zinc-900 dark:text-zinc-100">
                    {sub.email}
                  </td>
                  <td className="py-3 text-zinc-500 dark:text-zinc-400">
                    {/*
                      new Date() creates a Date object from the string.
                      .toLocaleDateString() formats it nicely for the user's locale.
                    */}
                    {new Date(sub.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Send Newsletter section */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          Send Newsletter
        </h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Compose and send an email to all {total} subscriber{total !== 1 ? "s" : ""}.
          {!process.env.NEXT_PUBLIC_HAS_RESEND && (
            <span className="block mt-1 text-amber-600 dark:text-amber-400">
              Mock mode — emails will be logged to the server console, not actually sent.
            </span>
          )}
        </p>

        <form onSubmit={handleSend} className="mt-6 space-y-4 max-w-xl">
          <div>
            <label
              htmlFor="subject"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Subject
            </label>
            {/*
              "htmlFor" connects a <label> to an <input> by id.
              Clicking the label focuses the input — better accessibility.
            */}
            <input
              id="subject"
              type="text"
              placeholder="This week's update"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2 text-sm
                         focus:outline-none focus:ring-2 focus:ring-zinc-900
                         dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100
                         dark:focus:ring-zinc-100"
            />
          </div>

          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Content
            </label>
            {/*
              <textarea> is like <input> but for multi-line text.
              "rows" sets the visible height.
            */}
            <textarea
              id="content"
              placeholder="Write your newsletter content here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={8}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2 text-sm
                         focus:outline-none focus:ring-2 focus:ring-zinc-900
                         dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100
                         dark:focus:ring-zinc-100"
            />
          </div>

          <button
            type="submit"
            disabled={sending || total === 0}
            className="rounded-lg bg-zinc-900 px-5 py-2 text-sm font-medium text-white
                       hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900
                       dark:hover:bg-zinc-300 disabled:opacity-50"
          >
            {sending ? "Sending..." : `Send to ${total} subscriber${total !== 1 ? "s" : ""}`}
          </button>

          {sendResult && (
            <p
              className={`text-sm ${
                sendResult.startsWith("Error")
                  ? "text-red-600 dark:text-red-400"
                  : "text-green-600 dark:text-green-400"
              }`}
            >
              {sendResult}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
