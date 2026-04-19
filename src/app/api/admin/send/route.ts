// API route: POST /api/admin/send
// Sends a newsletter email to all subscribers.

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendBulkEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  // Auth check
  const authKey = request.headers.get("authorization");
  if (authKey !== process.env.ADMIN_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { subject, content } = body;

  // Validate inputs
  if (!subject || !content) {
    return NextResponse.json(
      { error: "Subject and content are required." },
      { status: 400 }
    );
  }

  // Get all subscriber emails
  const subscribers = await prisma.subscriber.findMany({
    select: { email: true }, // Only fetch the email field — more efficient
  });

  if (subscribers.length === 0) {
    return NextResponse.json(
      { error: "No subscribers to send to." },
      { status: 400 }
    );
  }

  // Build a simple HTML email.
  // Template literals (backtick strings) make it easy to embed variables.
  const html = `
    <div style="max-width: 600px; margin: 0 auto; font-family: sans-serif;">
      <h1 style="color: #18181b;">${subject}</h1>
      <div style="color: #3f3f46; line-height: 1.7;">
        ${content.split("\n").map((line: string) => `<p>${line}</p>`).join("")}
      </div>
      <hr style="border: none; border-top: 1px solid #e4e4e7; margin: 32px 0;" />
      <p style="color: #a1a1aa; font-size: 14px;">
        You received this because you subscribed to The Newsletter.
      </p>
    </div>
  `;

  const emails = subscribers.map((s) => s.email);
  const result = await sendBulkEmail(emails, subject, html);

  return NextResponse.json({
    message: `Newsletter sent! ${result.sent} delivered, ${result.failed} failed.`,
    ...result,
  });
}
