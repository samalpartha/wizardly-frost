export interface LLMMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

/**
 * Mock LLM client so the backend works with ZERO external setup.
 * Agents that expect JSON will fall back gracefully.
 */
export async function callLLM(messages: LLMMessage[]): Promise<string> {
  console.log(
    "[LLM MOCK] Messages:",
    messages.map((m) => m.role + ": " + m.content.slice(0, 80))
  );
  // Return a generic string; agents will handle non-JSON via their fallback logic.
  return "MOCK_LLM_OUTPUT";
}
