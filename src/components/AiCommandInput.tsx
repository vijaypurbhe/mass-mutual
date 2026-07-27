import { useState, useRef, useEffect } from "react";
import { Send, Sparkles } from "lucide-react";
import { streamChat, type Msg } from "@/lib/streamChat";
import ChatMessage from "@/components/ChatMessage";
import { toast } from "sonner";

const suggestedQueries = [
  "How is online revenue trending this quarter?",
  "What's our conversion rate by channel?",
  "Show me the customer segments",
  "Walk me through the marketing attribution",
  "What's driving cart abandonment?",
  "Give me the executive briefing",
];

const AiCommandInput = () => {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (streaming || !text.trim()) return;
    const userMsg: Msg = { role: "user", content: text.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setStreaming(true);
    setInput("");

    let assistantSoFar = "";
    const upsertAssistant = (chunk: string) => {
      assistantSoFar += chunk;
      const content = assistantSoFar;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content } : m));
        }
        return [...prev, { role: "assistant", content }];
      });
    };

    try {
      await streamChat({
        messages: newMessages,
        agentId: "command",
        onDelta: upsertAssistant,
        onDone: () => setStreaming(false),
        onError: (err) => toast.error(err),
      });
    } catch {
      setStreaming(false);
      toast.error("Failed to connect to AI");
    }
  };

  return (
    <div className="glass-card flex flex-col h-full">
      <div className="px-5 pt-4 pb-2 border-b border-border/50">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">AI Command Center</h3>
        </div>
        <p className="text-[10px] text-muted-foreground mt-0.5">Natural language queries across SFCC + GA4 eCommerce data</p>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0 max-h-[400px]">
        {messages.length === 0 && (
          <div className="space-y-4 py-4">
            <div className="text-center">
              <div className="text-3xl mb-2">⚡</div>
              <p className="text-xs text-muted-foreground mb-4">Ask anything about eCommerce performance</p>
            </div>
            <div className="grid grid-cols-1 gap-1.5">
              {suggestedQueries.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="text-left text-[11px] px-3 py-2 rounded-lg bg-secondary/40 text-muted-foreground hover:bg-secondary/70 hover:text-foreground transition-colors border border-border/30"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((msg, i) => (
          <ChatMessage
            key={i}
            role={msg.role}
            content={msg.content}
            isStreaming={streaming && i === messages.length - 1 && msg.role === "assistant"}
          />
        ))}
      </div>

      <div className="p-3 border-t border-border/50">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
            placeholder="Ask about revenue, conversion, marketing, segments..."
            className="flex-1 bg-secondary/50 text-sm text-foreground placeholder:text-muted-foreground px-3 py-2 rounded-lg border border-border/50 focus:outline-none focus:border-primary/50 transition-colors"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || streaming}
            className="bg-primary/10 text-primary p-2 rounded-lg hover:bg-primary/20 transition-colors disabled:opacity-40"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiCommandInput;
