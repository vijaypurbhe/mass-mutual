import * as React from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Send, Loader2, MessageSquare } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { toast } from "sonner";
import { usePersona } from "@/lib/persona-context";
import { PERSONAS } from "@/lib/mazda-mock";
import { useMazdaChat } from "@/lib/use-mazda-chat";
import { cn } from "@/lib/utils";

const ROUTE_PROMPTS: Record<string, string[]> = {
  "/": [
    "Summarize what changed overnight and what I should do first.",
    "Which item in my briefing has the biggest revenue impact?",
    "Draft my morning standup talking points.",
  ],
  "/leads": [
    "Which leads breached SLA and need re-routing now?",
    "Draft a personalized SMS for the top-scored CX-90 PHEV lead.",
    "Compare close rates across the West-region dealers.",
  ],
  "/vehicle": [
    "Explain the P0420 code and likely root cause on this VIN.",
    "Is this DTC covered under the powertrain warranty?",
    "Draft an SMS to the owner offering a service slot.",
  ],
  "/warranty": [
    "Review this claim and flag anything missing before I submit.",
    "What's the policy match rationale for MGWS year 1?",
    "Suggest parts substitutions if 8DC-20-130 is back-ordered.",
  ],
  "/dealer-scorecard": [
    "Why did CSI drop 14 points this week?",
    "Draft a 3-point coaching plan for Friday's visit.",
    "Which scorecard metric should we fix first for biggest ROI?",
  ],
  "/household": [
    "What's the best next offer for the Tanaka household?",
    "When will Kenji (18) likely be ready for his first vehicle?",
    "Estimate this household's 3-year LTV under a CX-90 PHEV upsell.",
  ],
};

function promptsFor(pathname: string) {
  return ROUTE_PROMPTS[pathname] ?? ROUTE_PROMPTS["/"];
}

export default function AgentforceWidget() {
  const { persona } = usePersona();
  const p = PERSONAS[persona];
  const [open, setOpen] = React.useState(false);
  const [input, setInput] = React.useState("");
  const { messages, send, streaming, error, setMessages } = useMazdaChat(persona);
  const location = useLocation();
  const scrollRef = React.useRef<HTMLDivElement | null>(null);
  const prompts = promptsFor(location.pathname);

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, streaming, open]);

  React.useEffect(() => { if (error) toast.error(error); }, [error]);

  // Reset conversation when route changes — keeps it contextual.
  React.useEffect(() => { setMessages([]); /* eslint-disable-next-line */ }, [location.pathname]);

  const submit = (text?: string) => {
    const value = (text ?? input).trim();
    if (!value) return;
    setInput("");
    if (!open) setOpen(true);
    send(value);
  };

  return (
    <>
      {/* Floating launcher */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4, type: "spring", stiffness: 220, damping: 18 }}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "fixed bottom-5 right-5 z-[60] h-14 w-14 rounded-full bg-gradient-soul flex items-center justify-center text-white shadow-2xl hover:scale-105 transition-transform",
          open && "scale-95",
        )}
        aria-label="Open Agentforce"
        title="Ask Atlas"
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="h-5 w-5" />
            </motion.span>
          ) : (
            <motion.span key="s" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <Sparkles className="h-5 w-5" />
            </motion.span>
          )}
        </AnimatePresence>
        {!open && (
          <span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-warning border-2 border-background animate-pulse" />
        )}
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ type: "spring", damping: 22, stiffness: 260 }}
            className="fixed bottom-24 right-5 z-[55] w-[min(420px,calc(100vw-2.5rem))] h-[min(620px,calc(100vh-8rem))] bg-card border hairline rounded-xl shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="bg-[hsl(var(--slds-brand-dark))] text-white px-4 py-3 flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-full bg-gradient-soul flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div className="leading-tight">
                <div className="text-sm font-semibold">{p.agentName}</div>
                <div className="text-[10px] text-white/70 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                  Online · context: {location.pathname}
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="ml-auto text-white/70 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 && (
                <div className="space-y-3">
                  <div className="flex gap-2.5">
                    <div className="h-7 w-7 rounded-full bg-gradient-soul flex items-center justify-center flex-shrink-0">
                      <Sparkles className="h-3.5 w-3.5 text-white" />
                    </div>
                    <div className="rounded-2xl rounded-tl-sm bg-secondary px-3.5 py-2.5 text-sm">
                      Hi {p.name.split(" ")[0]} — I can see this screen. Try one of these to start:
                    </div>
                  </div>
                  <div className="space-y-2 pl-9">
                    {prompts.map((q) => (
                      <button
                        key={q}
                        onClick={() => submit(q)}
                        className="block w-full text-left text-xs px-3 py-2 rounded-lg border hairline bg-card hover:border-primary hover:bg-primary/5 transition-colors"
                      >
                        <MessageSquare className="h-3 w-3 inline mr-1.5 text-primary" />
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {messages.map((m, i) => (
                <Bubble key={i} role={m.role}>
                  {m.content ? (
                    m.role === "assistant" ? (
                      <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-1 prose-ul:my-1 prose-headings:my-2">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>
                      </div>
                    ) : m.content
                  ) : (
                    <span className="inline-flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" /> Thinking…
                    </span>
                  )}
                </Bubble>
              ))}
            </div>

            <div className="border-t hairline p-3 bg-secondary/30">
              <div className="flex items-center gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); } }}
                  disabled={streaming}
                  placeholder="Ask Atlas about this screen…"
                  className="flex-1 h-9 rounded-lg bg-card border hairline px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-60"
                />
                <button
                  onClick={() => submit()}
                  disabled={streaming || !input.trim()}
                  className="h-9 w-9 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center disabled:opacity-50"
                >
                  {streaming ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Bubble({ role, children }: { role: "user" | "assistant"; children: React.ReactNode }) {
  if (role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-primary text-primary-foreground px-3.5 py-2 text-sm">{children}</div>
      </div>
    );
  }
  return (
    <div className="flex gap-2.5">
      <div className="h-7 w-7 rounded-full bg-gradient-soul flex items-center justify-center flex-shrink-0">
        <Sparkles className="h-3.5 w-3.5 text-white" />
      </div>
      <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-secondary px-3.5 py-2.5 text-sm leading-relaxed">
        {children}
      </div>
    </div>
  );
}