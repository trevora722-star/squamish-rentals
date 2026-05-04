import Anthropic from "@anthropic-ai/sdk";

const apiKey = process.env.ANTHROPIC_API_KEY;

if (!apiKey && process.env.NODE_ENV !== "test") {
  // Don't throw at import — let routes return a 503 with a clear message
  console.warn(
    "[anthropic] ANTHROPIC_API_KEY not set. Chat endpoints will return 503.",
  );
}

export const MODEL = process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-6";

export const anthropic = new Anthropic({
  apiKey: apiKey ?? "missing",
});

export function isAnthropicConfigured(): boolean {
  return Boolean(apiKey);
}
