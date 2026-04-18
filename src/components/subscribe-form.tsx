// "use client" tells Next.js: this component needs to run in the BROWSER,
// not on the server. We need this because we use useState and event handlers,
// which only work in the browser.
"use client";

// useState is a React "hook" — a function that adds state to a component.
// State = data that changes over time and triggers re-renders when it does.
import { useState } from "react";

export default function SubscribeForm() {
  // useState returns a pair: [currentValue, functionToUpdateIt].
  // The argument ("") is the initial value.
  //
  // When you call setEmail("new value"), React re-renders the component
  // with the new value — the input field updates automatically.
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  // This function runs when the form is submitted.
  // "async" because we need to "await" the fetch call.
  async function handleSubmit(e: React.FormEvent) {
    // By default, forms reload the entire page on submit.
    // preventDefault() stops that — we want to handle it with JavaScript instead.
    e.preventDefault();

    setStatus("loading");

    try {
      // fetch() sends an HTTP request to our API route.
      // We send the email as JSON in the request body.
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      // Parse the JSON response from our API
      const data = await response.json();

      if (response.ok) {
        // Success — clear the input and show the success message
        setStatus("success");
        setMessage(data.message);
        setEmail("");
      } else {
        // API returned an error (400, 409, etc.)
        setStatus("error");
        setMessage(data.error);
      }
    } catch {
      // Network error — the request didn't reach the server at all
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  return (
    <div>
      {/*
        onSubmit={handleSubmit} — when the form is submitted, call our function.
        This is an "event handler" — React's way of responding to user actions.
      */}
      <form onSubmit={handleSubmit} className="flex gap-3 max-w-md">
        <input
          type="email"
          placeholder="you@example.com"
          // "value={email}" and "onChange={...}" together create a "controlled input."
          // React controls the input's value through state, not the DOM.
          // Every keystroke updates the state, which updates the input.
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          // Disable the input while submitting to prevent double-clicks
          disabled={status === "loading"}
          className="flex-1 rounded-lg border border-zinc-300 px-4 py-2 text-sm
                     focus:outline-none focus:ring-2 focus:ring-zinc-900
                     dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100
                     dark:focus:ring-zinc-100 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-lg bg-zinc-900 px-5 py-2 text-sm font-medium text-white
                     hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900
                     dark:hover:bg-zinc-300 disabled:opacity-50"
        >
          {/* Show different text depending on the current status */}
          {status === "loading" ? "Subscribing..." : "Subscribe"}
        </button>
      </form>

      {/* Show success or error message below the form */}
      {message && (
        <p
          className={`mt-3 text-sm ${
            status === "success"
              ? "text-green-600 dark:text-green-400"
              : "text-red-600 dark:text-red-400"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
