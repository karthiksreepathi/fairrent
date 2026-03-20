import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const CAPTURES_FILE = path.join(process.cwd(), "data", "email-captures.json");

interface EmailCapture {
  email: string;
  name?: string;
  interests?: string[];
  capturedAt: string;
}

function readCaptures(): EmailCapture[] {
  try {
    if (!fs.existsSync(CAPTURES_FILE)) {
      fs.writeFileSync(CAPTURES_FILE, "[]", "utf-8");
      return [];
    }
    const data = fs.readFileSync(CAPTURES_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function writeCaptures(captures: EmailCapture[]): void {
  fs.writeFileSync(CAPTURES_FILE, JSON.stringify(captures, null, 2), "utf-8");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, interests } = body;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "A valid email address is required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    const captures = readCaptures();

    const alreadyExists = captures.some(
      (c) => c.email === normalizedEmail
    );

    if (alreadyExists) {
      return NextResponse.json(
        { message: "Email already captured", success: true },
        { status: 200 }
      );
    }

    const newCapture: EmailCapture = {
      email: normalizedEmail,
      name: name || undefined,
      interests: interests || undefined,
      capturedAt: new Date().toISOString(),
    };

    captures.push(newCapture);
    writeCaptures(captures);

    return NextResponse.json(
      { message: "Email captured successfully", success: true },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to capture email" },
      { status: 500 }
    );
  }
}
