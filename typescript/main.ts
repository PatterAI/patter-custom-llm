/**
 * Bring your own LLM — Patter handles STT/TTS, you control the brain.
 * Usage: npx tsx main.ts
 */

import { Patter, deepgram, elevenlabs } from "getpatter";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

const SYSTEM_PROMPT = "You are a helpful enterprise support agent. Keep responses concise.";

async function callClaude(userMessage: string): Promise<string> {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": process.env.ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 256,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userMessage }],
    }),
  });
  const body = (await response.json()) as Record<string, unknown>;
  const content = body.content as Array<{ text: string }>;
  return content[0].text;
}

const phone = new Patter({
  mode: "local",
  twilioSid: process.env.TWILIO_ACCOUNT_SID!,
  twilioToken: process.env.TWILIO_AUTH_TOKEN!,
  phoneNumber: process.env.TWILIO_PHONE_NUMBER!,
  webhookUrl: process.env.WEBHOOK_URL!,
});

const agent = phone.agent({
  systemPrompt: SYSTEM_PROMPT,
  provider: "pipeline",
  stt: deepgram({ apiKey: process.env.DEEPGRAM_API_KEY! }),
  tts: elevenlabs({ apiKey: process.env.ELEVENLABS_API_KEY!, voice: "rachel" }),
  firstMessage: "Hello, how can I assist you today?",
});

async function main(): Promise<void> {
  await phone.serve({
    agent,
    port: 8000,
    onMessage: async (data) => {
      const transcript = data.transcript as string;
      return callClaude(transcript);
    },
  });
}

main();
