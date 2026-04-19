// API route: GET /api/admin/subscribers
// Returns the list of subscribers. Protected by ADMIN_KEY.

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  // Read the "authorization" header from the request.
  // Headers are metadata sent with every HTTP request.
  // The browser sends them, and we check them on the server.
  const authKey = request.headers.get("authorization");

  // process.env reads environment variables from the .env file.
  // If the key doesn't match, return 401 (unauthorized).
  if (authKey !== process.env.ADMIN_KEY) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  // Fetch all subscribers, newest first.
  // prisma.subscriber.findMany() is like: SELECT * FROM subscribers
  const subscribers = await prisma.subscriber.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    total: subscribers.length,
    subscribers,
  });
}
