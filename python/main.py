"""Bring your own LLM — Patter handles STT/TTS, you control the brain."""

import asyncio
import os

import httpx
from dotenv import load_dotenv
load_dotenv()

from patter import Patter

ANTHROPIC_API_KEY = os.environ["ANTHROPIC_API_KEY"]
SYSTEM_PROMPT = (
    "You are a concise, friendly phone assistant for Acme Corp. "
    "Help callers with account questions and billing. "
    "Keep responses under two sentences."
)


async def on_message(data):
    history = data["history"]
    messages = [{"role": m["role"], "content": m["text"]} for m in history]

    async with httpx.AsyncClient(timeout=15.0) as client:
        response = await client.post(
            "https://api.anthropic.com/v1/messages",
            headers={
                "x-api-key": ANTHROPIC_API_KEY,
                "anthropic-version": "2023-06-01",
                "content-type": "application/json",
            },
            json={
                "model": "claude-sonnet-4-20250514",
                "max_tokens": 256,
                "system": SYSTEM_PROMPT,
                "messages": messages,
            },
        )
        response.raise_for_status()
        return response.json()["content"][0]["text"]


phone = Patter(
    mode="local",
    twilio_sid=os.getenv("TWILIO_ACCOUNT_SID"),
    twilio_token=os.getenv("TWILIO_AUTH_TOKEN"),
    phone_number=os.getenv("TWILIO_PHONE_NUMBER"),
    webhook_url=os.getenv("WEBHOOK_URL"),
)

agent = phone.agent(
    provider="pipeline",
    system_prompt=SYSTEM_PROMPT,
    stt=Patter.deepgram(api_key=os.environ["DEEPGRAM_API_KEY"]),
    tts=Patter.elevenlabs(api_key=os.environ["ELEVENLABS_API_KEY"], voice="aria"),
    language="en",
)

if __name__ == "__main__":
    print("Listening for calls (pipeline mode with Claude)...")
    asyncio.run(phone.serve(agent, port=8000, on_message=on_message))
