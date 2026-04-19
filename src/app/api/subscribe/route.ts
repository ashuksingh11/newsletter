// API route: POST /api/subscribe
// Now uses a real database (SQLite via Prisma) instead of a JSON file.

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const email: string = body.email;

  // Validate email format
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  // Normalize to lowercase
  const normalizedEmail = email.toLowerCase();

  // Check if already subscribed.
  // prisma.subscriber.findUnique() searches by a unique field (email).
  // It returns the record if found, or null if not.
  const existing = await prisma.subscriber.findUnique({
    where: { email: normalizedEmail },
  });

  if (existing) {
    return NextResponse.json(
      { error: "This email is already subscribed!" },
      { status: 409 }
    );
  }

  // Create a new subscriber in the database.
  // Prisma automatically sets the id (autoincrement) and createdAt (now).
  await prisma.subscriber.create({
    data: { email: normalizedEmail },
  });

  return NextResponse.json(
    { message: "Thanks for subscribing!" },
    { status: 201 }
  );
}
