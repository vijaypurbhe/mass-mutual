import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { PERSONAS } from "@/data/seed";
import type { Persona, PersonaId } from "@/types";

export interface SessionAuditEntry {
  id: string;
  at: string;
  actor: string;
  action: string;
  record: string;
  detail: string;
}

export interface ActiveInteraction {
  channel: "Voice" | "Chat";
  callerLabel: string;
  startedAt: number;
  verified: boolean;
  queue: string;
  clientId?: string;
}

export interface CopilotSeed {
  prompt: string;
  contextLabel: string;
}

interface WorkspaceValue {
  persona: Persona;
  personaId: PersonaId;
  setPersona: (id: PersonaId) => void;
  personas: Persona[];
  recentClients: string[];
  addRecentClient: (id: string) => void;
  pinnedClients: string[];
  togglePinned: (id: string) => void;
  revealed: Record<string, boolean>;
  reveal: (key: string) => void;
  isRevealed: (key: string) => boolean;
  activeInteraction: ActiveInteraction | null;
  startInteraction: (i: Omit<ActiveInteraction, "startedAt">) => void;
  updateInteraction: (patch: Partial<ActiveInteraction>) => void;
  endInteraction: () => void;
  sessionAudit: SessionAuditEntry[];
  logAudit: (entry: Omit<SessionAuditEntry, "id" | "at" | "actor"> & { actor?: string }) => void;
  utilityOpen: boolean;
  setUtilityOpen: (open: boolean) => void;
  utilityTab: string;
  setUtilityTab: (tab: string) => void;
  copilotSeed: CopilotSeed | null;
  askCopilot: (seed: CopilotSeed) => void;
  clearCopilotSeed: () => void;
  interactionNotes: string;
  setInteractionNotes: (value: string) => void;
  signedIn: boolean;
  signIn: (id: PersonaId) => void;
  signOut: () => void;
}

const WorkspaceContext = createContext<WorkspaceValue | null>(null);

const STORAGE_KEY = "ufseh.session.v1";

interface Persisted {
  personaId: PersonaId;
  signedIn: boolean;
  recentClients: string[];
  pinnedClients: string[];
}

const readPersisted = (): Persisted | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Persisted) : null;
  } catch {
    return null;
  }
};

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const initial = readPersisted();
  const [personaId, setPersonaId] = useState<PersonaId>(initial?.personaId ?? "service_rep");
  const [signedIn, setSignedIn] = useState(initial?.signedIn ?? false);
  const [recentClients, setRecentClients] = useState<string[]>(initial?.recentClients ?? []);
  const [pinnedClients, setPinnedClients] = useState<string[]>(initial?.pinnedClients ?? ["cl-jordan-lee"]);
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [activeInteraction, setActiveInteraction] = useState<ActiveInteraction | null>(null);
  const [sessionAudit, setSessionAudit] = useState<SessionAuditEntry[]>([]);
  const [utilityOpen, setUtilityOpen] = useState(true);
  const [utilityTab, setUtilityTab] = useState("copilot");
  const [copilotSeed, setCopilotSeed] = useState<CopilotSeed | null>(null);
  const [interactionNotes, setInteractionNotes] = useState("");

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ personaId, signedIn, recentClients, pinnedClients } satisfies Persisted),
    );
  }, [personaId, signedIn, recentClients, pinnedClients]);

  const persona = useMemo(() => PERSONAS.find((p) => p.id === personaId) ?? PERSONAS[0], [personaId]);

  const logAudit = useCallback<WorkspaceValue["logAudit"]>(
    (entry) => {
      setSessionAudit((prev) => [
        {
          id: `sess-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          at: new Date().toISOString(),
          actor: entry.actor ?? persona.name,
          action: entry.action,
          record: entry.record,
          detail: entry.detail,
        },
        ...prev,
      ]);
    },
    [persona.name],
  );

  const value: WorkspaceValue = {
    persona,
    personaId,
    personas: PERSONAS,
    setPersona: (id) => {
      setPersonaId(id);
      setRevealed({});
    },
    recentClients,
    addRecentClient: (id) => setRecentClients((prev) => [id, ...prev.filter((c) => c !== id)].slice(0, 6)),
    pinnedClients,
    togglePinned: (id) => setPinnedClients((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id])),
    revealed,
    reveal: (key) => setRevealed((prev) => ({ ...prev, [key]: true })),
    isRevealed: (key) => Boolean(revealed[key]),
    activeInteraction,
    startInteraction: (i) => setActiveInteraction({ ...i, startedAt: Date.now() }),
    updateInteraction: (patch) => setActiveInteraction((prev) => (prev ? { ...prev, ...patch } : prev)),
    endInteraction: () => setActiveInteraction(null),
    sessionAudit,
    logAudit,
    utilityOpen,
    setUtilityOpen,
    utilityTab,
    setUtilityTab,
    copilotSeed,
    askCopilot: (seed) => {
      setCopilotSeed(seed);
      setUtilityTab("copilot");
      setUtilityOpen(true);
    },
    clearCopilotSeed: () => setCopilotSeed(null),
    interactionNotes,
    setInteractionNotes,
    signedIn,
    signIn: (id) => {
      setPersonaId(id);
      setSignedIn(true);
    },
    signOut: () => {
      setSignedIn(false);
      setActiveInteraction(null);
      setRevealed({});
    },
  };

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

export function useWorkspace() {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error("useWorkspace must be used inside WorkspaceProvider");
  return ctx;
}
