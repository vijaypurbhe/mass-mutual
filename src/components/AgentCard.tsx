import { useState, useRef, useEffect, useImperativeHandle, forwardRef } from "react";
import { Send, MessageSquare, X } from "lucide-react";
import type { Agent, AgentStatus } from "@/data/mockData";
import { streamChat, type Msg } from "@/lib/streamChat";
import ChatMessage from "@/components/ChatMessage";
import { toast } from "sonner";

const statusConfig: Record<AgentStatus, { label: string; dotClass: string; bgClass: string }> = {
  monitoring: { label: "Monitoring", dotClass: "bg-success", bgClass: "bg-success/10 text-success" },
  alert: { label: "Alert", dotClass: "bg-warning", bgClass: "bg-warning/10 text-warning" },
  acting: { label: "Acting", dotClass: "bg-primary", bgClass: "bg-primary/10 text-primary" },
};

export interface AgentCardHandle {
  openWithContext: (context: string) => void;
}

interface AgentCardProps {
  agent: Agent;
}

const AgentCard = forwardRef<AgentCardHandle, AgentCardProps>(({ agent }, ref) => {
  const [executing, setExecuting] = useState(false);
  const [executed, setExecuted] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [pendingContext, setPendingContext] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const config = statusConfig[agent.status];

  useImperativeHandle(ref, () => ({
    openWithContext: (context: string) => {
      setMessages([]);
      setPendingContext(context);
      setChatOpen(true);
    },
  }));

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!chatOpen || messages.length > 0) return;

    if (pendingContext) {
      const contextMsg = pendingContext;
      setPendingContext(null);
      const userMsg: Msg = { role: "user", content: `🚨 Alert: ${contextMsg}` };
      setMessages([userMsg]);
      sendToAI([userMsg]);
    } else {
      // Send an initial greeting request
      const initMsg: Msg = { role: "user", content: "Hello, give me a brief overview of your current status and key findings." };
      setMessages([initMsg]);
      sendToAI([initMsg]);
    }
  }, [chatOpen]);

  const sendToAI = async (msgs: Msg[]) => {
    setStreaming(true);
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
        messages: msgs,
        agentId: agent.id,
        onDelta: upsertAssistant,
        onDone: () => setStreaming(false),
        onError: (err) => toast.error(err),
      });
    } catch {
      setStreaming(false);
      toast.error("Failed to connect to AI agent");
    }
  };

  const handleExecute = () => {
    setExecuting(true);
    setTimeout(() => { setExecuting(false); setExecuted(true); }, 2000);
  };

  const handleSend = () => {
    if (!input.trim() || streaming) return;
    const userMsg: Msg = { role: "user", content: input.trim() };
    setInput("");
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    sendToAI(newMessages);
  };

  return (
    <>
      <div className={`glass-card-hover p-5 flex flex-col gap-3 ${agent.status === "alert" ? "border-warning/30" : ""}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">{agent.icon}</span>
            <h3 className="text-sm font-semibold text-foreground">{agent.name}</h3>
          </div>
          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1.5 ${config.bgClass}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${config.dotClass} ${agent.status === "alert" ? "animate-pulse" : ""}`} />
            {config.label}
          </span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">{agent.insight}</p>
        <div className="flex items-center gap-3 text-xs">
          <span className="text-muted-foreground">Confidence</span>
          <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${agent.confidence}%` }} />
          </div>
          <span className="font-mono text-foreground font-medium">{agent.confidence}%</span>
        </div>
        <div className="bg-secondary/50 rounded-lg p-3 text-xs">
          <div className="text-muted-foreground mb-1">Recommended Action</div>
          <div className="text-foreground font-medium">{agent.action}</div>
        </div>
        <div className="flex items-center justify-between mt-auto">
          <span className="text-xs">
            <span className="text-muted-foreground">Impact: </span>
            <span className="font-mono font-semibold text-success">{agent.impact}</span>
          </span>
          <div className="flex items-center gap-1.5">
            <button onClick={() => { setMessages([]); setPendingContext(null); setChatOpen(true); }} className="text-[11px] font-medium px-2.5 py-1.5 rounded-md bg-secondary/60 text-muted-foreground hover:text-foreground hover:bg-secondary transition-all flex items-center gap-1">
              <MessageSquare className="w-3 h-3" /> Chat
            </button>
            <button onClick={handleExecute} disabled={executing || executed} className={`text-[11px] font-medium px-3 py-1.5 rounded-md transition-all ${executed ? "bg-success/20 text-success cursor-default" : executing ? "bg-primary/20 text-primary animate-pulse cursor-wait" : "bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer"}`}>
              {executed ? "✓ Executed" : executing ? "Executing..." : "Execute →"}
            </button>
          </div>
        </div>
      </div>

      {chatOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-slide-up">
          <div className="w-full max-w-lg mx-4 glass-card border border-border/50 flex flex-col max-h-[80vh] shadow-2xl">
            <div className="flex items-center justify-between px-5 py-3 border-b border-border/50">
              <div className="flex items-center gap-2">
                <span className="text-lg">{agent.icon}</span>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{agent.name}</h3>
                  <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full ${config.bgClass}`}>{config.label} • {agent.confidence}% confidence</span>
                </div>
              </div>
              <button onClick={() => setChatOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors p-1"><X className="w-4 h-4" /></button>
            </div>
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
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
                <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSend()} placeholder={`Ask ${agent.name} anything...`} className="flex-1 bg-secondary/50 text-sm text-foreground placeholder:text-muted-foreground px-3 py-2 rounded-lg border border-border/50 focus:outline-none focus:border-primary/50 transition-colors" />
                <button onClick={handleSend} disabled={!input.trim() || streaming} className="bg-primary/10 text-primary p-2 rounded-lg hover:bg-primary/20 transition-colors disabled:opacity-40"><Send className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
});

AgentCard.displayName = "AgentCard";

export default AgentCard;
