import * as React from "react";
import { supabase } from "@/integrations/supabase/client";
import type { PersonaId } from "./mazda-mock";

export type ChatMsg = { role: "user" | "assistant"; content: string };

const FUNCTIONS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/mazda-chat`;
const ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

export function useMazdaChat(persona: PersonaId, seed: ChatMsg[] = []) {
  const [messages, setMessages] = React.useState<ChatMsg[]>(seed);
  const [streaming, setStreaming] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setMessages(seed);
    setError(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [persona]);

  const send = React.useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || streaming) return;
      setError(null);

      const next: ChatMsg[] = [
        ...messages,
        { role: "user", content: trimmed },
        { role: "assistant", content: "" },
      ];
      setMessages(next);
      setStreaming(true);

      try {
        const payload = next.slice(0, -1).map((m) => ({ role: m.role, content: m.content }));
        const res = await fetch(FUNCTIONS_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${ANON_KEY}`,
            apikey: ANON_KEY,
          },
          body: JSON.stringify({ messages: payload, persona }),
        });

        if (!res.ok || !res.body) {
          const msg =
            res.status === 429
              ? "Rate limit reached — try again in a moment."
              : res.status === 402
                ? "AI credits exhausted. Add credits in workspace settings."
                : `Request failed (${res.status}).`;
          setError(msg);
          setMessages((m) => m.slice(0, -1));
          return;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let assistant = "";

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            if (!line.startsWith("data:")) continue;
            const payload = line.slice(5).trim();
            if (!payload || payload === "[DONE]") continue;
            try {
              const evt = JSON.parse(payload);
              const delta = evt?.choices?.[0]?.delta?.content;
              if (typeof delta === "string") {
                assistant += delta;
                setMessages((m) => {
                  const copy = m.slice();
                  copy[copy.length - 1] = { role: "assistant", content: assistant };
                  return copy;
                });
              }
            } catch {
              // ignore keepalives
            }
          }
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Network error");
        setMessages((m) => m.slice(0, -1));
      } finally {
        setStreaming(false);
      }
    },
    [messages, streaming, persona],
  );

  return { messages, send, streaming, error, setMessages };
}

// keep import to avoid tree-shake warnings
void supabase;