<p align="center">
  <img src="https://raw.githubusercontent.com/PatterAI/Patter/main/docs/patter-logo-banner.svg" alt="Patter" width="300" />
</p>

# Patter: Custom LLM

Bring your own LLM (Claude, Mistral, Llama, etc.) while Patter handles speech-to-text, text-to-speech, and telephony.

> Part of the [Patter](https://github.com/PatterAI/Patter) Voice AI SDK.

## Prerequisites

- [Twilio](https://www.twilio.com/) account with a phone number
- [Anthropic](https://console.anthropic.com/) API key (or any LLM provider)
- [Deepgram](https://deepgram.com/) API key for speech-to-text
- [ElevenLabs](https://elevenlabs.io/) API key for text-to-speech

## Quick Start

### Python

```bash
cd python
cp ../.env.example .env   # fill in your keys
pip install -r requirements.txt
python main.py
```

### TypeScript

```bash
cd typescript
cp ../.env.example .env   # fill in your keys
npm install
npx tsx main.ts
```

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `ANTHROPIC_API_KEY` | Yes | Anthropic API key for Claude (or swap with your LLM) |
| `DEEPGRAM_API_KEY` | Yes | Deepgram API key for speech-to-text |
| `ELEVENLABS_API_KEY` | Yes | ElevenLabs API key for text-to-speech |
| `TWILIO_ACCOUNT_SID` | Yes | Twilio account SID |
| `TWILIO_AUTH_TOKEN` | Yes | Twilio auth token |
| `TWILIO_PHONE_NUMBER` | Yes | Your Twilio phone number (E.164) |
| `WEBHOOK_URL` | No | Public URL for webhooks (auto-tunneled if omitted) |

## What This Demonstrates

- **Pipeline mode** — separate STT, LLM, and TTS providers for maximum flexibility
- **`on_message` handler** — intercept transcribed speech and generate responses with your own LLM
- **Calling an external LLM API** — example uses Anthropic Claude, but swap in any HTTP-based LLM
- **Patter as a voice layer only** — Patter manages audio, telephony, and turn-taking while you control the brain

## How It Works

1. Patter receives a phone call and streams audio to Deepgram for transcription
2. The transcribed text is passed to your `on_message` callback
3. Your callback sends the text to any LLM API (Claude in this example) and returns the response
4. Patter synthesizes the response with ElevenLabs and streams audio back to the caller

## Next Steps

- [Inbound Agent](https://github.com/PatterAI/patter-inbound-agent) — minimal inbound voice agent
- [Dynamic Variables](https://github.com/PatterAI/patter-dynamic-variables) — per-call personalization
- [Production Setup](https://github.com/PatterAI/patter-production) — full production configuration
- [Full documentation](https://docs.getpatter.com)
- [All templates](https://github.com/PatterAI/Patter#templates)

## License

MIT
