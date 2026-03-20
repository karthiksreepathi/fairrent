import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const SUBSCRIBERS_FILE = path.join(process.cwd(), "data", "subscribers.json");

async function getSubscribers(): Promise<string[]> {
  try {
    const data = await fs.readFile(SUBSCRIBERS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveSubscribers(subscribers: string[]): Promise<void> {
  await fs.writeFile(SUBSCRIBERS_FILE, JSON.stringify(subscribers, null, 2));
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    }

    const subscribers = await getSubscribers();

    if (subscribers.includes(email.toLowerCase())) {
      return NextResponse.json({ message: "Already subscribed" }, { status: 200 });
    }

    subscribers.push(email.toLowerCase());
    await saveSubscribers(subscribers);

    return NextResponse.json({ message: "Successfully subscribed!" }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
