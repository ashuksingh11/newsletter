// This file creates a POST endpoint at /api/subscribe.
// It's called a "Route Handler" in Next.js.
// Unlike page.tsx (which renders UI), route.ts handles raw HTTP requests.

import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

// Path to our simple JSON "database" file.
// In production you'd use a real database — this is just for learning.
const DATA_FILE = path.join(process.cwd(), "subscribers.json");

// Helper: read existing subscribers from the JSON file.
// If the file doesn't exist yet, return an empty array.
async function getSubscribers(): Promise<string[]> {
  try {
    const data = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    // File doesn't exist yet — that's fine, start with empty list
    return [];
  }
}

// Helper: save the subscribers array back to the JSON file.
async function saveSubscribers(subscribers: string[]): Promise<void> {
  await fs.writeFile(DATA_FILE, JSON.stringify(subscribers, null, 2));
}

// The function name "POST" tells Next.js this handles POST requests.
// Next.js maps HTTP methods to exported function names:
//   export async function GET()  → handles GET  /api/subscribe
//   export async function POST() → handles POST /api/subscribe
export async function POST(request: NextRequest) {
  // Parse the JSON body sent from the browser's fetch() call.
  // The "await" pauses until the body is fully read.
  const body = await request.json();
  const email: string = body.email;

  // Basic validation — check that the email exists and looks valid.
  // The regex (regular expression) tests for a basic email pattern.
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    // NextResponse.json() sends a JSON response back to the browser.
    // The second argument sets the HTTP status code — 400 means "bad request."
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  const subscribers = await getSubscribers();

  // Check for duplicates
  if (subscribers.includes(email.toLowerCase())) {
    return NextResponse.json(
      { error: "This email is already subscribed!" },
      { status: 409 } // 409 = "conflict" (resource already exists)
    );
  }

  // Add the new subscriber and save
  subscribers.push(email.toLowerCase());
  await saveSubscribers(subscribers);

  // 201 = "created" — the standard status code for successful resource creation
  return NextResponse.json(
    { message: "Thanks for subscribing!" },
    { status: 201 }
  );
}
