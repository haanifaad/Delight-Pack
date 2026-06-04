import { NextResponse } from "next/server";
import { chatWithAssistant } from "@/lib/ai-assistant";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const latestMessage = messages[messages.length - 1]?.content;

    if (!latestMessage) {
      return NextResponse.json({ error: "No message provided" }, { status: 400 });
    }

    const text = await chatWithAssistant(messages);

    return NextResponse.json({ text });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 });
  }
}
