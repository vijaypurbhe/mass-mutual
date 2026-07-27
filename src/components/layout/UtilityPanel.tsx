import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useWorkspace } from "@/context/WorkspaceContext";
import { dateTime, relativeTime } from "@/lib/format";
import { can } from "@/lib/permissions";
import { streamChat, type Msg } from "@/lib/streamChat";
import { cn } from "@/lib/utils";
import { KnowledgeService } from "@/services";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, Bot, ClipboardList, PanelRightClose, SendHorizonal, ShieldCheck, Square } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const SUGGESTIONS = [
  "Summarize this relationship for a service call.",
  "What should I prepare before the next client meeting?",
  "Explain the current claim status in plain language.",
  "Which outstanding requirements are blocking progress?",
];

function CopilotPanel({ contextText, contextLabel }: { contextText: string; contextLabel: string }) {
  const { persona, personaId, copilotSeed, clearCopilotSeed, logAudit } = useWorkspace();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const allowed = can(personaId, "use_copilot");

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streaming]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || streaming) return;
    const next: Msg[] = [...messages, { role: "user", content: trimmed }];
    setMessages([...next, { role: "assistant", content: "" }]);
    setInput("");
    setStreaming(true);
    const controller = new AbortController();
    abortRef.current = controller;
    logAudit({ action: "Copilot prompt submitted", record: contextLabel, detail: trimmed.slice(0, 140) });

    await streamChat({
      messages: next,
      persona: `${persona.name}, ${persona.title} (${persona.team})`,
      context: contextText,
      signal: controller.signal,
      onDelta: (delta) =>
        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = { role: "assistant", content: copy[copy.length - 1].content + delta };
          return copy;
        }),
      onError: (message) => {
        toast.error(message);
        setMessages((prev) => prev.slice(0, -1));
      },
      onDone: () => {
        setStreaming(false);
        abortRef.current = null;
        inputRef.current?.focus();
      },
    });
  };

  useEffect(() => {
    if (copilotSeed && allowed) {
      const prompt = copilotSeed.prompt;
      clearCopilotSeed();
      void send(prompt);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [copilotSeed, allowed]);

  if (!allowed) {
    return (
      <div className="p-4 text-sm text-muted-foreground">
        Copilot is not enabled for the {persona.title} role in this environment.
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border px-3 py-2">
        <p className="text-xs text-muted-foreground">
          Grounded in <span className="font-medium text-foreground">{contextLabel}</span>. Copilot drafts only — you confirm every action.
        </p>
      </div>

      <ScrollArea className="flex-1 px-3">
        <div className="space-y-3 py-3">
          {messages.length === 0 && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Ask about the record in view.</p>
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  className="glass w-full rounded-xl px-3 py-2 text-left text-sm transition-all duration-200 hover:shadow-float"
                  onClick={() => send(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
          {messages.map((m, i) => (
            <div
              key={i}
              className={cn(
                "rounded border px-3 py-2 text-sm",
                m.role === "user" ? "border-primary/25 bg-primary/[0.07]" : "border-border/60 bg-foreground/[0.03]",
              )}
            >
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {m.role === "user" ? "You" : "Copilot"}
              </p>
              {m.role === "assistant" && m.content === "" ? (
                <p className="text-sm text-muted-foreground" aria-live="polite">
                  Reviewing the record…
                </p>
              ) : (
                <div className="prose prose-sm max-w-none dark:prose-invert prose-p:my-1.5 prose-ul:my-1.5 prose-headings:text-sm">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>
                </div>
              )}
            </div>
          ))}
          <div ref={endRef} />
        </div>
      </ScrollArea>

      <form
        className="border-t border-border p-3"
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
      >
        <Textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Copilot about this record…"
          rows={2}
          className="resize-none text-sm"
          aria-label="Copilot prompt"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send(input);
            }
          }}
        />
        <div className="mt-2 flex items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">Answers cite source records.</p>
          {streaming ? (
            <Button type="button" size="sm" variant="outline" onClick={() => abortRef.current?.abort()}>
              <Square className="mr-1 h-3 w-3" aria-hidden="true" />
              Stop
            </Button>
          ) : (
            <Button type="submit" size="sm" disabled={!input.trim()}>
              <SendHorizonal className="mr-1 h-3 w-3" aria-hidden="true" />
              Send
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}

function KnowledgeTab() {
  const [query, setQuery] = useState("");
  const { data = [] } = useQuery({ queryKey: ["knowledge"], queryFn: KnowledgeService.all });
  const filtered = data.filter((a) => `${a.title} ${a.summary} ${a.product} ${a.process}`.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border p-3">
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search approved knowledge" aria-label="Search knowledge" />
      </div>
      <ScrollArea className="flex-1">
        <ul className="space-y-2 p-3">
          {filtered.slice(0, 12).map((article) => (
            <li key={article.id} className="glass rounded-xl p-3">
              <p className="text-sm font-medium text-foreground">{article.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">{article.summary}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {article.product} · {article.approvalStatus} · effective {article.effectiveDate}
              </p>
            </li>
          ))}
          {filtered.length === 0 && <li className="text-sm text-muted-foreground">No approved articles match that search.</li>}
        </ul>
      </ScrollArea>
      <div className="border-t border-border p-3">
        <Button asChild variant="outline" size="sm" className="w-full">
          <Link to="/knowledge">Open knowledge workspace</Link>
        </Button>
      </div>
    </div>
  );
}

function NotesTab() {
  const { interactionNotes, setInteractionNotes, activeInteraction, logAudit } = useWorkspace();
  return (
    <div className="flex h-full flex-col p-3">
      <p className="mb-2 text-xs text-muted-foreground">
        {activeInteraction
          ? `Notes attach to the active ${activeInteraction.channel.toLowerCase()} interaction with ${activeInteraction.callerLabel}.`
          : "Scratch notes for this session. Attach them to a case when you save."}
      </p>
      <Textarea
        value={interactionNotes}
        onChange={(e) => setInteractionNotes(e.target.value)}
        placeholder="Capture what was discussed, agreed, and promised…"
        className="min-h-[12rem] flex-1 resize-none text-sm"
        aria-label="Interaction notes"
      />
      <Button
        className="mt-2"
        size="sm"
        variant="outline"
        disabled={!interactionNotes.trim()}
        onClick={() => {
          logAudit({ action: "Interaction note saved", record: "Session notes", detail: interactionNotes.slice(0, 160) });
          toast.success("Note saved to the interaction record.");
        }}
      >
        Save note to interaction
      </Button>
    </div>
  );
}

function AuditTab() {
  const { sessionAudit } = useWorkspace();
  return (
    <ScrollArea className="h-full">
      <ul className="space-y-2 p-3">
        {sessionAudit.length === 0 && (
          <li className="text-sm text-muted-foreground">Every reveal, Copilot prompt, and submitted action in this session appears here.</li>
        )}
        {sessionAudit.map((entry) => (
          <li key={entry.id} className="glass rounded-xl p-3">
            <p className="text-sm font-medium text-foreground">{entry.action}</p>
            <p className="text-xs text-muted-foreground">{entry.record}</p>
            <p className="mt-1 text-xs text-muted-foreground">{entry.detail}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {entry.actor} · {dateTime(entry.at)} ({relativeTime(entry.at, new Date())})
            </p>
          </li>
        ))}
      </ul>
    </ScrollArea>
  );
}

export default function UtilityPanel({ contextText, contextLabel }: { contextText: string; contextLabel: string }) {
  const { utilityTab, setUtilityTab, setUtilityOpen } = useWorkspace();

  return (
    <aside
      className="glass z-20 flex h-full w-[22rem] shrink-0 flex-col rounded-none border-y-0 border-r-0"
      aria-label="Copilot and utilities"
    >
      <div className="flex items-center justify-between border-b border-border px-3 py-2">
        <p className="text-sm font-semibold text-foreground">Workspace utilities</p>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setUtilityOpen(false)} aria-label="Collapse utility panel">
          <PanelRightClose className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
      <Tabs value={utilityTab} onValueChange={setUtilityTab} className="flex min-h-0 flex-1 flex-col">
        <TabsList className="mx-3 mt-2 grid grid-cols-4">
          <TabsTrigger value="copilot" className="text-xs"><Bot className="mr-1 h-3 w-3" aria-hidden="true" />Copilot</TabsTrigger>
          <TabsTrigger value="knowledge" className="text-xs"><BookOpen className="mr-1 h-3 w-3" aria-hidden="true" />Know.</TabsTrigger>
          <TabsTrigger value="notes" className="text-xs"><ClipboardList className="mr-1 h-3 w-3" aria-hidden="true" />Notes</TabsTrigger>
          <TabsTrigger value="audit" className="text-xs"><ShieldCheck className="mr-1 h-3 w-3" aria-hidden="true" />Audit</TabsTrigger>
        </TabsList>
        <TabsContent value="copilot" className="mt-2 min-h-0 flex-1">
          <CopilotPanel contextText={contextText} contextLabel={contextLabel} />
        </TabsContent>
        <TabsContent value="knowledge" className="mt-2 min-h-0 flex-1">
          <KnowledgeTab />
        </TabsContent>
        <TabsContent value="notes" className="mt-2 min-h-0 flex-1">
          <NotesTab />
        </TabsContent>
        <TabsContent value="audit" className="mt-2 min-h-0 flex-1">
          <AuditTab />
        </TabsContent>
      </Tabs>
    </aside>
  );
}
