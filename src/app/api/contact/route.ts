import { NextRequest, NextResponse } from "next/server";
import { sendContactMessage } from "@/lib/mailersend";

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    await sendContactMessage(email, name, message);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact error:", err);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
