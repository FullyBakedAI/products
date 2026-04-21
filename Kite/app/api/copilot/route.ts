import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { messages, tripContext, userName, apiKey } = await req.json();

    const key = apiKey || process.env.ANTHROPIC_API_KEY;
    if (!key) {
      return new Response(
        JSON.stringify({ error: "No API key provided" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const client = new Anthropic({ apiKey: key });

    const locationNote = tripContext?.locationNote || "";
    const system = `You are Kite, a warm, practical travel copilot for ${userName || "the traveler"} on a real family trip. Keep replies short (1–4 sentences unless asked for depth). Use the trip context to give concrete, specific answers — name stops, times, directions. If you don't know something, say so briefly.${locationNote ? " " + locationNote : ""} Current trip context:\n${JSON.stringify(tripContext)}`;

    const stream = await client.messages.stream({
      model: "claude-haiku-4-5",
      max_tokens: 800,
      system,
      messages: (messages || []).map((m: { role: string; content: string }) => ({
        role: m.role,
        content: m.content,
      })),
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          if (
            chunk.type === "content_block_delta" &&
            chunk.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(chunk.delta.text));
          }
        }
        controller.close();
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
